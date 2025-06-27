'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

import { NavbarRoutes } from '@/components/navbar-routes'
import { Logo } from './logo'
import { MobileSidebar } from './mobile-sidebar'

export const Navbar = () => {
  const pathname = usePathname()
  const isHomepage = pathname === '/'

  return (
    <div className={cn('h-full relative', !isHomepage && 'bg-brand-deep-blue')}>
      {/* This div creates the split background, visible only on desktop homepage. */}
      {isHomepage && (
        <div className="absolute inset-0 h-full w-full hidden md:flex" aria-hidden="true">
          <div className="w-1/2 h-full bg-brand-primary-blue" />
          <div className="w-1/2 h-full bg-white" />
        </div>
      )}

      {/* This div holds the navbar content, positioned on top of the background. */}
      <div className="relative z-10 p-4 h-full flex items-center justify-between">
        {/* --- Left Section (1/3) --- */}
        {/* Contains the logo on desktop and the mobile trigger */}
        <div className="flex-1 flex justify-start md:pr-6">
          <div className="md:hidden">
            <MobileSidebar />
          </div>
          <div className="hidden md:block">
            <Logo />
          </div>
        </div>

        {/* --- Middle Section (1/3) --- */}
        {/* Contains the main navigation links, hidden on mobile */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavbarRoutes />
        </div>

        {/* --- Right Section (1/3) --- */}
        {/* Contains the auth buttons, also handled within NavbarRoutes for logic */}
        <div className="hidden md:flex flex-1 justify-end">
          <NavbarRoutes isAuthSection={true} />
        </div>
      </div>
    </div>
  )
}
