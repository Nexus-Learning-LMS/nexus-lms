'use client'

import * as z from 'zod'
import axios, { CancelTokenSource } from 'axios'
import MuxPlayer from '@mux/mux-player-react'
import { PlusCircle, Trash, Video, X } from 'lucide-react'
import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, MuxData } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null }
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  videoUrl: z.string().nullable(),
  assetId: z.string().optional().nullable(),
  playbackId: z.string().optional().nullable(),
})

export const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
  const router = useRouter()

  // State for UI control
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [videoReady, setVideoReady] = useState(!!initialData.muxData?.playbackId)

  // State for data
  const [playbackId, setPlaybackId] = useState(initialData.muxData?.playbackId || '')

  // State for upload progress and cancellation
  const [uploadProgress, setUploadProgress] = useState(0)
  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null)

  const toggleEdit = () => setIsEditing((current) => !current)

  // --- Upload and Polling Logic ---

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
      }, 3000)
    })
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    cancelTokenSourceRef.current = axios.CancelToken.source()

    const loadingToast = toast.loading('1/3: Preparing upload...')

    try {
      const res = await axios.post(`/api/mux/upload`)
      const { uploadUrl, uploadId } = res.data

      toast.loading('2/3: Uploading video...', { id: loadingToast })
      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          setUploadProgress(percent)
        },
        cancelToken: cancelTokenSourceRef.current.token,
      })

      toast.loading('3/3: Processing video...', { id: loadingToast })
      const { assetId, playbackId } = await pollMuxStatus(uploadId)

      await onSubmit({
        videoUrl: `https://stream.mux.com/${playbackId}.m3u8`,
        assetId: assetId,
        playbackId: playbackId,
      })
      toast.success('Video uploaded successfully!')
    } catch (error) {
      if (axios.isCancel(error)) {
        toast.error('Upload canceled.')
      } else {
        toast.error('Upload failed. Please try again.')
      }
    } finally {
      toast.dismiss(loadingToast)
      setUploading(false)
      setUploadProgress(0)
      cancelTokenSourceRef.current = null
    }
  }

  const cancelUpload = () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel('Upload canceled by user.')
      setIsEditing(false) // Exit editing mode on cancel
    }
  }

  // --- Submit and Remove Logic ---

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)

      if (values.playbackId) {
        setPlaybackId(values.playbackId)
        setVideoReady(true)
      }

      toggleEdit()
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    }
  }

  const onRemove = async () => {
    const removeToast = toast.loading('Removing video...')
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, {
        videoUrl: null,
      })

      setVideoReady(false)
      setPlaybackId('')
      toast.success('Video removed.')
      router.refresh()
    } catch (error) {
      toast.error('Failed to remove video.')
    } finally {
      toast.dismiss(removeToast)
    }
  }

  // --- JSX Rendering ---

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        {/* --- DYNAMIC BUTTON LOGIC --- */}
        {!uploading && (
          <Button onClick={videoReady ? onRemove : toggleEdit} variant={videoReady ? 'destructive' : 'ghost'}>
            {videoReady && (
              <>
                <Trash className="h-4 w-4 mr-2" />
                Remove
              </>
            )}
            {isEditing && !videoReady && <>Cancel</>}
            {!isEditing && !videoReady && (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add a video
              </>
            )}
          </Button>
        )}
        {uploading && (
          <Button onClick={cancelUpload} variant="destructive">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>

      {/* --- DYNAMIC CONTENT AREA --- */}
      <div className="mt-4">
        {videoReady ? (
          <div className="relative aspect-video">
            <MuxPlayer playbackId={playbackId} />
          </div>
        ) : isEditing ? (
          <div>
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              onChange={onUpload}
              disabled={uploading}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
            />
            {uploading && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-muted-foreground mt-2">Uploading: {uploadProgress}%</p>
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-4">Upload this chapter's video</div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
            <p className="ml-2 text-sm text-slate-500">Add a video for this chapter</p>
          </div>
        )}
      </div>
    </div>
  )
}
