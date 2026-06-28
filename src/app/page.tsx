import { prisma } from '@/lib/db'
import DramaCard from '@/components/DramaCard'
import AdBanner from '@/components/AdBanner'
import AdSquare from '@/components/AdSquare'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'romance', label: '爱情' },
  { key: 'historical', label: '古装' },
  { key: 'modern', label: '都市' },
  { key: 'suspense', label: '悬疑' },
]

export default async function HomePage() {
  const dramas = await prisma.drama.findMany({
    take: 24,
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { episodes: true } } },
  })

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-rose-500 to-pink-400 rounded-2xl px-8 py-10 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,white,transparent)]" />
        <h1 className="text-3xl font-bold text-white mb-2">短剧免费看 🎬</h1>
        <p className="text-rose-100 mb-5">精选爱情·古装·都市短剧，随时随地畅享</p>
        <div className="flex gap-3 flex-wrap">
          {CATEGORIES.slice(1).map(c => (
            <Link key={c.key} href={`/category/${c.key}`}
              className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium transition-colors backdrop-blur-sm">
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      <AdBanner />

      {/* Drama Grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">最新更新</h2>
        <span className="text-sm text-gray-400">{dramas.length} 部短剧</span>
      </div>

      {dramas.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">🎬</p>
          <p className="font-medium">暂无内容</p>
          <p className="text-sm mt-1">No content yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {dramas.map(d => (
            <DramaCard key={d.id} id={d.id} title={d.title} coverUrl={d.coverUrl}
              category={d.category} episodeCount={d._count.episodes} status={d.status} />
          ))}
        </div>
        <AdSquare />
      )}
    </div>
  )
}
