import Image from 'next/image'

interface TeacherCardProps {
  name: string
  title: string
  quote: string
  imageUrl: string
}

export const TeacherCard = ({ name, title, quote, imageUrl }: TeacherCardProps) => {
  return (
    <div className="relative aspect-[3/4] w-full max-w-sm shrink-0 overflow-hidden rounded-xl shadow-lg">
      <Image
        src={imageUrl}
        alt={`Photo of ${name}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-sm font-light text-slate-300">{title}</p>
        <p className="mt-4 text-md italic border-l-2 border-brand-primary-blue pl-4">&quot;{quote}&quot;</p>
      </div>
    </div>
  )
}
