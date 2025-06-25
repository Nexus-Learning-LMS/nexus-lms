import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { SearchInput } from '@/components/search-input'
import { getCourses } from '@/actions/get-courses'
import { CoursesList } from '@/components/courses-list'

import { Categories } from './_components/categories'

interface SearchPageProps {
  searchParams: {
    title: string
    categoryId: string
  }
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth()

  if (!userId) {
    return redirect('/')
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  const courses = await getCourses({
    userId,
    ...searchParams,
  })

  return (
    <div>
      {/* New Blue Header Section */}
      <div className="w-full bg-brand-primary-blue p-8 md:p-12">
        <div className="text-center text-white space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Explore Our Courses</h1>
          <p className="text-slate-200">Find your next learning opportunity.</p>
        </div>
        <div className="max-w-xl mx-auto mt-6">
          <SearchInput />
        </div>
      </div>

      <div className="p-6 space-y-8 md:pb-16">
        {/* Categories section with inline title */}
        <div className="flex items-center gap-x-4">
          <h2 className="text-lg font-semibold text-brand-deep-blue whitespace-nowrap pb-2">Filter by:</h2>
          <Categories items={categories} />
        </div>

        {/* Courses List section */}
        <div>
          <CoursesList items={courses} />
        </div>
      </div>
    </div>
  )
}

export default SearchPage
