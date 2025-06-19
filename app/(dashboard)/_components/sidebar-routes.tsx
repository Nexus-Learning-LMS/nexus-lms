'use client'

import { BarChart, Compass, Layout, List, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { SidebarItem } from './sidebar-item'

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
    href: '/team',
  },
  {
    icon: Compass,
    label: 'Why Nexus?',
    href: '/why-nexus',
  },
  {
    icon: User,
    label: 'Contact Us',
    href: '/contact',
  },
]

const teacherRoutes = [
  {
    icon: List,
    label: 'Courses',
    href: '/teacher/courses',
  },
  {
    icon: BarChart,
    label: 'Analytics',
    href: '/teacher/analytics',
  },
]

export const SidebarRoutes = () => {
  const pathname = usePathname()

  const isTeacherPage = pathname?.includes('/teacher')

  const routes = isTeacherPage ? teacherRoutes : guestRoutes

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem key={route.href} icon={route.icon} label={route.label} href={route.href} />
      ))}
    </div>
  )
}
