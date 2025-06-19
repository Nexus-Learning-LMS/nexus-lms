'use client'

import { usePathname } from 'next/navigation'

export const MainContainer = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const isSearchPage = pathname === '/search'

  // Add extra top padding (h-16 = 4rem) on the search page to avoid the sticky search header
  const paddingTopClass = isSearchPage ? 'pt-36' : 'pt-20' // pt-20 (navbar) + pt-16 (search) = pt-36

  return <main className={`${paddingTopClass} h-full`}>{children}</main>
}
