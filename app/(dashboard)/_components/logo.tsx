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
        <div className="relative h-8 w-8 min-[350px]:h-10 min-[350px]:w-10 min-[1100px]:h-12 min-[1100px]:w-12">
          <Image fill src="/nexus-logo.png" alt="Logo" />
        </div>
        <h3
          className={cn(
            'ml-2 text-lg min-[350px]:text-xl min-[1100px]:text-2xl font-bold whitespace-nowrap text-white',
            font.className,
          )}
        >
          Nexus Learning
        </h3>
      </div>
    </Link>
  )
}
