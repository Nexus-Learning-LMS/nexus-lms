'use client'

import { Menu, Layout, Compass, User, Award, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Logo } from './logo'
import { cn } from '@/lib/utils'

const mobileRoutes = [
  { href: '/', label: 'Home', icon: Layout },
  { href: '/search', label: 'Our Courses', icon: Compass },
  { href: '/team', label: 'Our Team', icon: Users },
  { href: '/why-nexus', label: 'Why Nexus', icon: Award },
  { href: '/contact', label: 'Contact Us', icon: User },
]

export const MobileSidebar = () => {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-brand-deep-blue text-white">
        <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-white/20">
            <Logo />
          </div>
          {/* Search input is removed from here as it's now part of the main layout */}
          <div className="flex flex-col w-full p-4 space-y-2">
            {mobileRoutes.map((route) => {
              const isActive = pathname === route.href
              return (
                <Link href={route.href} key={route.href}>
                  <div
                    className={cn(
                      'flex items-center gap-x-2 p-3 rounded-md text-slate-300 text-sm font-medium transition-all hover:bg-white/10 hover:text-white',
                      isActive && 'bg-white/20 text-white',
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
