import { db } from '@/lib/db'
import { Attachment, Chapter, Course, MuxData, Purchase, UserProgress } from '@prisma/client'

interface GetChapterProps {
  userId: string
  courseId: string
  chapterId: string
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps): Promise<{
  chapter: Chapter | null
  course: Course | null
  muxData: MuxData | null
  attachments: Attachment[]
  nextChapter: Chapter | null
  userProgress: UserProgress | null
  purchase: Purchase | null
}> => {
  try {
    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      include: {
        chapters: {
          where: {
            id: chapterId,
            isPublished: true,
          },
          include: {
            muxData: true,
          },
        },
      },
    })

    if (!course || !course.chapters.length) {
      throw new Error('Course or chapter not found')
    }

    const chapter = course.chapters[0]
    const muxData = chapter.muxData

    // Check for purchase after finding the course
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    const isLocked = !chapter.isFree && !purchase
    if (isLocked) {
      // If the chapter is locked, we don't need to fetch attachments or the next chapter.
      return {
        chapter,
        course,
        muxData,
        attachments: [],
        nextChapter: null,
        userProgress: null,
        purchase,
      }
    }

    // If accessible, fetch remaining data
    const attachments = await db.attachment.findMany({
      where: {
        courseId: courseId,
      },
    })

    const nextChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
        position: {
          gt: chapter.position,
        },
      },
      orderBy: {
        position: 'asc',
      },
    })

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    })

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    }
    // --- End of Refactored Logic ---
  } catch (error) {
    console.log('[GET_CHAPTER]', error)
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    }
  }
}
