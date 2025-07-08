import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

export async function PATCH(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ courseId: string; chapterId: string }> },
) {
  const params = await paramsPromise
  try {
    const { userId } = await auth()

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

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    })

    if (!chapter || !chapter.title || !chapter.description || !chapter.videoUrl) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    })

    return NextResponse.json(publishedChapter)
  } catch (error) {
    console.log('[CHAPTER_PUBLISH]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
