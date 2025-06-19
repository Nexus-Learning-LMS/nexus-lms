'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Course } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MultiSelect, Framework } from '@/components/ui/multi-select'

// --- Form Schema with Zod ---
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  courses: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one course.',
  }),
  remarks: z.string().optional(),
})

// --- Main Page Component ---
const ContactPage = () => {
  const [courses, setCourses] = useState<Framework[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all published courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // NOTE: In a real app, you would create a dedicated public API route
        // to fetch only published course titles and IDs. For now, we assume a placeholder.
        // This is a placeholder for where you would get the data.
        // For a real implementation, you'd need an API endpoint.
        const mockCourses: Course[] = [
          {
            id: 'course_1',
            title: 'Introduction to Next.js',
            userId: '',
            description: null,
            imageUrl: null,
            price: null,
            isPublished: true,
            categoryId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'course_2',
            title: 'Advanced Prisma Techniques',
            userId: '',
            description: null,
            imageUrl: null,
            price: null,
            isPublished: true,
            categoryId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'course_3',
            title: 'Mastering Shadcn UI',
            userId: '',
            description: null,
            imageUrl: null,
            price: null,
            isPublished: true,
            categoryId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]

        const formattedCourses = mockCourses.map((course) => ({
          value: course.id,
          label: course.title,
        }))
        setCourses(formattedCourses)
      } catch (error) {
        toast.error('Could not load course list.')
      }
    }

    fetchCourses()
  }, [])

  // --- Form Hook Initialization ---
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      courses: [],
      remarks: '',
    },
  })

  // --- Submit Handler ---
  function onSubmit(values: z.infer<typeof formSchema>) {
    // For now, we just log the data. In Phase 2, we will send this to our API.
    setIsLoading(true)
    console.log('Form Submitted:', values)
    toast.success('Inquiry received! We will contact you shortly.')
    // In a real scenario:
    // await axios.post('/api/enrollment-request', values);
    form.reset()
    setIsLoading(false)
  }

  // --- JSX Rendering ---
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Enroll Now</h1>
        <p className="text-muted-foreground mt-2">
          Fill out the form below to start your learning journey. We'll contact you to complete the enrollment.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 234 567 890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="courses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course/s of Interest</FormLabel>
                <MultiSelect options={courses} selected={field.value} onChange={field.onChange} className="w-full" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remarks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remarks (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us anything else you'd like us to know."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            Submit Inquiry
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ContactPage
