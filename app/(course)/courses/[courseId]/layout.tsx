import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { getProgress } from '@/actions/get-progress'

import { CourseSidebar } from './_components/course-sidebar'
import { CourseNavbar } from './_components/course-navbar'
import { CourseMobileSidebar } from './_components/course-mobile-sidebar'

interface CourseLayoutProps {
  children: React.ReactNode
  params: Promise<{
    courseId: string
  }>
}

const CourseLayout = async ({ children, params: paramsPromise }: CourseLayoutProps) => {
  // Await the promise to get the resolved params object
  const params = await paramsPromise
  const { userId } = await auth()

  if (!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      },
      purchases: {
        where: {
          userId,
        },
      },
    },
  })

  if (!course) {
    return redirect('/')
  }

  const progressCount = await getProgress(userId, course.id)
  const hasPurchased = course.purchases.length > 0

  // Apply the rolling window logic
  if (hasPurchased) {
    const paidChapters = course.chapters.filter((chapter) => !chapter.isFree)
    const completedPaidChapters = paidChapters.filter((chapter) => chapter.userProgress?.[0]?.isCompleted)

    // Find the position of the last completed non-free chapter.
    // If none are complete, this will be -1, so the window starts at chapter 0.
    const lastCompletedPosition =
      completedPaidChapters.length > 0 ? Math.max(...completedPaidChapters.map((c) => c.position)) : -1

    // The window of unlocked chapters starts after the last completed one.
    const unlockWindowStart = paidChapters.findIndex((c) => c.position > lastCompletedPosition)

    course.chapters.forEach((chapter) => {
      if (!chapter.isFree) {
        const chapterIndexInPaidList = paidChapters.findIndex((c) => c.id === chapter.id)
        // A chapter is locked if it's outside the 3-chapter window
        const isLocked = chapterIndexInPaidList < unlockWindowStart || chapterIndexInPaidList >= unlockWindowStart + 3
        // We attach our calculated lock status to the chapter object.
        // The 'any' type is used here to dynamically add a property.
        ;(chapter as any).isLocked = isLocked
      } else {
        ;(chapter as any).isLocked = false // Free chapters are never locked
      }
    })
  }

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount}>
          <CourseMobileSidebar course={course} progressCount={progressCount} />
        </CourseNavbar>
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  )
}

export default CourseLayout
