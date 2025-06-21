import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const phone = searchParams.get('phone')

    if (!phone) {
      return new NextResponse('Phone number is required', { status: 400 })
    }

    // --- START OF FIX ---
    // First, try a strict search using the provided phone number.
    const clerk = await clerkClient()
    let usersResponse = await clerk.users.getUserList({ phoneNumber: [phone] })

    // If the strict search finds no users, try a more lenient 'query' search as a fallback.
    if (usersResponse.totalCount === 0) {
      usersResponse = await clerk.users.getUserList({ query: phone })
    }
    // --- END OF FIX ---

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
