import { prisma } from '@/lib/db'
import DramaCard from '@/components/DramaCard'
import AdBanner from '@/components/AdBanner'
import AdSquare from '@/components/AdSquare'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 24

const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'romance', label: '爱情' },
  { key: 'historical', label: '古装' },
  { key: 'modern', label: '都市' },
  { key: 'suspense', label: '悬疑' },
]

export default async function HomePage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1') || 1)

  const [dramas, total, categoryCounts] = await Promise.all([
    prisma.drama.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { episodes: true } } },
    }),
    prisma.drama.count(),
    prisma.drama.groupBy({ by: ['category'], _count: { id: true } }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const countMap = Object.fromEntries(categoryCounts.map(c => [c.category, c._count.id]))

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
              {countMap[c.key] ? <span className="ml-1 opacity-70 text-xs">({countMap[c.key]})</span> : null}
            </Link>
          ))}
        </div>
      </div>

      <AdBanner />

      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">最新更新</h2>
        <span className="text-sm text-gray-400">共 {total} 部短剧</span>
      </div>

      {dramas.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">🎬</p>
          <p className="font-medium">暂无内容</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {dramas.map(d => (
              <DramaCard key={d.id} id={d.id} title={d.title} coverUrl={d.coverUrl}
                category={d.category} episodeCount={d._count.episodes} status={d.status} />
            ))}
          </div>

          <AdSquare />

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {page > 1 && (
                <Link href={`/?page=${page - 1}`}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:border-rose-300 hover:text-rose-500 transition-colors shadow-sm">
                  ← 上一页
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
                  ) : (
                    <Link key={p} href={p === 1 ? '/' : `/?page=${p}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                        ${p === page
                          ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500'
                        }`}>
                      {p}
                    </Link>
                  )
                )}

              {page < totalPages && (
                <Link href={`/?page=${page + 1}`}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:border-rose-300 hover:text-rose-500 transition-colors shadow-sm">
                  下一页 →
                </Link>
              )}
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-3">
            第 {page} / {totalPages} 页 · 共 {total} 部
          </p>
        </>
      )}
    </div>
  )
}
