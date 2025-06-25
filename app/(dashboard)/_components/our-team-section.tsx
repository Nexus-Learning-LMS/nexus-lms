'use client'

import { TeacherCard } from './teacher-card'
import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

const teamMembers = [
  {
    name: 'Anmol',
    title: 'Founding Mentor',
    quote: 'We meet students where they are and take them where they want to be.',
    imageUrl: '/nexus-team/img-anmol.JPEG',
  },
  {
    name: 'Adarsh',
    title: 'Founding Mentor',
    quote: 'Every time a student says "oh yes I got it now" that feels like a reward.',
    imageUrl: '/nexus-team/img-adarsh.JPEG',
  },
  {
    name: 'Mahesh',
    title: 'Chairman',
    quote: 'Our mission is to make learning less about marks and more about mastery.',
    imageUrl: '/nexus-team/img-mahesh.JPEG',
  },
]

export const OurTeamSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const prevTeacher = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? teamMembers.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const nextTeacher = () => {
    const isLastSlide = currentIndex === teamMembers.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToTeacher = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section id="our-team" className="py-16 md:py-20  md:pb-40 bg-brand-light-gray/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16 cursor-default">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-blue">Our Team</h2>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
            Meet the passionate educators and mentors dedicated to your success.
          </p>
        </div>

        {/* --- START OF CHANGE: Grid Layout Update --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Left Side: "Letter" content - now spans 7 columns */}
          <div className="order-2 md:order-1 md:col-span-8 bg-white p-8 rounded-lg shadow-lg relative cursor-default mx-auto">
            <h3 className="text-2xl font-bold text-brand-deep-blue mb-3">One Vision, One Purpose</h3>
            <p className="text-slate-600 mb-4">
              We are united by a shared goal: To build a learning space where no student is left behind.
            </p>
            <p className="text-slate-600 mb-7">
              From foundational concepts to Olympiad excellence, we deliver personalized, tech-enabled, and
              mentor-powered learning to meet every child’s unique pace and potential.
            </p>
            <Separator className="bg-slate-400 mb-6" />

            <h4 className="text-xl font-semibold text-brand-deep-blue mb-4">What Makes Our Mentorship Different?</h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 mb-8">
              <li>
                <strong>Handpicked Experts:</strong> Only top-performing educators with passion and patience make it to
                our team.
              </li>
              <li>
                <strong>More Than Teaching:</strong> We coach students on mindset, motivation, and mastery—not just
                academics.
              </li>
              <li>
                <strong>Real-Time Feedback Loops:</strong> With every session, mentors analyze progress and adapt to
                student needs.
              </li>
              <li>
                <strong>Parent & Student Collaboration:</strong> We work hand-in-hand with families to ensure lasting
                growth.
              </li>
            </ul>

            <blockquote className="border-l-4 border-brand-primary-blue pl-4 italic text-slate-700">
              “We are not just shaping scholars; we are shaping confidence, clarity, and curiosity in every learner.”
              <cite className="block not-italic mt-2 text-sm font-semibold text-brand-dark-blue">
                – The Nexus Mentor Team
              </cite>
            </blockquote>
          </div>

          {/* Right Side: Teacher Card Carousel - now spans 5 columns */}
          <div className="group order-1 md:order-2 md:col-span-4 relative h-[500px] w-full max-w-sm mx-auto">
            {/* Carousel Container */}
            <div className="relative h-full w-full overflow-hidden rounded-xl items-center">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="absolute w-full h-full transition-all duration-700 ease-in-out"
                  style={{ transform: `translateX(${100 * (index - currentIndex)}%)` }}
                >
                  <TeacherCard {...member} />
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={prevTeacher}
                className="p-2 rounded-full bg-white/70 backdrop-blur-sm shadow-md transition hover:bg-white"
              >
                <ChevronLeft className="h-6 w-6 text-brand-deep-blue" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={nextTeacher}
                className="p-2 rounded-full bg-white/70 backdrop-blur-sm shadow-md transition hover:bg-white"
              >
                <ChevronRight className="h-6 w-6 text-brand-deep-blue" />
              </button>
            </div>

            {/* Dot Indicators */}
            <div className="absolute md:bottom-5 bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTeacher(index)}
                  className={cn(
                    'h-2 w-2 rounded-full transition-colors',
                    currentIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white',
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
