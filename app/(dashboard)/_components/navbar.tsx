'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

import { NavbarRoutes } from '@/components/navbar-routes'
import { MobileSidebar } from './mobile-sidebar'
import { Logo } from './logo'
import { Menu } from 'lucide-react'

export const Navbar = () => {
  const pathname = usePathname()
  const isHomepage = pathname === '/'

  return (
    // This is the main container. It's relative so we can position the background inside it.
    <div
      className={cn(
        'h-full relative',
        // On non-homepage routes, it has a solid blue background.
        isHomepage ? 'bg-brand-deep-blue md:bg-transparent' : 'bg-brand-deep-blue',
      )}
    >
      {/* <div className="p-4 border-b h-full flex items-center bg-brand-deep-blue text-white shadow-sm"> */}
      {/* This div acts as the background and is ONLY visible on the homepage on desktop. */}
      {isHomepage && (
        <div className="absolute inset-0 h-full w-full hidden md:flex" aria-hidden="true">
          <div className="w-1/2 h-full bg-brand-primary-blue" />
          <div className="w-1/2 h-full bg-white" />
        </div>
      )}
      {/* This is the content of the navbar. It sits on top of the background. */}
      <div className="relative z-10 p-4 h-full flex items-center">
        <div className="md:hidden">
          {/* --- CHANGE 4: Hamburger Icon Color --- */}
          {/* The trigger is now rendered here with explicit white color */}
          <MobileSidebar />
        </div>
        <div className="hidden md:block">
          <Logo />
        </div>
        <div className="flex items-center w-full md:ml-6">
          <NavbarRoutes />
        </div>
      </div>
    </div>
  )
}
