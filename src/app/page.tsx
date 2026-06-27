import { prisma } from '@/lib/db'
import DramaCard from '@/components/DramaCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const CATEGORIES = [
  { key: 'romance', label: '爱情 Romance' },
  { key: 'historical', label: '古装 Historical' },
  { key: 'modern', label: '都市 Modern' },
  { key: 'suspense', label: '悬疑 Suspense' },
]

export default async function HomePage() {
  const dramas = await prisma.drama.findMany({
    take: 24,
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { episodes: true } } },
  })

  return (
    <div>
      <div className="text-center py-10 mb-8">
        <h1 className="text-3xl font-bold mb-2">🎬 MiniDrama</h1>
        <p className="text-gray-400">免费在线观看中文短剧 · Watch Free Chinese Short Dramas</p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        {CATEGORIES.map(c => (
          <Link key={c.key} href={`/category/${c.key}`}
            className="px-4 py-2 rounded-full bg-gray-800 hover:bg-rose-600 transition-colors text-sm">
            {c.label}
          </Link>
        ))}
      </div>

      {/* AdSense 横幅位 */}
      <div className="w-full h-20 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 text-sm mb-8">
        广告位 · Advertisement
      </div>

      <h2 className="text-xl font-bold mb-4">最新更新 · Latest</h2>
      {dramas.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-4">🎬</p>
          <p>暂无内容，请先同步短剧数据</p>
          <p className="text-sm mt-2">No content yet. Sync dramas first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {dramas.map(d => (
            <DramaCard key={d.id} id={d.id} title={d.title} coverUrl={d.coverUrl}
              category={d.category} episodeCount={d._count.episodes} status={d.status} />
          ))}
        </div>
      )}
    </div>
  )
}
