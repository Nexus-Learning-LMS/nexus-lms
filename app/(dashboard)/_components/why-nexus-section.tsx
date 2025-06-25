'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Award, ClipboardCheck, HeartHandshake, PlayCircle, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: HeartHandshake,
    title: 'One-on-One Guidance',
    description:
      'Every course includes individual sessions with a dedicated mentor for personalized doubt-solving and progress checks.',
  },
  {
    icon: PlayCircle,
    title: 'Live & Recorded Content',
    description:
      'We blend live interactive classes with recorded lessons — perfect for revision and flexible learning.',
  },
  {
    icon: Users,
    title: 'Collaborative Projects',
    description:
      'Some courses feature group projects, helping students develop collaborative skills alongside their coding expertise.',
  },
  {
    icon: ClipboardCheck,
    title: 'Regular Parent Updates',
    description: 'We keep parents in the loop after each session with reports on progress and achievements.',
  },
  {
    icon: Award,
    title: 'Skilled Mentors',
    description:
      'Our instructors are experts in their fields, passionate about mentoring and guiding you at your own pace.',
  },
]

const collageImages = [
  {
    src: '/img-cute.jpg',
    alt: 'Student coding on a laptop',
  },
  {
    src: '/img-donut.jpg',
    alt: 'Two people collaborating on a project',
  },
  {
    src: '/img-ocean.jpg',
    alt: 'Group of students learning together',
  },
  {
    src: '/img-peacock.jpg',
    alt: 'Close-up of code on a screen',
  },
  {
    src: '/img-waves.jpg',
    alt: 'A mentor guiding a student in an office',
  },
  {
    src: '/img-trees.jpg',
    alt: 'Team meeting and discussion',
  },
]

const imageGridClasses = [
  'col-start-3 col-span-4 row-start-3 row-span-4', // Image 1
  'col-start-7 col-span-10 row-start-1 row-span-10', // Image 2
  'col-start-17 col-span-5 row-start-6 row-span-5', // Image 3
  'col-start-1 col-span-6 row-start-7 row-span-6', // Image 4
  'col-start-7 col-span-5 row-start-11 row-span-4', // Image 5
  'col-start-12 col-span-8 row-start-11 row-span-6', // Image 6
]

export const WhyNexusSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? collageImages.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === collageImages.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    // If the carousel is paused by the user, do not proceed with the interval.
    if (isPaused) {
      return
    }

    const interval = setInterval(() => {
      handleNext()
    }, 2000)

    // This is a cleanup function that runs when the component is unmounted or when isPaused changes.
    // It clears the interval to prevent memory leaks and to stop the auto-scroll when paused.
    return () => clearInterval(interval)
  }, [isPaused, currentImageIndex]) // The empty dependency array ensures this effect runs only once on mount.

  return (
    <section id="why-nexus" className="py-16 md:py-20 md:px-8 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16 cursor-default">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-blue">Why Nexus Learning?</h2>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
            We've built a learning environment that prioritizes personal growth, expert guidance, and real-world skills.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* --- Left Side: Image Collage (Desktop) & Carousel (Mobile) --- */}
          <div className="w-full">
            {/* Desktop Image Collage */}
            <div className="hidden md:grid grid-cols-[repeat(21,1fr)] grid-rows-[repeat(16,1fr)] gap-4 h-[530px]">
              {collageImages.map((image, index) => (
                <div key={image.src} className={cn('rounded-lg overflow-hidden shadow-lg', imageGridClasses[index])}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110 aspect-square"
                  />
                </div>
              ))}
            </div>

            {/* Mobile Image Carousel */}
            <div
              className="md:hidden relative w-full aspect-square cursor-pointer"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onClick={() => setIsPaused((prev) => !prev)}
            >
              {collageImages.map((image, index) => (
                <div
                  key={image.src}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-500 ease-in-out',
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  <Image src={image.src} alt={image.alt} fill className="object-cover rounded-lg" />
                </div>
              ))}
              <div className="absolute inset-0 flex justify-between items-center p-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPaused(true) // Pause on arrow click
                    handlePrev()
                  }}
                  className="bg-white/50 hover:bg-white/80 p-2 rounded-full backdrop-blur-sm transition"
                >
                  <ChevronLeft className="h-6 w-6 text-brand-deep-blue" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsPaused(true) // Pause on arrow click
                    handleNext()
                  }}
                  className="bg-white/50 hover:bg-white/80 p-2 rounded-full backdrop-blur-sm transition"
                >
                  <ChevronRight className="h-6 w-6 text-brand-deep-blue" />
                </button>
              </div>
            </div>
          </div>

          {/* --- Right Side: Features List --- */}
          <div className="space-y-6 pt-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-x-4 p-3 rounded-lg border border-slate-300 shadow-lg shadow-slate-600/30
                hover:border-brand-primary-blue/50 hover:shadow-l hover:shadow-brand-gradient-blue-light transform
                hover:-translate-y-2 transition-all duration-300 cursor-default bg-white"
              >
                <div className="bg-brand-primary-blue/10 p-3 rounded-full mt-1 flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-brand-primary-blue" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-brand-deep-blue">{feature.title}</h3>
                  <p className="text-slate-600 mt-1 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
