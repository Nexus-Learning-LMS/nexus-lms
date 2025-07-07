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
  course: (Course & { chapters: (Chapter & { userProgress: UserProgress[] })[] }) | null
  muxData: MuxData | null
  attachments: Attachment[]
  nextChapter: Chapter | null
  userProgress: UserProgress | null
  purchase: Purchase | null
  isLocked: boolean
  unlocksAt?: Date | null
  isTimerChapter: boolean
  banner?: { variant: 'warning' | 'success' | 'warning2' | 'info'; label: string } | null
}> => {
  try {
    let purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    })

    // When the timer expires, atomically increment the number of unlocked chapters.
    if (purchase?.unlocksAt && new Date(purchase.unlocksAt) <= new Date()) {
      try {
        const updatedPurchase = await db.purchase.update({
          where: {
            id: purchase.id,
            unlocksAt: purchase.unlocksAt,
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
        isPublished: true,
        id: courseId,
      },
      include: {
        chapters: {
          where: { isPublished: true },
          orderBy: { position: 'asc' },
          include: {
            userProgress: {
              where: { userId },
            },
          },
        },
      },
    })

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, isPublished: true },
    })

    if (!chapter || !course) {
      throw new Error('Chapter or course not found')
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    })

    let isLocked = !chapter.isFree && !purchase
    let isTimerChapter = false
    const WINDOW_SIZE = 3
    let banner: { variant: 'warning' | 'success' | 'warning2' | 'info'; label: string } | null = null

    if (purchase) {
      const paidChapters = course.chapters.filter((c) => !c.isFree)
      const unlockCount = purchase.unlockedChapterCount ?? WINDOW_SIZE
      const windowEnd = unlockCount
      const windowStart = Math.max(0, windowEnd - WINDOW_SIZE)

      const chapterIndexInPaidList = paidChapters.findIndex((c) => c.id === chapter.id)

      if (!chapter.isFree) {
        isLocked = chapterIndexInPaidList < windowStart || chapterIndexInPaidList >= windowEnd
        if (purchase.unlocksAt && chapterIndexInPaidList === windowEnd) {
          isTimerChapter = true
        }
      }
    }

    // --- ADDED BANNER LOGIC ---
    const isChapterCompleted = !!userProgress?.isCompleted

    if (isChapterCompleted && !isLocked) {
      banner = {
        variant: 'success',
        label: 'You have already completed this chapter.',
      }
    }

    if (isLocked) {
      if (!purchase) {
        banner = {
          variant: 'warning2',
          label: "To watch this chapter, please enroll in the course by clicking 'Enroll Now' below!",
        }
      } else if (isChapterCompleted) {
        banner = {
          variant: 'warning2',
          label: 'You have finished this chapter, great job! It’s now locked as we move ahead — keep learning!',
        }
      } else {
        banner = {
          variant: 'warning2',
          label: 'This chapter is currently locked. Complete previous chapters in the course to unlock it.',
        }
      }
    }

    if (!isLocked && !isChapterCompleted && !chapter.isFree) {
      banner = {
        variant: 'info',
        label:
          'Before moving on, make sure you have understood the lecture and taken notes. Feel free to ask any questions at nexuslearning.team@gmail.com. Once you move ahead, you may lose access to this chapter — so take your time and learn well!',
      }
    }

    let muxData = null
    let attachments: Attachment[] = []
    if (!isLocked) {
      muxData = await db.muxData.findUnique({ where: { chapterId } })
      attachments = await db.attachment.findMany({ where: { courseId } })
    }

    const nextChapter = await db.chapter.findFirst({
      where: { courseId, isPublished: true, position: { gt: chapter.position } },
      orderBy: { position: 'asc' },
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
      unlocksAt: purchase?.unlocksAt,
      isTimerChapter,
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
      isTimerChapter: false,
      banner: null,
    }
  }
}
