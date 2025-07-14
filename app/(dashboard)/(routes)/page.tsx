import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import dynamic from 'next/dynamic'

import { db } from '@/lib/db'
import { CourseCard } from '@/components/course-card'
import { getProgress } from '@/actions/get-progress'

// Lazy-loading components to improve initial load performance
const WhyNexusSection = dynamic(() => import('../_components/why-nexus-section').then((mod) => mod.WhyNexusSection))
const OurTeamSection = dynamic(() => import('../_components/our-team-section').then((mod) => mod.OurTeamSection))
const TestimonialsSection = dynamic(() =>
  import('../_components/testimonials-section').then((mod) => mod.TestimonialsSection),
)

export default async function Home() {
  const { userId } = await auth()
  const courses = await db.course.findMany({
    where: { isPublished: true },
    include: {
      category: true,
      chapters: { where: { isPublished: true }, select: { id: true } },
      purchases: userId ? { where: { userId } } : false,
    },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })
  const coursesWithProgress = userId
    ? await Promise.all(
        courses.map(async (course) => {
          if (course.purchases.length > 0) {
            const progressPercentage = await getProgress(userId, course.id)
            return { ...course, progress: progressPercentage }
          }
          return { ...course, progress: null }
        }),
      )
    : courses.map((course) => ({ ...course, progress: null }))

  return (
    <div className="-mt-20">
      <section className="min-h-screen grid grid-cols-1  min-[890px]:grid-cols-2">
        <div className="flex  min-[890px]:col-span-1 items-center justify-center bg-brand-primary-blue text-white p-8 pt-28  min-[890px]:p-12 lg:p-16">
          <div className="max-w-lg space-y-6">
            <h1 className="text-3xl md:text-4xl min-[1100px]:text-5xl font-bold leading-tight cursor-default">
              More than Tuition - its a Transformation.
            </h1>
            <p className=" text-slate-300 cursor-default">
              Improvement isn&apos;t a promise here, it&apos;s a pattern. We track growth, celebrate wins, and keep
              moving forward.
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

        <div className="relative  min-[890px]:col-span-1 hidden  min-[890px]:block">
          <Image
            src="/illustration.svg"
            alt="Hero Image showing students learning"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

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
        </div>
      </section>

      <WhyNexusSection />
      <TestimonialsSection />
      <OurTeamSection />
    </div>
  )
}
