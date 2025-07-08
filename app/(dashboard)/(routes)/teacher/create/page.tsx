import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isTeacher } from '@/lib/teacher'

// Import the new client component
import { CreateCourseForm } from './_components/create-course-form'

const CreatePage = async () => {
  const { userId } = await auth()

  // This is a pure Server Component. It handles the security check.
  if (!userId || !isTeacher(userId)) {
    return redirect('/')
  }

  // If authorized, it renders the Client Component which contains the form.
  // This separation of concerns fixes the build error.
  return <CreateCourseForm />
}

export default CreatePage
