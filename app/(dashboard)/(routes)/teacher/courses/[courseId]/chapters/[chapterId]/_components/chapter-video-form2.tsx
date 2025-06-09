'use client'

import * as z from 'zod'
import axios from 'axios'
import MuxPlayer from '@mux/mux-player-react'
import { Pencil, PlusCircle, Video } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, MuxData } from '@prisma/client'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null }
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
  assetId: z.string().optional(),
  playbackId: z.string().optional(),
})

export const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoReady, setVideoReady] = useState(!!initialData.muxData?.playbackId)
  const [playbackId, setPlaybackId] = useState(initialData.muxData?.playbackId || '')

  const toggleEdit = () => setIsEditing((current) => !current)

  const router = useRouter()

  const pollMuxStatus = async (uploadId: string): Promise<{ assetId: string; playbackId: string }> => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const { data } = await axios.get(`/api/mux/status/${uploadId}`)
          if (data.status === 'ready') {
            clearInterval(interval)
            if (!data.assetId || !data.playbackId) {
              reject(new Error('Mux processing finished, but IDs are missing.'))
            } else {
              resolve({ assetId: data.assetId, playbackId: data.playbackId })
            }
          }
        } catch (error) {
          clearInterval(interval)
          console.error('Failed to poll Mux status', error)
          reject(error)
        }
      }, 3000) // Poll every 3 seconds
    })
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    const loadingToast = toast.loading('Uploading video...')

    try {
      // Create upload URL from your API route
      // Step 1: Get signed upload URL

      const res = await axios.post(`/api/mux/upload`)

      const { uploadUrl, uploadId } = res.data

      // Upload file to Mux URL
      // Step 2: Upload with progress tracking
      toast.loading('2/3: Uploading video...', { id: loadingToast })
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          setUploadProgress(percent)
        },
      })

      // Step 3: Poll Mux until the video is processed and ready
      toast.loading('3/3: Processing video...', { id: loadingToast })
      const { assetId, playbackId } = await pollMuxStatus(uploadId)

      // Store temporary URL (mux will process later)
      // Step 4: Save the final Mux data to your database
      await onSubmit({
        videoUrl: `https://stream.mux.com/${playbackId}.m3u8`,
        assetId: assetId,
        playbackId: playbackId,
      })
      toast.success('Video uploaded! Processing by Mux…')
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      toast.dismiss(loadingToast)
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // The PATCH request now sends assetId and playbackId
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)

      // Update the UI immediately with the new playbackId
      if (values.playbackId) {
        setPlaybackId(values.playbackId);
        setVideoReady(true);
      }

  
      toast.success('Chapter updated')
      toggleEdit()
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {/* <div className="relative aspect-video mt-2">
        <MuxPlayer playbackId={playbackId} />
      </div> */}
      {/* Single MuxPlayer rendered only if videoReady */}
      {videoReady ? (
        <div className="relative aspect-video mt-2">
          <MuxPlayer playbackId={playbackId} />
        </div>
      ) : (
        // Show placeholder box with icon while video processing
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
          <Video className="h-10 w-10 text-slate-500" />
          <span className="ml-2 text-slate-600">Video processing...</span>
        </div>
      )}
      {/* {!isEditing &&
        (!videoReady ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={playbackId} />
          </div>
        ))} */}
      {isEditing && (
        <div className="mt-4 space-y-2">

          {/* <input type="file" accept="video/*" onChange={onUpload} disabled={uploading} /> */}
          <input type="file" accept="video/*" onChange={onUpload} disabled={uploading} />
          {uploading && <div className="text-sm text-muted-foreground">Uploading: {uploadProgress}%...</div>}
          <div className="text-xs text-muted-foreground mt-4">Upload this chapter&apos;s video</div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page if video does not appear.
        </div>
      )}
    </div>
  )
}
