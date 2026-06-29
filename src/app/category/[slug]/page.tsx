import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import DramaCard from '@/components/DramaCard'
import AdBanner from '@/components/AdBanner'
import AdSquare from '@/components/AdSquare'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 24

const CATEGORIES: Record<string, { label: string; labelEn: string; emoji: string; color: string }> = {
  romance:    { label: '爱情', labelEn: 'Romance',    emoji: '💕', color: 'from-rose-500 to-pink-400' },
  historical: { label: '古装', labelEn: 'Historical', emoji: '🏯', color: 'from-amber-600 to-yellow-500' },
  modern:     { label: '都市', labelEn: 'Modern',     emoji: '🏙️', color: 'from-violet-600 to-purple-400' },
  suspense:   { label: '悬疑', labelEn: 'Suspense',   emoji: '🔍', color: 'from-slate-700 to-blue-600' },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIES[slug]
  if (!cat) return {}
  return {
    title: `${cat.label}短剧免费看 - MiniDrama | Free ${cat.labelEn} Short Dramas`,
    description: `免费在线观看${cat.label}短剧大全，最新${cat.label}短剧合集。Watch free ${cat.labelEn.toLowerCase()} Chinese short dramas online on MiniDrama.`,
    keywords: `${cat.label}短剧, 免费${cat.label}短剧, ${cat.labelEn} short drama, mini drama`,
    alternates: { canonical: `https://www.minidramawatch.com/category/${slug}` },
    openGraph: {
      title: `${cat.label}短剧 - MiniDrama`,
      description: `免费在线观看${cat.label}短剧，精选合集。`,
      url: `https://www.minidramawatch.com/category/${slug}`,
      siteName: 'MiniDrama',
      type: 'website',
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page: pageStr } = await searchParams
  const cat = CATEGORIES[slug]
  if (!cat) notFound()

  const page = Math.max(1, parseInt(pageStr ?? '1') || 1)
  const [dramas, total] = await Promise.all([
    prisma.drama.findMany({
      where: { category: slug },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { episodes: true } } },
    }),
    prisma.drama.count({ where: { category: slug } }),
  ])
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      {/* Category Hero */}
      <div className={`relative bg-gradient-to-r ${cat.color} rounded-2xl px-8 py-10 mb-8 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,white,transparent)]" />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{cat.emoji}</span>
          <h1 className="text-3xl font-bold text-white">{cat.label}短剧</h1>
        </div>
        <p className="text-white/80 mb-5">{cat.labelEn} · 共 {total} 部</p>
        {/* 其他分类快捷跳转 */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(CATEGORIES).filter(([k]) => k !== slug).map(([k, v]) => (
            <Link key={k} href={`/category/${k}`}
              className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm transition-colors">
              {v.emoji} {v.label}
            </Link>
          ))}
          <Link href="/"
            className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm transition-colors">
            全部
          </Link>
        </div>
      </div>

      {/* 面包屑 */}
      <div className="text-sm text-gray-400 mb-5">
        <Link href="/" className="hover:text-rose-500 transition-colors">首页</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{cat.label}短剧</span>
      </div>

      <AdBanner />

      {dramas.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">{cat.emoji}</p>
          <p className="font-medium">暂无{cat.label}内容</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">{cat.label}短剧</h2>
            <span className="text-sm text-gray-400">共 {total} 部</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {dramas.map(d => (
              <DramaCard key={d.id} id={d.id} title={d.title} coverUrl={d.coverUrl}
                category={d.category} episodeCount={d._count.episodes} status={d.status} />
            ))}
          </div>
          <AdSquare />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {page > 1 && (
                <Link href={`/category/${slug}?page=${page - 1}`}
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
                    <Link key={p} href={p === 1 ? `/category/${slug}` : `/category/${slug}?page=${p}`}
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
                <Link href={`/category/${slug}?page=${page + 1}`}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:border-rose-300 hover:text-rose-500 transition-colors shadow-sm">
                  下一页 →
                </Link>
              )}
            </div>
          )}
          {totalPages > 1 && (
            <p className="text-center text-xs text-gray-400 mt-3">
              第 {page} / {totalPages} 页 · 共 {total} 部
            </p>
          )}
        </>
      )}
    </div>
  )
}
