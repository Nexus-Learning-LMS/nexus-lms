'use client'

import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { User, CheckCircle, XCircle, Search, UserCheck, Loader2 } from 'lucide-react'
import { Course, Purchase } from '@prisma/client'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface FoundUser {
  id: string
  email: string | null // Email can be null if user signs up with phone only
  phone: string | null
  name: string | null
  enrolledCourses: (Purchase & { course: Course })[]
  availableCourses: Course[]
}

export const EnrollmentClient = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [foundUser, setFoundUser] = useState<FoundUser | null>(null)

  // State for the confirmation modal
  const [modalData, setModalData] = useState<{
    action: 'grant' | 'revoke'
    course: Course
    purchaseId?: string
  } | null>(null)

  const handleSearch = async () => {
    if (!email) {
      toast.error("Please enter a user's email address.")
      return
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }
    setIsLoading(true)
    setFoundUser(null)
    try {
      const response = await axios.get(`/api/users?email=${email}`)
      setFoundUser(response.data)
    } catch (error) {
      toast.error('User not found or an error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async () => {
    if (!modalData || !foundUser) return

    setIsLoading(true)

    try {
      if (modalData.action === 'grant') {
        await axios.post('/api/enrollments', {
          userId: foundUser.id,
          courseId: modalData.course.id,
        })
        toast.success(`Access granted for ${modalData.course.title}`)
      } else if (modalData.action === 'revoke') {
        await axios.delete(`/api/enrollments/${modalData.purchaseId}`)
        toast.success(`Access revoked for ${modalData.course.title}`)
      }
      // Refresh data after action
      handleSearch()
    } catch (error) {
      toast.error('Something went wrong.')
    } finally {
      setIsLoading(false)
      setModalData(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* STEP 1: FIND USER */}
      <div className="p-6 border rounded-lg bg-slate-50">
        <h2 className="text-lg font-semibold text-brand-deep-blue mb-4">Step 1: Find User</h2>
        <p className="text-sm text-slate-600 mb-4">Start by finding their account by email</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter user's email address"
            className="h-12"
            disabled={isLoading}
          />
          <Button onClick={handleSearch} disabled={isLoading} className="h-12">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                {foundUser ? 'Find Another User' : 'Find User'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* STEP 2: MANAGE ENROLLMENTS (Conditional) */}
      {foundUser && (
        <div className="space-y-8">
          <div className="flex items-center gap-x-2 p-4 bg-sky-100/70 border border-sky-200 rounded-lg">
            <UserCheck className="h-6 w-6 text-sky-700" />
            <p className="font-medium text-sky-800">
              Displaying enrollments for: {foundUser.name || 'N/A'} ({foundUser.phone || foundUser.email})
            </p>
          </div>

          {/* Currently Enrolled Courses */}
          <div className="p-6 border rounded-lg">
            <h2 className="text-lg font-semibold text-brand-deep-blue mb-4">Currently Enrolled Courses</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Title</TableHead>
                  <TableHead>Enrolled On</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foundUser.enrolledCourses.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.course.title}</TableCell>
                    <TableCell>{format(new Date(purchase.createdAt), 'do MMMM yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        className="bg-red-600 hover:bg-red-800 text-white"
                        size="sm"
                        onClick={() =>
                          setModalData({ action: 'revoke', course: purchase.course, purchaseId: purchase.id })
                        }
                      >
                        Revoke Access
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {foundUser.enrolledCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-slate-500">
                      This user is not enrolled in any courses.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Grant Access to a New Course */}
          <div className="p-6 border rounded-lg">
            <h2 className="text-lg font-semibold text-brand-deep-blue mb-4">Grant Access to a New Course</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Title</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foundUser.availableCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.title}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-emerald-700 text-white"
                        onClick={() => setModalData({ action: 'grant', course })}
                      >
                        Grant Access
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {foundUser.availableCourses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-slate-500">
                      This user is already enrolled in all available courses.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <AlertDialog open={!!modalData} onOpenChange={() => setModalData(null)}>
        <AlertDialogContent className="bg-brand-blue-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {modalData?.action === 'grant' ? 'Confirm Enrollment' : 'Confirm Revocation'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {modalData?.action === 'grant' ? 'GRANT access to' : 'REVOKE access from'} &quot;
              {modalData?.course.title}&quot; for {foundUser?.name || foundUser?.email}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-brand-deep-blue hover:bg-gray-200">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className="bg-brand-dark-blue text-white hover:text-brand-deep-blue"
            >
              Yes, {modalData?.action === 'grant' ? 'Grant Access' : 'Revoke Access'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
