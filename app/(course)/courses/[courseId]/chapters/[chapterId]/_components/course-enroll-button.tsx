'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export const CourseEnrollButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onClick = () => {
    setIsLoading(true)
    router.push('/contact')
  }
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto bg-brand-dark-blue text-white hover:text-black focus:bg-brand-deep-blue focus:text-white"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enroll Now'}
    </Button>
  )
}
