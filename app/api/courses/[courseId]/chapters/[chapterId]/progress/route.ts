import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function PUT(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth()
    const { isCompleted } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await db.userProgress.upsert({
      where: { userId_chapterId: { userId, chapterId: params.chapterId } },
      update: { isCompleted },
      create: { userId, chapterId: params.chapterId, isCompleted },
    })

    // --- NEW TIMER TRIGGER LOGIC ---
    if (isCompleted) {
      try {
        const purchase = await db.purchase.findUnique({
          where: { userId_courseId: { userId, courseId: params.courseId } },
        })

        // A timer should not start if one is already active or if the purchase doesn't exist.
        if (!purchase || purchase.unlocksAt) {
          return NextResponse.json({ success: true })
        }

        const paidChapters = await db.chapter.findMany({
          where: { courseId: params.courseId, isPublished: true, isFree: false },
          orderBy: { position: 'asc' },
        })

        // Ensure unlockedChapterCount has a value; default to the initial window size if null.
        const unlockCount = purchase.unlockedChapterCount ?? 3

        // The user must complete all currently unlocked chapters to trigger the next timer.
        const chaptersRequiredForNextTimer = paidChapters.slice(0, unlockCount)
        if (chaptersRequiredForNextTimer.length === 0) {
          return NextResponse.json({ success: true })
        }

        const requiredChapterIds = chaptersRequiredForNextTimer.map((c) => c.id)

        const completedRequiredChapters = await db.userProgress.count({
          where: {
            userId,
            isCompleted: true,
            chapterId: { in: requiredChapterIds },
          },
        })

        // If the count of completed chapters matches the number required, the window is clear.
        if (completedRequiredChapters === requiredChapterIds.length) {
          const twentyFourHoursFromNow = new Date(Date.now() + 24* 60* 60 * 1000)
          await db.purchase.update({
            where: { id: purchase.id },
            data: { unlocksAt: twentyFourHoursFromNow },
          })
        }
      } catch (error) {
        console.log('[TIMER_TRIGGER_ERROR]', error)
      }
    }
    // --- END OF NEW LOGIC ---

    return NextResponse.json({ success: true })
  } catch (error) {
    console.log('[CHAPTER_ID_PROGRESS]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
