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
    const { isPublished, playbackId, assetId, ...values } = await req.json()

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

    // If assetId is provided, fetch the latest playbackId from Mux API
    let finalPlaybackId = playbackId
    if (assetId) {
      // Fetch full asset details from Mux
      const asset = await Video.Assets.get(assetId)

      // Find the public playback ID from Mux asset playback_ids
      const publicPlaybackId = asset.playback_ids?.find((p: any) => p.policy === 'public')?.id

      if (!publicPlaybackId) {
        throw new Error('No public playback ID found for asset ' + assetId)
      }

      finalPlaybackId = publicPlaybackId

      // Delete existing muxData if any
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId: params.chapterId },
      })
      if (existingMuxData) {
        await Video.Assets.del(existingMuxData.assetId)
        await db.muxData.delete({ where: { id: existingMuxData.id } })
      }

      // Save muxData with the correct assetId and playbackId from Mux API
      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId,
          playbackId: finalPlaybackId,
        },
      })
    }

    // Update chapter with new values and videoUrl based on finalPlaybackId
    const updatedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
        videoUrl: finalPlaybackId ? `https://stream.mux.com/${finalPlaybackId}.m3u8` : '',
        isPublished,
      },
    })

    return NextResponse.json(updatedChapter)
  } catch (error) {
    console.log('[COURSES_CHAPTER_ID]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

// ✅ Added GET handler to support axios.get from frontend
export async function GET(req: Request, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      include: {
        muxData: true, // ✅ Include muxData to access playbackId from frontend
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
