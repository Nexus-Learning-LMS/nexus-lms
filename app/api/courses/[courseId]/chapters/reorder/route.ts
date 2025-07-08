import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

export async function PUT(req: Request, { params: paramsPromise }: { params: Promise<{ courseId: string }> }) {
  const params = await paramsPromise
  try {
    const { userId } = await auth()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { list } = await req.json()

    const course = await db.course.findUnique({
      where: { id: params.courseId },
    })

    if (!course) {
      return new NextResponse('Not Found', { status: 404 })
    }

    if (course.userId !== userId && !(isTeacher(userId) && course.isPublished)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      })
    }

    return new NextResponse('Success', { status: 200 })
  } catch (error) {
    console.log('[REORDER]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
