import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch only the necessary fields for all published courses
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        createdAt: 'desc', // Show newest courses first
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.log('[PUBLIC_COURSES_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
