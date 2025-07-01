import { auth } from '@clerk/nextjs/server'
import { Chapter, Course, UserProgress } from '@prisma/client'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { CourseProgress } from '@/components/course-progress'
import { CourseSidebarItem } from './course-sidebar-item'

type ChapterWithLockStatus = Chapter & {
  userProgress: UserProgress[] | null
  isLocked?: boolean // This property is now expected
}

interface CourseSidebarProps {
  course: Course & {
    chapters: ChapterWithLockStatus[]
  }
  progressCount: number
}

export const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
  const { userId } = await auth()
  if (!userId) {
    return redirect('/')
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  })

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold text-brand-primary-blue">Course: {course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            // Use the calculated lock status. Fallback to original logic if not purchased.
            isLocked={chapter.isLocked !== undefined ? chapter.isLocked : !chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  )
}
