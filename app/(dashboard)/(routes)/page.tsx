// This is the main homepage component.

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh)] flex flex-col md:flex-row">
        {/* Left Side: Content */}
        <div className="flex flex-1 items-center justify-center bg-brand-primary-blue text-white p-8 md:p-12 lg:p-16">
          <div className="max-w-lg space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">More than Tuition - its a Transformation.</h1>
            <p className="text-lg text-slate-300">
              {/* Dive into a world of knowledge with our comprehensive courses, designed to help you master new skills and
              advance your career. */}
              Improvement isn't a promise here, it's a pattern. We track growth, celebrate wins, and keep moving
              forward.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/search">
                <Button size="lg" className="w-full sm:w-auto bg-white text-brand-deep-blue hover:bg-brand-light-gray">
                  Explore Courses
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-white border-white hover:bg-white/10"
                >
                  Get In Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Right Side: Image */}
        <div className="relative flex-1 hidden md:block">
          <Image
            src="/illustration.svg"
            alt="Hero Image showing students learning"
            fill
            className="object-cover"
            priority // Load this image first as it's above the fold
          />
        </div>
      </section>
      {/* Other sections will be added below here */}
    </div>
  )
}
