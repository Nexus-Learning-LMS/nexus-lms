import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { getProgress } from '@/actions/get-progress'

import { CourseSidebar } from './_components/course-sidebar'
import { CourseNavbar } from './_components/course-navbar'
import { CourseMobileSidebar } from './_components/course-mobile-sidebar'
import { Purchase } from '@prisma/client'

interface CourseLayoutProps {
  children: React.ReactNode
  params: Promise<{
    courseId: string
  }>
}

const CourseLayout = async ({ children, params: paramsPromise }: CourseLayoutProps) => {
  const params = await paramsPromise
  const { userId } = await auth()

  if (!userId) {
    return redirect('/')
  }

  let purchase: Purchase | null = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: params.courseId,
      },
    },
  })

  // When the timer expires, atomically increment the number of unlocked chapters.
  if (purchase?.unlocksAt && new Date(purchase.unlocksAt) <= new Date()) {
    try {
      // This update only succeeds if the unlocksAt field hasn't been changed by another process.
      const updatedPurchase = await db.purchase.update({
        where: {
          id: purchase.id,
          unlocksAt: purchase.unlocksAt, // Ensures atomicity
        },
        data: {
          unlocksAt: null,
          unlockedChapterCount: {
            increment: 1,
          },
        },
      })
      purchase = updatedPurchase
    } catch (error) {
      // If the update failed (likely due to a race condition), fetch the latest record.
      const freshPurchase = await db.purchase.findUnique({
        where: { id: purchase.id },
      })
      if (freshPurchase) {
        purchase = freshPurchase
      }
    }
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
    },
  })

  if (!course) {
    return redirect('/')
  }

  const progressCount = await getProgress(userId, course.id)

  const WINDOW_SIZE = 3
  if (purchase) {
    const paidChapters = course.chapters.filter((c) => !c.isFree)
    const unlockCount = purchase.unlockedChapterCount ?? WINDOW_SIZE
    const windowEnd = unlockCount
    const windowStart = Math.max(0, windowEnd - WINDOW_SIZE)

    course.chapters.forEach((chapter) => {
      if (!chapter.isFree) {
        const chapterIndex = paidChapters.findIndex((c) => c.id === chapter.id)
        ;(chapter as any).isLocked = chapterIndex < windowStart || chapterIndex >= windowEnd
      } else {
        ;(chapter as any).isLocked = false
      }
    })
  } else {
    course.chapters.forEach((chapter) => {
      ;(chapter as any).isLocked = !chapter.isFree
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
