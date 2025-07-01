'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Course } from '@prisma/client'
import { Send } from 'lucide-react'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MultiSelect, Framework } from '@/components/ui/multi-select'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().refine(isValidPhoneNumber, { message: 'Please enter a valid phone number.' }),
  courses: z.array(z.string()),
  remarks: z.string().optional(),
})

const ContactPage = () => {
  const [courses, setCourses] = useState<Framework[]>([])
  const [isFetchingCourses, setIsFetchingCourses] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsFetchingCourses(true)
        const response = await axios.get('/api/public/courses')
        const formattedCourses = response.data.map((course: Course) => ({
          value: course.id,
          label: course.title,
        }))

        const allOptions = [{ value: 'general_query', label: 'General Query' }, ...formattedCourses]
        setCourses(allOptions)
      } catch (error) {
        toast.error('Could not load course list.')
      } finally {
        setIsFetchingCourses(false)
      }
    }
    fetchCourses()
  }, [])

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const selectedCourseTitles = values.courses
        .map((courseId) => {
          return courses.find((course) => course.value === courseId)?.label || courseId
        })
        .join(', ')

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          subject: `New Course Inquiry from ${values.name}`,
          from_name: 'Nexus Learning',
          name: values.name,
          email: values.email,
          phone: values.phone,
          courses: selectedCourseTitles,
          remarks: values.remarks,
        }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success('Inquiry sent! We will contact you shortly.')
        form.reset()
      } else {
        throw new Error(result.message || 'Failed to send inquiry.')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Blue Header Section */}
      <div className="w-full bg-brand-primary-blue p-8 md:p-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Get In Touch</h1>
        <p className="text-slate-200 mt-2 max-w-2xl mx-auto">
          Fill out the form below to start your learning journey. We&apos;ll contact you to complete the enrollment
          process.
        </p>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto p-4 md:p-8 md:pb-16">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-brand-deep-blue">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="h-12 focus:border-brand-primary-blue focus:ring-2 focus:ring-brand-primary-blue/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 font-light" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-brand-deep-blue">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      className="h-12 focus:border-brand-primary-blue focus:ring-2 focus:ring-brand-primary-blue/20"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 font-light" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-brand-deep-blue">WhatsApp Phone Number</FormLabel>
                  <FormControl>
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      placeholder="Enter phone number"
                      {...field}
                      className={cn(
                        'flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                        'focus:border-brand-primary-blue focus:ring-2 focus:ring-brand-primary-blue/20',
                      )}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 font-light" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-brand-deep-blue">Course/s of Interest</FormLabel>
                  <MultiSelect
                    options={courses}
                    selected={field.value}
                    onChange={field.onChange}
                    className="w-full "
                    placeholder={isFetchingCourses ? 'Loading courses...' : 'Select "General Query" or Pick Courses...'}
                  />
                  <FormMessage className="text-red-500 font-light" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-brand-deep-blue">Remarks (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us anything else you'd like us to know."
                      className="resize-none min-h-[8rem] focus:border-brand-primary-blue focus:ring-2 focus:ring-brand-primary-blue/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 font-light" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading || isFetchingCourses}
              className="w-full bg-brand-primary-blue hover:bg-brand-dark-blue py-6 text-lg text-white"
            >
              Submit Inquiry
              <Send className="h-5 w-5 ml-2" />
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}

export default ContactPage
