'use client'

import qs from 'query-string'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

export const SearchInput = () => {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentCategoryId = searchParams.get('categoryId')

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true },
    )

    router.push(url)
  }, [debouncedValue, currentCategoryId, router, pathname])

  return (
    <div className="relative w-full">
      <Search className="h-5 w-5 absolute top-1/2 left-4 transform -translate-y-1/2 text-slate-400" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full pl-12 pr-4 py-6 rounded-full bg-white border-2 border-slate-200 focus:border-brand-primary-blue focus:ring-brand-primary-blue/20 focus:ring-4 transition-all"
        placeholder="Search for courses by title..."
      />
    </div>
  )
}
