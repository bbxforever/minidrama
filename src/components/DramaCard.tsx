import Link from 'next/link'
import CoverImage from './CoverImage'

interface Props {
  id: number
  title: string
  coverUrl: string | null
  category: string
  episodeCount: number
  status: string
}

const CATEGORY_LABELS: Record<string, string> = {
  romance: '爱情', historical: '古装', modern: '都市', suspense: '悬疑',
}

export default function DramaCard({ id, title, coverUrl, category, episodeCount, status }: Props) {
  return (
    <Link href={`/drama/${id}`} className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative aspect-[9/16] bg-gray-100">
        <CoverImage title={title} category={category} />
        <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow">
          {CATEGORY_LABELS[category] ?? category}
        </div>
        <div className="absolute bottom-0 inset-x-0 pt-6 pb-2 px-2">
          <span className="text-white text-xs drop-shadow">
            {episodeCount} 集 · {status === 'completed' ? '完结' : '更新中'}
          </span>
        </div>
      </div>
      <div className="p-2.5">
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">{title}</p>
      </div>
    </Link>
  )
}
