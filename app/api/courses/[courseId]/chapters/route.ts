import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

export async function POST(req: Request, { params: paramsPromise }: { params: Promise<{ courseId: string }> }) {
  const params = await paramsPromise
  try {
    const { userId } = await auth()
    const { title } = await req.json()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course) {
      return new NextResponse('Not Found', { status: 404 })
    }

    if (course.userId !== userId && !(isTeacher(userId) && course.isPublished)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: 'desc',
      },
    })

    const newPosition = lastChapter ? lastChapter.position + 1 : 1

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: params.courseId,
        position: newPosition,
      },
    })

    return NextResponse.json(chapter)
  } catch (error) {
    console.log('[CHAPTERS]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
