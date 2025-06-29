'use client'

import { UserButton, useAuth } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Compass, Layout, User, List, BarChart, BookUser, HelpCircle, Users2 } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { isTeacher as checkIsTeacher } from '@/lib/teacher' // Import the new helper function

const leftGuestRoutes = [
  { label: 'Home', href: '/' },
  { label: 'Our Courses', href: '/search' },
]

const rightGuestRoutes = [
  { label: 'Our Team', href: '/#our-team' },
  { label: 'Why Nexus?', href: '/#why-nexus' },
]

const teacherRoutes = [
  { label: 'Courses', href: '/teacher/courses' },
  { label: 'Analytics', href: '/teacher/analytics' },
  { label: 'User Enrollments', href: '/teacher/enrollments' },
]

export const NavbarRoutes = ({ isAuthSection = false }: { isAuthSection?: boolean }) => {
  const { userId } = useAuth()
  const pathname = usePathname()
  const [activeHash, setActiveHash] = useState('')

  useEffect(() => {
    const handleHashChange = () => setActiveHash(window.location.hash)
    handleHashChange()
    window.addEventListener('hashchange', handleHashChange, { passive: true })
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const isHomepage = pathname === '/'
  const isTeacher = checkIsTeacher(userId) // Use the new helper function
  const isTeacherPage = pathname?.startsWith('/teacher')
  const isCoursePage = pathname?.includes('/courses')
  const isContactPage = pathname === '/contact'

  const NavLink = ({ href, label, isDarkText = false }: { href: string; label: string; isDarkText?: boolean }) => {
    const isAnchorLink = href.startsWith('/#')
    let isActive = false
    if (isAnchorLink) {
      isActive = pathname === '/' && activeHash === href.slice(1)
    } else {
      isActive = pathname === href
    }
    if (href === '/' && activeHash) {
      isActive = false
    }

    const handleClick = () => {
      // If it's an anchor link, manually update the state
      if (isAnchorLink) {
        setActiveHash(href.slice(1))
      } else {
        // For regular pages, clear the hash
        setActiveHash('')
      }
    }

    const linkColor = isHomepage && isDarkText ? 'text-brand-deep-blue' : 'text-white'
    const hoverColor = isHomepage && isDarkText ? 'hover:bg-slate-100' : 'hover:bg-white/10'
    const activeBg = isHomepage && isDarkText ? 'bg-slate-200' : 'bg-white/20'

    return (
      <Link href={href} onClick={handleClick}>
        <div
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap',
            isActive ? activeBg : hoverColor,
            linkColor,
          )}
        >
          {label}
        </div>
      </Link>
    )
  }

  if (isAuthSection) {
    return (
      <div className="flex items-center gap-x-2">
        {isTeacherPage || isCoursePage ? (
          <Link href="/">
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
              <LogOut className="h-4 w-4 mr-2" /> Exit
            </Button>
          </Link>
        ) : (
          <>
            {isTeacher && (
              <Link href="/teacher/courses">
                <Button
                  size="sm"
                  className={
                    isHomepage
                      ? 'text-brand-deep-blue hover:bg-slate-100 border border-brand-deep-blue'
                      : 'text-white hover:bg-white/10'
                  }
                >
                  Teacher mode
                </Button>
              </Link>
            )}
            <Link href="/contact">
              <Button
                size="sm"
                variant="ghost"
                className={cn(
                  'transition-all',
                  isHomepage ? 'text-brand-deep-blue hover:bg-slate-100' : 'text-white hover:bg-white/10',
                  isContactPage && (isHomepage ? 'bg-slate-200' : 'bg-white/20'),
                )}
              >
                Contact Us
              </Button>
            </Link>
          </>
        )}
        {userId ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <div className="flex gap-x-2">
            <Link href="/sign-in">
              <Button
                size="sm"
                variant="ghost"
                className={isHomepage ? 'text-brand-deep-blue hover:bg-slate-100' : 'text-white hover:bg-white/10'}
              >
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
    )
  }

  // The main container now has a larger gap to create the center divide
  return (
    <div className="flex min-[1500px]:gap-x-12 min-[1100px]:gap-x-6 min-[900px]:gap-x-3  min-[890px]:gap-x-1">
      {isTeacherPage ? (
        teacherRoutes.map((route) => <NavLink key={route.href} href={route.href} label={route.label} />)
      ) : (
        <>
          {leftGuestRoutes.map((route) => (
            <NavLink key={route.href} href={route.href} label={route.label} />
          ))}
          {rightGuestRoutes.map((route) => (
            <NavLink key={route.href} href={route.href} label={route.label} isDarkText={true} />
          ))}
        </>
      )}
    </div>
  )
}
