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
  const isCompleted = status === 'completed'
  return (
    <Link href={`/drama/${id}`} className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative aspect-[9/16] bg-gray-100">
        <CoverImage title={title} category={category} coverUrl={coverUrl} />

        {/* 分类标签 */}
        <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow z-10">
          {CATEGORY_LABELS[category] ?? category}
        </div>

        {/* 集数 + 状态 — 右上角 */}
        <div className="absolute top-2 right-2 z-10">
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isCompleted ? 'bg-green-500/80 text-white' : 'bg-black/50 text-white'}`}>
            {episodeCount}集
          </span>
        </div>
      </div>

      {/* 标题行 */}
      <div className="px-2.5 py-2">
        <p className="text-sm font-semibold text-gray-800 line-clamp-1 leading-snug">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{isCompleted ? '✓ 已完结' : '· 更新中'}</p>
      </div>
    </Link>
  )
}
