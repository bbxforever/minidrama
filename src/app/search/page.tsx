import { prisma } from '@/lib/db'
import { Metadata } from 'next'
import Link from 'next/link'
import DramaCard from '@/components/DramaCard'

export const dynamic = 'force-dynamic'

const HOT_SEARCHES = ['爱情', '古装', '霸总', '甜宠', '都市', '悬疑', '重生', '复仇']

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams
  return q
    ? { title: `搜索「${q}」- MiniDrama`, description: `在MiniDrama搜索${q}相关短剧。` }
    : { title: '搜索短剧 - MiniDrama' }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const dramas = query ? await prisma.drama.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { titleEn: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: { _count: { select: { episodes: true } } },
    orderBy: { updatedAt: 'desc' },
    take: 48,
  }) : []

  // 无关键词时显示最新剧
  const latestDramas = !query ? await prisma.drama.findMany({
    take: 12,
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { episodes: true } } },
  }) : []

  return (
    <div className="max-w-4xl mx-auto">
      {/* 搜索标题区 */}
      {query ? (
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            搜索「<span className="text-rose-500">{query}</span>」
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {dramas.length > 0 ? `共找到 ${dramas.length} 个结果` : '没有找到相关结果'}
          </p>
        </div>
      ) : (
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-800 mb-4">搜索短剧</h1>
          {/* 热门搜索 */}
          <div>
            <p className="text-sm text-gray-500 mb-3 font-medium">🔥 热门搜索</p>
            <div className="flex flex-wrap gap-2">
              {HOT_SEARCHES.map(term => (
                <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-4 py-1.5 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 text-sm font-medium transition-colors border border-rose-100">
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 无结果 */}
      {query && dramas.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-medium text-gray-600">没有找到「{query}」相关短剧</p>
          <p className="text-sm mt-2 mb-6">换个关键词试试？</p>
          <div className="flex flex-wrap justify-center gap-2">
            {HOT_SEARCHES.map(term => (
              <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}
                className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-500 text-sm transition-colors">
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 搜索结果 */}
      {dramas.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {dramas.map(d => (
            <DramaCard key={d.id} id={d.id} title={d.title} coverUrl={d.coverUrl}
              category={d.category} episodeCount={d._count.episodes} status={d.status} />
          ))}
        </div>
      )}

      {/* 无关键词时显示最新 */}
      {!query && latestDramas.length > 0 && (
        <>
          <p className="text-sm text-gray-500 font-medium mb-3 mt-2">最近更新</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {latestDramas.map(d => (
              <DramaCard key={d.id} id={d.id} title={d.title} coverUrl={d.coverUrl}
                category={d.category} episodeCount={d._count.episodes} status={d.status} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
