import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return new NextResponse('Email is required', { status: 400 })
    }

    const clerk = await clerkClient()
    const usersResponse = await clerk.users.getUserList({ emailAddress: [email] })

    // If the strict search finds no users, try a more lenient 'query' search as a fallback.
    if (usersResponse.totalCount === 0) {
      const usersResponse = await clerk.users.getUserList({ emailAddress: [email] })
    }

    if (usersResponse.totalCount === 0) {
      return new NextResponse('User not found', { status: 404 })
    }
    const user = usersResponse.data[0]

    // Get all courses the user is already enrolled in (purchased)
    const enrolledCourses = await db.purchase.findMany({
      where: { userId: user.id },
      include: { course: true },
    })

    const enrolledCourseIds = enrolledCourses.map((p) => p.courseId)

    // Get all published courses that the user is NOT enrolled in
    const availableCourses = await db.course.findMany({
      where: {
        isPublished: true,
        NOT: {
          id: { in: enrolledCourseIds },
        },
      },
      orderBy: { title: 'asc' },
    })

    const responseData = {
      id: user.id,
      email: user.emailAddresses.length > 0 ? user.emailAddresses[0].emailAddress : null,
      phone: user.phoneNumbers.length > 0 ? user.phoneNumbers[0].phoneNumber : null,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null,
      enrolledCourses,
      availableCourses,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.log('[USERS_GET]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
