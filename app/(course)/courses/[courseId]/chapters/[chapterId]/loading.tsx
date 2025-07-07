import { Loader } from 'lucide-react'

const Loading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader className="h-8 w-8 animate-spin text-sky-700" />
    </div>
  )
}

export default Loading
