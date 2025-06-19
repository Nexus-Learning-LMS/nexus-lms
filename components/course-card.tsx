'use client'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

import { IconBadge } from '@/components/icon-badge'
import { formatPrice } from '@/lib/format'
import { CourseProgress } from '@/components/course-progress'
import { useRouter } from 'next/navigation'

interface CourseCardProps {
  id: string
  title: string
  imageUrl: string
  chaptersLength: number
  price: number
  progress: number | null
  category: string
}

export const CourseCard = ({ id, title, imageUrl, chaptersLength, price, progress, category }: CourseCardProps) => {
  const router = useRouter()
  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    router.push('/contact')
  }
  return (
    <Link href={`/courses/${id}`}>
      <div className="group bg-gradient-to-br from-brand-primary-blue to-brand-gradient-blue-dark hover:bg-gradient-to-tl transition-all duration-500 rounded-xl p-4 h-full flex flex-col overflow-hidden text-white transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-gradient-blue-light">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            alt={title}
            src={imageUrl}
          />
        </div>
        <div className="flex flex-col pt-3 flex-grow">
          <p className="text-xs text-slate-400">{category}</p>
          <div className="text-lg md:text-base font-bold transition line-clamp-2 mt-1">{title}</div>
          <div className="my-3 flex items-center gap-x-2 text-sm text-slate-300">
            <IconBadge size="sm" icon={BookOpen} />
            <span>
              {chaptersLength} {chaptersLength === 1 ? 'Chapter' : 'Chapters'}
            </span>
          </div>

          <div className="flex-grow" />

          {progress !== null ? (
            <CourseProgress variant={progress === 100 ? 'success' : 'default'} size="sm" value={progress} />
          ) : (
            // The button is now a proper <button> element with an onClick handler
            <button
              onClick={handleContactClick}
              className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-slate-500 rounded-md group-hover:border-white w-full"
              type="button"
            >
              {/* This span slides in from the left on hover */}
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-brand-primary-blue duration-300 bg-blue-100 -translate-x-full  group-hover:translate-x-0 ease">
                {/* Replaced SVG with text */}
                Contact Us
              </span>
              {/* This span is visible by default and slides out */}
              <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                Contact Us
              </span>
              {/* This span is used for sizing the button correctly */}
              <span className="relative invisible">Contact Us</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
