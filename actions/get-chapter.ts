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
  course: (Course & { chapters: Chapter[] }) | null
  muxData: MuxData | null
  attachments: Attachment[]
  nextChapter: Chapter | null
  userProgress: UserProgress | null
  purchase: Purchase | null
  isLocked: boolean
  banner?: { variant: 'warning' | 'success' | 'warning2' | 'info'; label: string } | null
}> => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      include: {
        // Use include to get all course fields
        chapters: {
          // We still need all chapters to calculate the window
          where: { isPublished: true },
          orderBy: { position: 'asc' },
        },
      },
    })

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    })

    if (!chapter || !course) {
      throw new Error('Chapter or course not found')
    }

    let muxData = null
    let attachments: Attachment[] = []
    let nextChapter: Chapter | null = null
    let userProgress = null
    let banner: { variant: 'warning' | 'success' | 'warning2' | 'info'; label: string } | null = null

    const hasPurchased = !!purchase
    let isLocked = !chapter.isFree && !hasPurchased

    if (hasPurchased) {
      const allUserProgress = await db.userProgress.findMany({
        where: { userId, chapterId: { in: course.chapters.map((c) => c.id) } },
      })

      const paidChapters = course.chapters.filter((c) => !c.isFree)
      const firstUncompletedIndex = paidChapters.findIndex(
        (c) => !allUserProgress.some((p) => p.chapterId === c.id && p.isCompleted),
      )

      const chapterIndexInPaidList = paidChapters.findIndex((c) => c.id === chapter.id)
      const isChapterCompleted = allUserProgress.some((p) => p.chapterId === chapter.id && p.isCompleted)

      if (!chapter.isFree) {
        // If all paid chapters are complete, lock them all. Otherwise, apply window logic.
        if (firstUncompletedIndex === -1) {
          isLocked = true
        } else {
          isLocked =
            chapterIndexInPaidList < firstUncompletedIndex || chapterIndexInPaidList >= firstUncompletedIndex + 3
        }
      }

      if (isLocked) {
        if (isChapterCompleted) {
          banner = {
            variant: 'warning2',
            label: 'You have finished this chapter, great job! It’s now locked as we move ahead — keep learning!',
          }
        } else {
          const prerequisiteIndex = chapterIndexInPaidList - 3
          if (prerequisiteIndex >= 0) {
            const chapterToComplete = paidChapters[prerequisiteIndex]
            if (chapterToComplete) {
              banner = {
                variant: 'warning2',
                label: `Complete Chapter ${chapterToComplete.position}: “${chapterToComplete.title}” to unlock this one. Keep going!`,
              }
            }
          }
        }
      } else if (!isChapterCompleted && !chapter.isFree) {
        banner = {
          variant: 'info',
          label:
            'Before moving on, make sure you have understood the lecture and taken notes. Feel free to ask any questions at nexuslearning.team@gmail.com. Once you move ahead, you may lose access to this chapter — so take your time and learn well!',
        }
      }
    } else if (isLocked) {
      banner = {
        variant: 'warning2',
        label: "To watch this chapter, please enroll in the course by clicking 'Enroll Now' below!",
      }
    }

    userProgress = await db.userProgress.findUnique({
      where: { userId_chapterId: { userId, chapterId } },
    })

    if (userProgress?.isCompleted && !isLocked) {
      banner = { variant: 'success', label: 'You already completed this chapter.' }
    }

    // Only fetch the video data if the chapter is not locked
    if (!isLocked) {
      muxData = await db.muxData.findUnique({
        where: { chapterId: chapterId },
      })

      attachments = await db.attachment.findMany({
        where: { courseId: courseId },
      })
    }

    // Find the next chapter regardless of lock status for UI purposes
    nextChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
        position: { gt: chapter.position },
      },
      orderBy: { position: 'asc' },
    })

    userProgress = await db.userProgress.findUnique({
      where: { userId_chapterId: { userId, chapterId } },
    })

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
      isLocked,
      banner,
    }
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
      isLocked: true,
      banner: null,
    }
  }
}
