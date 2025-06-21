'use client'

import { UserButton, useAuth } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Compass, Layout, User, List, BarChart, BookUser } from 'lucide-react'

import { Button } from '@/components/ui/button'

const guestRoutes = [
  {
    icon: Layout,
    label: 'Home',
    href: '/',
  },
  {
    icon: Compass,
    label: 'Our Courses',
    href: '/search',
  },
  {
    icon: Compass,
    label: 'Our Team',
    href: '/#team',
  },
  {
    icon: Compass,
    label: 'Why Nexus?',
    href: '/#why-nexus',
  },
  {
    icon: User,
    label: 'Contact Us',
    href: '/contact',
  },
]

const teacherRoutes = [
  { icon: List, label: 'Courses', href: '/teacher/courses' },
  { icon: BarChart, label: 'Analytics', href: '/teacher/analytics' },
  { icon: BookUser, label: 'User Enrollments', href: '/teacher/enrollments' },
]

export const NavbarRoutes = () => {
  const { userId, sessionClaims } = useAuth()
  const pathname = usePathname()

  // // Check if the user is a teacher based on Clerk session metadata
  // const isTeacher = sessionClaims?.metadata?.role === 'admin'

  const isTeacherPage = pathname?.startsWith('/teacher')
  const isCoursePage = pathname?.includes('/courses')

  const routes = isTeacherPage ? teacherRoutes : guestRoutes

  // Helper component for a single navigation link with updated styles
  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href
    return (
      <Link href={href}>
        <div
          className={`
            px-4 py-2 rounded-md text-sm font-medium transition-all
            ${
              isActive
                ? ' text-blue-600' // Selected state
                : 'text-slate-300 hover:bg-brand-light-gray hover:text-brand-deep-blue' // Default and Hover states
            }
          `}
        >
          {label}
        </div>
      </Link>
    )
  }

  return (
    // This container manages the three sections of the navbar for proper centering
    <div className="flex items-center justify-between w-full">
      {/* Left spacer (to help center the middle links) */}
      <div className=""></div> {/* Invisible spacer to balance the logo width */}
      {/* Middle Navigation Links (Desktop Only) */}
      <div className="hidden md:flex gap-x-6 mx-auto">
        {routes.map((route) => (
          <NavLink key={route.href} href={route.href} label={route.label} />
        ))}
      </div>
      {/* Right-side Auth and Action Buttons */}
      <div className="flex gap-x-2 items-center">
        {userId && (isTeacherPage || isCoursePage) ? (
          <Link href="/">
            <Button size="sm" variant="secondary" className="text-white hover:bg-white/10">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : userId ? (
          <Link href="/teacher/courses">
            <Button className="w-full sm:w-auto text-white border-white hover:bg-white/10text-white hover:bg-white/10">
              Teacher mode
            </Button>
          </Link>
        ) : null}

        {userId ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <div className="flex gap-x-2">
            <Link href="/sign-in">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-brand-primary-blue text-white hover:bg-brand-dark-blue">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
