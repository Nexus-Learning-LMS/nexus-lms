// import { Chapter, Course, UserProgress } from '@prisma/client'

// import { NavbarRoutes } from '@/components/navbar-routes'

// import { CourseMobileSidebar } from './course-mobile-sidebar'

// interface CourseNavbarProps {
//   course: Course & {
//     chapters: (Chapter & {
//       userProgress: UserProgress[] | null
//     })[]
//   }
//   progressCount: number
// }

// export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
//   return (
//     <div className="p-4 border-b h-full flex items-center bg-brand-deep-blue shadow-sm">
//       <CourseMobileSidebar course={course} progressCount={progressCount} />
//       <NavbarRoutes />
//     </div>
//   )
// }
'use client'

import { Chapter, Course, UserProgress } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { NavbarRoutes } from '@/components/navbar-routes'

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null
    })[]
  }
  progressCount: number
  children: React.ReactNode // This will be the CourseMobileSidebar
}

export const CourseNavbar = ({ course, progressCount, children }: CourseNavbarProps) => {
  const router = useRouter()

  return (
    <div className="p-4 border-b h-full flex items-center bg-brand-deep-blue text-white shadow-sm">
      {/* --- START OF CHANGE: Corrected Responsive Layout --- */}
      <div className="w-full flex items-center justify-between">
        {/* Left Section: Renders hamburger on mobile and a spacer on desktop */}
        <div className="flex-1 flex justify-start">
          <div className="min-[890px]:hidden">{children}</div>
          {/* Invisible spacer to balance the Exit button on desktop */}
          <div className="hidden min-[890px]:block w-24" />
        </div>

        {/* Center Section: Renders NavbarRoutes on desktop and Course Title on mobile */}
        <div className="hidden min-[890px]:flex justify-center">
          <NavbarRoutes />
        </div>
        <h1 className="min-[890px]:hidden text-md font-semibold text-center truncate px-2">{course.title}</h1>

        {/* Right Section: Exit Button */}
        <div className="flex-1 flex justify-end">
          <Button
            onClick={() => router.push('/search')}
            className="text-white hover:bg-white/10"
            variant="ghost"
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            {/* The "Exit" text is now only visible on desktop */}
            <span className="hidden min-[890px]:inline ml-2">Exit</span>
          </Button>
        </div>
      </div>
      {/* --- END OF CHANGE --- */}
    </div>
  )
}
