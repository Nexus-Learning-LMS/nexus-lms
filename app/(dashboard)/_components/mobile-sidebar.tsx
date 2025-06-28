'use client'

import { Menu, Layout, Compass, User, UserIcon, Award, Users, List, BarChart, BookUser, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { UserButton, useAuth, useUser } from '@clerk/nextjs'
import Image from 'next/image'

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { isTeacher as checkIsTeacher } from '@/lib/teacher'
import { Logo } from './logo'

const guestMobileRoutes = [
  { href: '/', label: 'Home', icon: Layout },
  { href: '/search', label: 'Our Courses', icon: Compass },
  { href: '/#our-team', label: 'Our Team', icon: Users },
  { href: '/#why-nexus', label: 'Why Nexus', icon: Award },
  { href: '/contact', label: 'Contact Us', icon: User },
]

const teacherMobileRoutes = [
  { href: '/teacher/courses', label: 'Courses', icon: List },
  { href: '/teacher/analytics', label: 'Analytics', icon: BarChart },
  { href: '/teacher/enrollments', label: 'User Enrollments', icon: BookUser },
]

export const MobileSidebar = () => {
  const pathname = usePathname()
  const { userId, signOut } = useAuth()
  const { user } = useUser() // Hook to get user details like name
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  const isTeacherPage = pathname?.startsWith('/teacher')
  const isTeacher = checkIsTeacher(userId)
  const routes = isTeacherPage ? teacherMobileRoutes : guestMobileRoutes

  const handleSignOut = () => {
    setIsOpen(false)
    signOut(() => router.push('/'))
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="md:hidden hover:opacity-75 transition">
        <Menu className="text-white" />
      </SheetTrigger>

      {isScrolled && (
        <SheetTrigger className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg transition-opacity duration-300">
          <Menu className="text-brand-deep-blue" />
        </SheetTrigger>
      )}

      <SheetContent side="left" className="p-0 bg-brand-deep-blue text-white data-[state=open]:duration-300">
        <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-white/20">
            <Logo />
          </div>
          <div className="flex flex-col w-full p-4 space-y-2 flex-grow">
            {routes.map((route) => {
              const isActive = (route.href.startsWith('/#') && pathname === '/') || pathname === route.href
              return (
                <Link href={route.href} key={route.href} onClick={() => setIsOpen(false)}>
                  <div
                    className={cn(
                      'flex items-center gap-x-2 p-3 rounded-md text-slate-300 text-sm font-medium transition-all hover:bg-white/10 hover:text-white',
                      isActive,
                    )}
                  >
                    <route.icon size={20} /> {route.label}
                  </div>
                </Link>
              )
            })}
            {/* Conditionally add Teacher Mode link */}
            {isTeacher && !isTeacherPage && (
              <Link href="/teacher/courses" onClick={() => setIsOpen(false)}>
                <div className="flex items-center gap-x-2 p-3 rounded-md text-slate-300 text-sm font-medium transition-all hover:bg-white/10 hover:text-white">
                  <LogOut className="h-5 w-5 mr-2" />
                  Teacher Mode
                </div>
              </Link>
            )}
          </div>
          <div className="p-6 border-b border-white/20">
            {userId ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2 min-w-0">
                  <div className="relative h-6 w-6 min-[400px]:h-8 min-[400px]:w-8 rounded-full bg-slate-500 overflow-hidden">
                    {user?.imageUrl ? (
                      <Image src={user.imageUrl} alt={user.fullName || 'User'} fill sizes="32px" />
                    ) : (
                      <UserIcon className="h-full w-full text-white p-1" />
                    )}
                  </div>
                  <span className="text-base min-[400px]:text-lg font-medium pl-2 truncate">{user?.fullName}</span>
                </div>
                <Button
                  size="sm"
                  onClick={handleSignOut}
                  className="text-xs min-[400px]:text-sm text-slate-300 border border-brand-light-gray hover:text-white mr-5"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-x-2">
                <Link href="/sign-in" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-brand-primary-blue text-white hover:bg-brand-dark-blue">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
