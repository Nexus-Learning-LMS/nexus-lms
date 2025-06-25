'use client'

import axios from 'axios'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { useConfettiStore } from '@/hooks/use-confetti-store'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface CourseProgressButtonProps {
  chapterId: string
  courseId: string
  isCompleted?: boolean
  nextChapterId?: string
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter()
  const confetti = useConfettiStore()
  const [isLoading, setIsLoading] = useState(false)

  const [dontShowAgain, setDontShowAgain] = useState(false)
  // --- START OF CHANGE: Added state to manually control the modal ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  // --- END OF CHANGE ---

  const handleMarkComplete = async () => {
    try {
      setIsLoading(true)

      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: true,
      })

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen()
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
      }

      toast.success('Progress updated')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  // --- START OF CHANGE: Updated onClick logic ---
  const onClick = () => {
    const hasSkippedWarning = localStorage.getItem('skipChapterCompletionWarning') === 'true'

    if (hasSkippedWarning) {
      handleMarkComplete()
    } else {
      // Manually trigger the modal to open
      setIsModalOpen(true)
    }
  }
  // --- END OF CHANGE ---

  const onConfirm = () => {
    if (dontShowAgain) {
      localStorage.setItem('skipChapterCompletionWarning', 'true')
    }
    handleMarkComplete()
    setIsModalOpen(false) // Close the modal after confirming
  }

  if (isCompleted) {
    return (
      <Button disabled type="button" variant="success" className="w-full md:w-auto">
        Completed
        <CheckCircle className="h-4 w-4 ml-2" />
      </Button>
    )
  }

  // --- START OF CHANGE: The AlertDialog is now controlled by state ---
  // The Button is now separate from the AlertDialog component itself.
  return (
    <>
      <Button onClick={onClick} disabled={isLoading} type="button" variant="success" className="w-full md:w-auto">
        Mark as complete
        <CheckCircle className="h-4 w-4 ml-2" />
      </Button>
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="bg-brand-blue-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Completion</AlertDialogTitle>
            <AlertDialogDescription>
              Please ensure you have watched the lecture and taken notes; once you proceed, you may lose access to this
              one. Confirm by selecting &quot;Yes.&quot;
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 my-4">
            <Checkbox
              id="dont-show-again"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(!!checked)}
            />
            <Label
              htmlFor="dont-show-again"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Do not show this again
            </Label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
  // --- END OF CHANGE ---
}
