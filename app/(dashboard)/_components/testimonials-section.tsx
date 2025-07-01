'use client'

import { Star } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    name: 'smruti Amare',
    message:
      "Anmol’s teaching style is unique and admirable. She gets to the base of the concepts to make kids understand it. She ensures that kids get to the core concepts and she challenges them to level next. Kids respect her and are equally scared of her because of her due diligence to ensure that they are focused on what’s being taught and agree to her teaching principles. She ensures that the summary report of what is being taught on a regular basis and the child's progress is communicated to rhe parents as it maintain the transparency and clear deliverables of her work. Keep up this good work Anmol. My daughter is really happy to have you as her math mentor and see her growing in years to come. Thanks again",
  },
  {
    name: 'Sapna Khobare',
    message:
      'I really appreciate your teaching style. You make the child comfortable during the learning session. Aarush never feels bored during the session. Thanks for your dedication . Since aarush has time during this summer you can give him homework to do for revision.',
  },
  {
    name: 'vaibhavi sharma',
    message:
      "My daughter's coding teacher adarsh is very kind teacher. I'm so thankful to him, his unique way of teaching helps her to understand the importance and meaning of coding. She is so happy and excited to learn more always now.",
  },
  {
    name: 'Jyoti Dixit',
    message:
      'We are very happy with Sanchi’s overall performance. Anmol has been very good, explaining the topics of maths very nicely. My daughter is very happy with her teaching style.',
  },
  {
    name: 'Anju Rajan',
    message:
      'We are extremely happy with the overall experience in learning Maths for Nivedha specifically Anmol Ma‘am. Nivedha started showing overall interest in maths and had fun learning new stuff. She mentioned that through these classes she was able to perform much better at school and was able to do math much faster. The overall communication experience for us was also awesome - in case of reschedules/any change in sessions, we were getting prompt responses and thus was able to deal with schedule conflicts. Overall we truly loved the experience.',
  },
  {
    name: 'Malarvile Murugaya',
    message:
      'I have noticed that my son is gaining more confidence and his math skills have been improving steadily. The lessons are clearer and more engaging now, which is really helping him understand the concepts better. Thank you for the continued effort.',
  },
  {
    name: 'Bazgha Norin',
    message:
      'I think that the teacher is an amazing hard worker and her teaching style is brilliant, I can tell she works really hard to make sure she can provide the best teaching experience possible for my child. Moreover I have seen some evident improvement in my child’s progress and hope she will remain excelling in her learning. Therefore I want to highlight that I am pleased with my experience for my child and appreciate all the dedication put into her learning and I would definitely recommend this teacher to others as well.',
  },
  {
    name: 'srinivasa Ragavan',
    message:
      'First of all, thank you for teaching my kid. Having you as a tutor is a plus. We are good with your Teaching style. Your method of giving regular tests and revisions is really effective as I could see my kid progressing well in math. I do see her interest in solving puzzles and getting better with her math concepts. Also, now she has transformed into an independent learner and is able to help others too.',
  },
  {
    name: 'Pooja',
    message:
      'I started with public speaking and now diya is learning coding also with anmol and adarsh mentors are very supportive, they share regular updates and the sheets. They both communicate so well and always treat my child as a friend she shares her curiosities with them, diya has become more expressive and confident. It has made huge change in her studies also, thankyou for helping.',
  },
  {
    name: 'k. Sasikumar',
    message:
      "Overall experience with the teaching style has been very positive and that keeps my daughter interested in learning. I can see improvement in my child's progress and this is the first month and I'm really happy waiting to see the outcome of exam results. Communication is excellent and i regularly receive the updates and this is really helpful for parents. Appreciate your support. Thanks 🙏",
  },
  {
    name: 'Tehneyat',
    message:
      'My daughter’s teacher, Ms Anmol , is extremely helpful, supportive, resourceful and patient. She tries different techniques to grab my intelligent but lazy daughter’s attention, who strongly dislikes Mathematics. Thank you Anmol.',
  },
  {
    name: 'Saniya khan',
    message:
      "My son's coding mentor adarsh is really amazing. He teaches the concepts calmly in the session. I am very happy with the mentor he is so helpful, my son has been learning coding with him for the last 6 months and we can see the knowledge Adarsh has shared with him,  Thank you adarsh for all your efforts.",
  },
  {
    name: 'Neerja Dixit',
    message:
      "The teacher is very good, He makes sessions very interesting somehow and both my kids are  always excited for the next session. I've seen a lot of improvement in my kids and they love the mentor Thank you adarsh🙏🏻.",
  },
]

export const TestimonialsSection = () => {
  const extendedTestimonials = [...testimonials, ...testimonials]
  const [isInteracting, setIsInteracting] = useState(false)
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleInteraction = () => {
    setIsInteracting(true)
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current)
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false)
    }, 5000) // Resume after 5 seconds of inactivity
  }

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <style jsx global>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
      `}</style>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark-blue">What Our Parents Say</h2>
          <p className="text-slate-500 mt-2">Real stories from the families we&apos;ve partnered with.</p>
        </div>

        <div
          className="relative w-full overflow-hidden group"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          {/* --- START OF FIX: Separated scrolling container from animated container --- */}
          <div className="overflow-x-auto pb-4" onScroll={handleInteraction} onTouchStart={handleInteraction}>
            <div
              className={cn(
                'flex w-max', // w-max ensures the container is wide enough for all items
                !isInteracting && 'animate-scroll group-hover:animate-pause',
              )}
            >
              {extendedTestimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-80 h-64 mx-4 p-6 bg-slate-50 rounded-lg border border-slate-200 shadow-md flex flex-col"
                >
                  <div className="flex items-center mb-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                  </div>
                  <blockquote className="text-slate-600 text-xs italic flex-grow overflow-y-auto">
                    &quot;{testimonial.message}&quot;
                  </blockquote>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="font-semibold text-brand-deep-blue">{testimonial.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* --- END OF FIX --- */}
        </div>
      </div>
    </section>
  )
}
