import Link from 'next/link'
import Image from 'next/image'

interface Props {
  id: number
  title: string
  coverUrl: string | null
  category: string
  episodeCount: number
  status: string
}

export default function DramaCard({ id, title, coverUrl, category, episodeCount, status }: Props) {
  return (
    <Link href={`/drama/${id}`} className="group block rounded-lg overflow-hidden bg-gray-900 hover:ring-2 hover:ring-rose-500 transition-all">
      <div className="relative aspect-[9/16] bg-gray-800">
        {coverUrl ? (
          <Image src={coverUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-4xl">🎬</div>
        )}
        <div className="absolute top-2 left-2 bg-rose-600 text-xs px-2 py-0.5 rounded">{category}</div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-xs px-2 py-0.5 rounded">
          {episodeCount} 集 {status === 'completed' ? '· 完结' : '· 更新中'}
        </div>
      </div>
      <div className="p-2">
        <p className="text-sm font-medium line-clamp-2 leading-snug">{title}</p>
      </div>
    </Link>
  )
}
