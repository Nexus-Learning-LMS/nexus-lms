import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

// Grant access by creating a Purchase record
export async function POST(req: Request) {
  try {
    // const { sessionClaims } = auth()
    // if (sessionClaims?.metadata?.role !== 'admin') {
    //   return new NextResponse('Unauthorized', { status: 401 })
    // }

    const { userId, courseId } = await req.json()

    if (!userId || !courseId) {
      return new NextResponse('User ID and Course ID are required', { status: 400 })
    }

    const purchase = await db.purchase.create({
      data: {
        userId,
        courseId,
      },
    })

    return NextResponse.json(purchase)
  } catch (error) {
    console.log('[ENROLLMENTS_POST]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
