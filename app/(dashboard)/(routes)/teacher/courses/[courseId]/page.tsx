import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react'
export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'
import { IconBadge } from '@/components/icon-badge'
import { Banner } from '@/components/banner'

import { TitleForm } from './_components/title-form'
import { DescriptionForm } from './_components/description-form'
import { ImageForm } from './_components/image-form'
import { CategoryForm } from './_components/category-form'
import { ChaptersForm } from './_components/chapters-form'
import { Actions } from './_components/actions'

interface CourseIdPageProps {
  params: Promise<{
    courseId: string
  }>
}

const CourseIdPage = async ({ params: paramsPromise }: CourseIdPageProps) => {
  const params = await paramsPromise
  const { userId } = await auth()

  if (!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        orderBy: {
          position: 'asc',
        },
      },
    },
  })

  // If the course doesn't exist, redirect.
  if (!course) {
    return redirect('/')
  }

  // Now, perform the authorization check.
  // The user is the owner of the course.
  const isOwner = course.userId === userId
  // The user is an admin (as defined by your helper).
  const isAdmin = isTeacher(userId)

  // An admin is authorized if they are the owner OR if the course is published.
  // This allows any admin to edit a live course.
  const isAuthorized = isOwner || (isAdmin && course.isPublished)

  if (!isAuthorized) {
    return redirect('/')
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  if (!course) {
    return redirect('/')
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    // course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields}/${totalFields})`

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." variant="warning2" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
          </div>
          <Actions disabled={!isComplete} courseId={params.courseId} isPublished={course.isPublished} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseIdPage
