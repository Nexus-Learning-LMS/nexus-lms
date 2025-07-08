import Mux from '@mux/mux-node'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!)

export async function DELETE(req: Request, { params: paramsPromise }: { params: Promise<{ courseId: string }> }) {
  const params = await paramsPromise
  try {
    const { userId } = await auth()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    })

    if (!course) {
      return new NextResponse('Not found', { status: 404 })
    }

    if (course.userId !== userId && !(isTeacher(userId) && course.isPublished)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId)
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    })

    return NextResponse.json(deletedCourse)
  } catch (error) {
    console.log('[COURSE_ID_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params: paramsPromise }: { params: Promise<{ courseId: string }> }) {
  const params = await paramsPromise
  try {
    const { userId } = await auth()
    const { courseId } = params
    const values = await req.json()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // First, find the course without checking for ownership.
    const courseToUpdate = await db.course.findUnique({
      where: { id: courseId },
    })

    if (!courseToUpdate) {
      return new NextResponse('Not found', { status: 404 })
    }

    // Now, check if the user is authorized.
    const isOwner = courseToUpdate.userId === userId
    const isAdmin = isTeacher(userId)

    // An admin can edit if they are the owner OR if the course is published.
    if (!isOwner && !(isAdmin && courseToUpdate.isPublished)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // If authorized, perform the update.
    const course = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log('[COURSE_ID]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
