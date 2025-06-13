import Mux from '@mux/mux-node'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'

const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!)

export async function DELETE(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    })

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    })

    if (!chapter) {
      return new NextResponse('Not Found', { status: 404 })
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      })

      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId)
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        })
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    })

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    })

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      })
    }

    return NextResponse.json(deletedChapter)
  } catch (error) {
    console.log('[CHAPTER_ID_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = await auth()
    const { isPublished, playbackId, assetId, videoUrl, ...values } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    })

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (videoUrl === null) {
      const chapter = await db.chapter.findUnique({
        where: { id: params.chapterId, courseId: params.courseId },
      })

      if (!chapter) {
        return new NextResponse('Chapter not found', { status: 404 })
      }

      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      })

      if (existingMuxData) {
        // Delete the Mux asset if it exists
        await Video.Assets.del(existingMuxData.assetId)
        // Delete the muxData record
        await db.muxData.delete({ where: { id: existingMuxData.id } })
      }

      // Update chapter to remove videoUrl and muxData
      const updatedChapter = await db.chapter.update({
        where: {
          id: params.chapterId,
          courseId: params.courseId,
        },
        data: {
          videoUrl: null,
          isPublished: false,
        },
      })
      return NextResponse.json(updatedChapter)
    }

    // logic for adding/ updating a video
    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
        videoUrl, //videoUrl is passed directly now
      },
    })

    if (assetId && playbackId) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      })

      if (existingMuxData) {
        // this logic prevents re-deleting a new asset if you are just updating text fields.
        if (existingMuxData.assetId !== assetId) {
          // Delete the existing Mux asset
          await Video.Assets.del(existingMuxData.assetId)
          // Delete the existing muxData record
          await db.muxData.delete({ where: { id: existingMuxData.id } })
        }
      }

      //Ensure muxData is only created if it doesnt already exist for the asset
      const muxDataExists = await db.muxData.findFirst({
        where: { assetId: assetId },
      })

      if (!muxDataExists) {
        await db.muxData.create({
          data: {
            chapterId: params.chapterId,
            assetId: assetId,
            playbackId: playbackId,
          },
        })
      }
    }
    return NextResponse.json(chapter)
  } catch (error) {
    console.log('[COURSES_CHAPTER_ID]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// GET handler to support axios.get from frontend

export async function GET(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      include: {
        muxData: true, //  Include muxData to access playbackId from frontend
      },
    })

    if (!chapter) {
      return new NextResponse('Not Found', { status: 404 })
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.log('[CHAPTER_ID_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
