'use client'

import { AlertTriangle, CheckCircleIcon, X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { useState } from 'react'

const bannerVariants = cva('border text-center p-4 text-sm flex items-center w-full', {
  variants: {
    variant: {
      warning: 'bg-yellow-200/80 border-yellow-30 text-white',
      warning2: 'bg-yellow-200/80 border-yellow-30 text-black',
      success: 'bg-emerald-700 border-emerald-800 text-white',
    },
  },
  defaultVariants: {
    variant: 'warning',
  },
})

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string
}

const iconMap = {
  warning: AlertTriangle,
  warning2: AlertTriangle,
  success: CheckCircleIcon,
}

export const Banner = ({ label, variant }: BannerProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const Icon = iconMap[variant || 'warning']

  if (!isVisible) {
    return null
  }

  return (
    <div className={cn(bannerVariants({ variant }), 'relative')}>
      <Icon className="h-4 w-4 mr-2" />
      <span>{label}</span>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-1/2 right-4 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 transition"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
