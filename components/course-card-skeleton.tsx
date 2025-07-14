import { Skeleton } from '@/components/ui/skeleton'

export const CourseCardSkeleton = () => {
  return (
    <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
      <div className="relative w-full aspect-video rounded-md overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex flex-col pt-2">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
        <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </div>
  )
}
