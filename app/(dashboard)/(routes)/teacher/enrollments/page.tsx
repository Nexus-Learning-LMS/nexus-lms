import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { EnrollmentClient } from './_components/enrollment-client'
import { isTeacher } from '@/lib/teacher'

const EnrollmentsPage = async () => {
  const { userId } = await auth()

  if (!userId || !isTeacher(userId)) {
    return redirect('/')
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Manage User Enrollments</h1>
        <p className="text-sm text-slate-700">Grant or revoke course access for a specific user.</p>
      </div>
      <div className="mt-8">
        <EnrollmentClient />
      </div>
    </div>
  )
}

export default EnrollmentsPage
