import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DramaCard from '@/components/DramaCard'
import AdBanner from '@/components/AdBanner'
import AdSquare from '@/components/AdSquare'

export const dynamic = 'force-dynamic'

const CATEGORIES: Record<string, { label: string; labelEn: string; emoji: string; color: string }> = {
  romance:    { label: '爱情', labelEn: 'Romance',    emoji: '💕', color: 'from-rose-500 to-pink-400' },
  historical: { label: '古装', labelEn: 'Historical', emoji: '🏯', color: 'from-amber-600 to-yellow-500' },
  modern:     { label: '都市', labelEn: 'Modern',     emoji: '🏙️', color: 'from-violet-600 to-purple-400' },
  suspense:   { label: '悬疑', labelEn: 'Suspense',   emoji: '🔍', color: 'from-slate-700 to-blue-600' },
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = CATEGORIES[slug]
  if (!cat) notFound()

  const dramas = await prisma.drama.findMany({
    where: { category: slug },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { episodes: true } } },
  })

  return (
    <div>
      {/* Category Hero */}
      <div className={`relative bg-gradient-to-r ${cat.color} rounded-2xl px-8 py-10 mb-8 overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_50%,white,transparent)]" />
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{cat.emoji}</span>
          <h1 className="text-3xl font-bold text-white">{cat.label}短剧</h1>
        </div>
        <p className="text-white/80 mb-5">{cat.labelEn} · 共 {dramas.length} 部</p>
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
            <span className="text-sm text-gray-400">共 {dramas.length} 部</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {dramas.map(d => (
              <DramaCard key={d.id} id={d.id} title={d.title} coverUrl={d.coverUrl}
                category={d.category} episodeCount={d._count.episodes} status={d.status} />
            ))}
          </div>
          <AdSquare />
        </>
      )}
    </div>
  )
}
