'use client'

import { Menu, Layout, Compass, User, Award, Users, List, BarChart, BookUser } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from './logo'
import { cn } from '@/lib/utils'

const mobileRoutes = [
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
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show the sticky trigger if user has scrolled past the navbar height (80px)
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

  const routes = isTeacherPage ? teacherMobileRoutes : mobileRoutes

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>

      {isScrolled && (
        <SheetTrigger className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg transition-opacity duration-300">
          <Menu className="text-brand-deep-blue" />
        </SheetTrigger>
      )}
      <SheetContent side="left" className="p-0 bg-brand-deep-blue text-white data-[state=open]:duration-300">
        <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-white/20">
            <Logo />
          </div>
          <div className="flex flex-col w-full p-4 space-y-2">
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
                    <route.icon size={20} />
                    {route.label}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
