// In: app/(dashboard)/(routes)/page.tsx
// This is the main homepage component with the new sections added.

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, ClipboardCheck, HeartHandshake, PlayCircle, Users } from 'lucide-react'

import { db } from '@/lib/db'
import { CourseCard } from '@/components/course-card'

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
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 4,
  })

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh)] flex flex-col md:flex-row">
        {/* Left Side: Content */}
        <div className="flex flex-1 items-center justify-center bg-brand-primary-blue text-white p-8 md:p-12 lg:p-16">
          <div className="max-w-lg space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">More than Tuition - its a Transformation.</h1>
            <p className="text-lg text-slate-300">
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
            priority
          />
        </div>
      </section>

      {/* Our Courses Section */}
      <section className="py-16 md:py-20 bg-brand-light-gray/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-blue">Our Featured Courses</h2>
            <p className="text-slate-500 mt-2">Get started with our most popular learning paths.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title!}
                imageUrl={course.imageUrl!}
                chaptersLength={course.chapters.length}
                price={course.price!}
                progress={null} // No progress for public view
                category={course.category?.name!}
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
      <section id="why-nexus" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-blue">Why Nexus Learning?</h2>
            <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
              We've built a learning environment that prioritizes personal growth, expert guidance, and real-world
              skills.
            </p>
          </div>
          {/* The conditional centering logic has been removed to allow for natural grid flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-lg border border-slate-300 shadow-lg shadow-slate-600/30 hover:border-brand-primary-blue/50 hover:shadow-xl hover:shadow-brand-gradient-blue-light transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center gap-x-4">
                  <div className="bg-brand-primary-blue/10 p-3 rounded-full">
                    <feature.icon className="h-6 w-6 text-brand-primary-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-deep-blue">{feature.title}</h3>
                </div>
                <p className="text-slate-600 mt-4">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
