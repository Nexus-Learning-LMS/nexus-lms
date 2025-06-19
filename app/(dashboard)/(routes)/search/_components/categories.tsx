'use client'

import { Category } from '@prisma/client'
import { FaPython } from 'react-icons/fa'
import { SiScratch } from 'react-icons/si'
import { IconType } from 'react-icons'
import { IoCodeSlash } from 'react-icons/io5'
import { RiEnglishInput } from 'react-icons/ri'
import { HiOutlineDesktopComputer } from 'react-icons/hi'

import { CategoryItem } from './category-item'

interface CategoriesProps {
  items: Category[]
}

// const iconMap: Record<Category['name'], IconType> = {
//   Python: FaPython,
//   Scratch: SiScratch,
//   'Computer Science': HiOutlineDesktopComputer,
//   'Web Development': IoCodeSlash,
//   English: riEnglishInput,
// }

export const Categories = ({ items }: CategoriesProps) => {
  return (
    // Added pb-4 for more space between items and scrollbar
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem key={item.id} label={item.name} value={item.id} />
      ))}
    </div>
  )
}
