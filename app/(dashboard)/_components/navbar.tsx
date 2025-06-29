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
        <div className="absolute inset-0 h-full w-full hidden min-[890px]:flex" aria-hidden="true">
          <div className="w-1/2 h-full bg-brand-primary-blue" />
          <div className="w-1/2 h-full bg-white" />
        </div>
      )}

      {/* This div holds the navbar content, positioned on top of the background. */}
      <div className="relative z-10 p-4 h-full flex items-center justify-between">
        {/* --- Left Section (1/3) --- */}
        {/* Left Section: Always contains the logo */}
        <div className="flex-1 flex justify-start pr-5">
          <Logo />
        </div>
        {/* Middle Section: Contains the main navigation links, hidden on mobile */}
        <div className="hidden min-[890px]:flex flex-1 justify-center">
          <NavbarRoutes />
        </div>
        {/* Right Section: Contains auth buttons on desktop and the hamburger menu on mobile */}
        <div className="flex-1 flex justify-end">
          <div className="hidden min-[890px]:flex">
            <NavbarRoutes isAuthSection={true} />
          </div>

          <div className="min-[890px]:hidden">
            <MobileSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
