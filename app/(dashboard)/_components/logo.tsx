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
      <div className="flex items-center cursor-pointer">
        <Image height={50} width={50} src="/nexus-logo.PNG" alt="Logo" />
        <h3
          className={cn(
            'ml-3 text-2xl font-bold  whitespace-nowrap', // Tailwind classes for spacing, size, etc.
            font.className, // Apply the custom Poppins font
          )}
        >
          Nexus Learning
        </h3>
      </div>
    </Link>
  )
}
