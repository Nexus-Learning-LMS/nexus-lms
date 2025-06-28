import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { File, Link, Lock } from 'lucide-react'

import { getChapter } from '@/actions/get-chapter'
import { Banner } from '@/components/banner'
import { Separator } from '@/components/ui/separator'
import { Preview } from '@/components/preview'

import { VideoPlayer } from './_components/video-player'
import { CourseEnrollButton } from './_components/course-enroll-button'
import { CourseProgressButton } from './_components/course-progress-button'

const ChapterIdPage = async ({ params }: { params: { courseId: string; chapterId: string } }) => {
  const { userId } = await auth()

  if (!userId) {
    return redirect('/')
  }

  const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  })

  if (!chapter || !course) {
    return redirect('/')
  }

  const isLocked = !chapter.isFree && !purchase
  const completeOnEnd = !!purchase && !userProgress?.isCompleted

  return (
    <div>
      {userProgress?.isCompleted && <Banner variant="success" label="You already completed this chapter." />}
      {isLocked && <Banner variant="warning" label="You need to purchase this course to watch this chapter." />}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        {muxData?.playbackId ? (
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
          // If the chapter is locked, show the locked screen.
          // Otherwise, show a "video not found" message, which is better UX than infinite buffering.
          <div className="relative aspect-video">
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white flex-col gap-y-2">
              {isLocked ? (
                <>
                  <Lock className="h-8 w-8" />
                  <p className="text-sm">This chapter is locked</p>
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
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton />
            )}
          </div>
          <Separator className=" bg-slate-400" />
          <div>
            <p className="text-lg pl-4 pt-4 font-medium text-brand-dark-blue">Chapter Description:</p>
            {/* Conditionally render the Preview component or a placeholder */}
            {chapter.description ? (
              <Preview value={chapter.description} />
            ) : (
              <p className="text-sm text-slate-500 italic px-4 py-2">N/A</p>
            )}
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChapterIdPage
