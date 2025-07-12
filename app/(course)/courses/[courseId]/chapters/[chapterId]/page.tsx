import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { File, Lock } from 'lucide-react'

import { getChapter } from '@/actions/get-chapter'
import { Banner } from '@/components/banner'
import { Separator } from '@/components/ui/separator'
import { Preview } from '@/components/preview'
import { Button } from '@/components/ui/button' // <-- Added import

import { VideoPlayer } from './_components/video-player'
import { CourseEnrollButton } from './_components/course-enroll-button'
import { CourseProgressButton } from './_components/course-progress-button'
import { CountdownTimer } from './_components/countdown-timer'

interface ChapterIdPageProps {
  params: Promise<{
    courseId: string
    chapterId: string
  }>
}

const ChapterIdPage = async ({ params: paramsPromise }: ChapterIdPageProps) => {
  const params = await paramsPromise
  const { userId } = await auth()

  if (!userId) {
    return redirect('/')
  }

  const {
    chapter,
    course,
    muxData,
    nextChapter,
    userProgress,
    purchase,
    isLocked,
    unlocksAt,
    isTimerChapter,
    banner,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  })

  if (!chapter || !course) {
    return redirect('/')
  }

  const completeOnEnd = !!purchase && !userProgress?.isCompleted

  return (
    <div>
      {banner && <Banner variant={banner.variant} label={banner.label} />}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        {muxData?.playbackId && !isLocked ? (
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData.playbackId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        ) : (
          <div className="relative aspect-video">
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white flex-col gap-y-2">
              {isLocked ? (
                <>
                  <Lock className="h-8 w-8" />
                  <p className="text-sm">This chapter is locked</p>
                  {isTimerChapter && unlocksAt && <CountdownTimer unlocksAt={new Date(unlocksAt)} />}
                </>
              ) : (
                <p className="text-sm text-center">
                  This video is not available or is still processing. Please reach out to{' '}
                  <a href="/contact" className=" text-blue-400 underline hover:text-brand-dark-blue transition">
                    Nexus Learning Support
                  </a>{' '}
                  if the issue persists.
                </p>
              )}
            </div>
          </div>
        )}
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2 text-brand-deep-blue"> Chapter: {chapter.title}</h2>
            {purchase ? (
              // If the chapter is locked, render a disabled button.
              isLocked ? (
                <Button disabled>
                  Mark as complete
                  <Lock className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                // Otherwise, render the fully functional button.
                <CourseProgressButton
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
              )
            ) : (
              <CourseEnrollButton />
            )}
          </div>
          <Separator className=" bg-slate-400" />
          <div>
            <p className="text-lg pl-4 pt-4 font-medium text-brand-dark-blue">Chapter Description:</p>
            {chapter.description ? (
              <Preview value={chapter.description} />
            ) : (
              <p className="text-sm text-slate-500 italic px-4 py-2">N/A</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterIdPage
