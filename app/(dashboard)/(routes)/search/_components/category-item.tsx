'use client'

import qs from 'query-string'
import { IconType } from 'react-icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { cn } from '@/lib/utils'

interface CategoryItemProps {
  label: string
  value?: string
  icon?: IconType
}

export const CategoryItem = ({ label, value, icon: Icon }: CategoryItemProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategoryId = searchParams.get('categoryId')
  const currentTitle = searchParams.get('title')

  const isSelected = currentCategoryId === value

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true },
    )

    router.push(url)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'py-2 px-4 text-sm border-2 bg-white border-slate-200 rounded-full flex items-center gap-x-1 hover:border-brand-primary-blue/50 transition-all duration-300',
        // Updated selected state to use solid blue background with white text
        isSelected &&
          'border-brand-primary-blue bg-brand-primary-blue text-white hover:bg-brand-dark-blue hover:border-brand-dark-blue',
      )}
      type="button"
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </button>
  )
}
