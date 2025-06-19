import { NavbarRoutes } from '@/components/navbar-routes'
import { MobileSidebar } from './mobile-sidebar'
import { Logo } from './logo'

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-brand-deep-blue text-white shadow-sm">
      {/* Left section: Mobile menu and Desktop Logo */}
      <div className="flex items-center">
        <MobileSidebar />
        <div className="hidden md:block">
          <Logo />
        </div>
      </div>

      {/* Right section: All routes and auth buttons */}
      <div className="flex items-center w-full">
        <NavbarRoutes />
      </div>
    </div>
  )
}
