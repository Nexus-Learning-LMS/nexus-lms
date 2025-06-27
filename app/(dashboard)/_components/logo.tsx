import Image from 'next/image'
import { Poppins } from 'next/font/google'
import Link from 'next/link'

import { cn } from '@/lib/utils' // Adjust the import path if needed

// Initialize the font with desired weights and subsets
const font = Poppins({
  subsets: ['latin'],
  weight: ['600'], // Using a semi-bold weight for the logo text
})

export const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center cursor-pointer transition-opacity hover:opacity-75">
        <div className="relative h-8 w-8 min-[400px]:h-10 min-[400px]:w-10 md:h-12 md:w-12">
          <Image fill src="/nexus-logo.PNG" alt="Logo" />
        </div>
        <h3
          className={cn(
            // --- START OF CHANGE: Added a new, smaller breakpoint ---
            // Default: text-lg (for screens < 400px)
            // min-[400px]: text-xl (for screens > 400px)
            // md: text-2xl (for screens > 768px)
            'ml-2 text-lg min-[400px]:text-xl md:text-2xl font-bold whitespace-nowrap text-white',
            // --- END OF CHANGE ---
            font.className,
          )}
        >
          Nexus Learning
        </h3>
      </div>
    </Link>
  )
}
