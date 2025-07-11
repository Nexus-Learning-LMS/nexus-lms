import { Category, Course } from '@prisma/client'

import { db } from '@/lib/db'

type CourseWithProgressWithCategory = Course & {
  category: Category | null
  chapters: { id: string }[]
  progress: number | null
}

type GetCourses = {
  userId: string
  title?: string
  categoryId?: string
}

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
          mode: 'insensitive',
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
            userProgress: {
              where: {
                userId,
              },
            },
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const coursesWithProgress = courses.map((course) => {
      if (course.purchases.length === 0) {
        return { ...course, progress: null }
      }

      const chaptersWithProgress = course.chapters.filter((chapter) => chapter.userProgress.length > 0)
      const completedChapters = chaptersWithProgress.filter((chapter) => chapter.userProgress[0].isCompleted)

      const progressPercentage = (completedChapters.length / course.chapters.length) * 100

      return {
        ...course,
        progress: progressPercentage,
      }
    })

    return coursesWithProgress
  } catch (error) {
    console.log('[GET_COURSES]', error)
    return []
  }
}
