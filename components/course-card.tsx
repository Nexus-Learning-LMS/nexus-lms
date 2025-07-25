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
  isPurchased: boolean
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  isPurchased,
}: CourseCardProps) => {
  const router = useRouter()
  const handleContactClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    router.push('/contact')
  }
  return (
    <Link href={`/courses/${id}`}>
      <div className="group bg-gradient-to-br border-2 border-brand-primary-blue shadow-lg shadow-slate-400 from-white to-slate-50 hover:bg-gradient-to-tl transition-all duration-500 rounded-xl p-4 h-full flex flex-col overflow-hidden text-brand-dark-blue transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-gradient-blue-light">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover  border-2 border-slate-200 rounded-md group-hover:scale-110 transition-transform duration-500"
            alt={title}
            src={imageUrl}
          />
        </div>
        <div className="flex flex-col pt-3 flex-grow">
          <p className="text-xs text-slate-700">{category}</p>
          <div className="text-lg md:text-base font-bold transition line-clamp-2 mt-1">{title}</div>
          <div className="my-3 flex items-center gap-x-2 text-sm text-slate-900">
            {/* <IconBadge size="sm" icon={BookOpen} />
            <span>
              {chaptersLength} {chaptersLength === 1 ? 'Chapter' : 'Chapters'}
            </span> */}
          </div>

          <div className="flex-grow" />
          {isPurchased ? (
            progress !== null && progress > 0 ? (
              <CourseProgress variant={progress === 100 ? 'success' : 'default'} value={progress} />
            ) : (
              <p className="text-base font-semibold text-green-700">Ready to Start</p>
            )
          ) : (
            <button
              onClick={handleContactClick}
              className="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-slate-500 rounded-md group-hover:border-white w-full"
              type="button"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 bg-brand-primary-blue -translate-x-full group-hover:translate-x-0 ease">
                Contact Us
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-brand-dark-blue transition-all duration-300 transform group-hover:translate-x-full ease">
                Contact Us
              </span>
              <span className="relative invisible">Contact Us</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
