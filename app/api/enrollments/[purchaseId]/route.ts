import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

// Revoke access by deleting a Purchase record
export async function DELETE(req: Request, { params }: { params: { purchaseId: string } }) {
  try {
    // const { sessionClaims } = auth()
    // if (sessionClaims?.metadata?.role !== 'admin') {
    //   return new NextResponse('Unauthorized', { status: 401 })
    // }

    // --- START OF CHANGE ---
    // Find the purchase record to get userId and courseId before deleting
    const purchase = await db.purchase.findUnique({
      where: {
        id: params.purchaseId,
      },
      select: {
        userId: true,
        courseId: true,
      },
    })

    if (!purchase) {
      return new NextResponse('Purchase not found', { status: 404 })
    }

    // Find all chapters for the course
    const chapters = await db.chapter.findMany({
      where: { courseId: purchase.courseId },
      select: { id: true },
    })
    const chapterIds = chapters.map((c) => c.id)

    // Delete all UserProgress records for this user in this course's chapters
    await db.userProgress.deleteMany({
      where: {
        userId: purchase.userId,
        chapterId: {
          in: chapterIds,
        },
      },
    })

    // Finally, delete the purchase record itself to revoke access
    const deletedPurchase = await db.purchase.delete({
      where: {
        id: params.purchaseId,
      },
    })

    return NextResponse.json(deletedPurchase)
    // --- END OF CHANGE ---
  } catch (error) {
    console.log('[ENROLLMENTS_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
