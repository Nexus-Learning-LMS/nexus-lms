import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface CourseIdPageProps {
  params: Promise<{
    courseId: string
  }>
}

const CourseIdPage = async ({ params: paramsPromise }: CourseIdPageProps) => {
  const params = await paramsPromise
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  })

  if (!course) {
    return redirect('/')
  }

  if (course.chapters.length === 0) {
    return redirect('/')
  }

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`)
}

export default CourseIdPage
