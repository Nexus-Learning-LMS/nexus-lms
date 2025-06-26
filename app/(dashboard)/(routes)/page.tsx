// In: app/(dashboard)/(routes)/page.tsx
// This is the main homepage component with the new sections added.

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, ClipboardCheck, HeartHandshake, PlayCircle, Users } from 'lucide-react'

import { db } from '@/lib/db'
import { CourseCard } from '@/components/course-card'
import { WhyNexusSection } from '../_components/why-nexus-section'
import { OurTeamSection } from '../_components/our-team-section'
import { auth } from '@clerk/nextjs/server'
import { getProgress } from '@/actions/get-progress'

// The features for the "Why Nexus?" section
const features = [
  {
    icon: HeartHandshake,
    title: 'One-on-One Guidance',
    description:
      'Every course includes individual sessions with a dedicated mentor, allowing for personalized doubt-solving and progress checks.',
  },
  {
    icon: PlayCircle,
    title: 'Live Sessions & Recorded Content',
    description:
      'We blend live interactive classes with recorded lessons — perfect for revision and flexible learning.',
  },
  {
    icon: Users,
    title: 'Teamwork & Collaborative Projects',
    description:
      'Some coding and technical courses feature group projects, helping students develop collaborative skills alongside their coding expertise.',
  },
  {
    icon: ClipboardCheck,
    title: 'Regular Parent Updates',
    description:
      'We keep parents in the loop after each session, offering reports on progress and achievements — because education is a team effort.',
  },
  {
    icon: Award,
    title: 'Skilled Mentors',
    description:
      'All our instructors are experts in their fields, passionate about mentoring, guiding, and making sure you learn at your own pace.',
  },
]

export default async function Home() {
  const { userId } = await auth()

  // Fetch the 4 most recent published courses to display
  const courses = await db.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      category: true,
      chapters: {
        where: { isPublished: true },
        select: { id: true },
      },
      purchases: userId
        ? {
            where: {
              userId,
            },
          }
        : false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
  })

  const coursesWithProgress = userId
    ? await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length > 0) {
            const progressPercentage = await getProgress(userId, course.id)
            return {
              ...course,
              progress: progressPercentage,
            }
          }
          return {
            ...course,
            progress: null,
          }
        }),
      )
    : courses.map((course) => ({ ...course, progress: null }))

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen grid grid-cols-1 md:grid-cols-4">
        {/* Left Side: Content */}
        <div className="flex md:col-span-2 items-center justify-center bg-brand-primary-blue text-white p-8 md:p-12 lg:p-16">
          <div className="max-w-lg space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight cursor-default">
              More than Tuition - its a Transformation.
            </h1>
            <p className="text-lg text-slate-300 cursor-default">
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
        <div className="relative md:col-span-2 hidden md:block">
          <Image
            src="/illustration.svg"
            alt="Hero Image showing students learning"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Our Courses Section */}
      <section className="py-16 md:py-20 md:px-8 bg-brand-light-gray/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 cursor-default">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-blue">Our Featured Courses</h2>
            <p className="text-slate-500 mt-2">Get started with our most popular learning paths.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coursesWithProgress.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title!}
                imageUrl={course.imageUrl!}
                chaptersLength={course.chapters.length}
                price={course.price!}
                progress={course.progress}
                category={course.category?.name!}
                isPurchased={course.purchases && course.purchases.length > 0}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/search">
              <Button size="lg" className="bg-brand-primary-blue hover:bg-brand-dark-blue text-white">
                View All Courses
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Nexus Section */}
      <WhyNexusSection />
      <OurTeamSection />
    </div>
  )
}
