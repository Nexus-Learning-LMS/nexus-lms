import { NavbarRoutes } from '@/components/navbar-routes'
import { MobileSidebar } from './mobile-sidebar'
import { Logo } from './logo'

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-brand-deep-blue text-white shadow-sm">
      <MobileSidebar />
      <div className="hidden md:block">
        <Logo />
      </div>
      <div className="flex items-center w-full md:ml-6">
        <NavbarRoutes />
      </div>
    </div>
  )
}
