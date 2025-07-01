import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { getProgress } from '@/actions/get-progress'

export async function PUT(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ courseId: string; chapterId: string }> },
) {
  const params = await paramsPromise
  try {
    const { userId } = await auth()
    const { isCompleted } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId: params.chapterId,
        isCompleted,
      },
    })

    const progressPercentage = await getProgress(userId, params.courseId)

    let courseCompleted = false
    if (progressPercentage === 100) {
      courseCompleted = true
    }

    return NextResponse.json({ userProgress, courseCompleted })
  } catch (error) {
    console.log('[CHAPTER_ID_PROGRESS]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
