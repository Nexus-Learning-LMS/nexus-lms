'use client'

import { usePathname } from 'next/navigation'
import { SearchInput } from '@/components/search-input'

export const StickySearchHeader = () => {
  const pathname = usePathname()
  const isSearchPage = pathname === '/search'

  // Render nothing if we are not on the search page
  if (!isSearchPage) {
    return null
  }

  // Render a sticky header positioned below the main navbar
  return (
    <div className="fixed top-20 left-0 w-full h-16 bg-white z-40 p-2 border-b flex items-center justify-center">
      <div className="w-full max-w-md">
        <SearchInput />
      </div>
    </div>
  )
}
