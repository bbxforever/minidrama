import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdBanner from '@/components/AdBanner'
import AdSquare from '@/components/AdSquare'
import CoverImage from '@/components/CoverImage'

export const dynamic = 'force-dynamic'

const CATEGORY_LABELS: Record<string, string> = {
  romance: '爱情', historical: '古装', modern: '都市', suspense: '悬疑',
}

export default async function DramaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const drama = await prisma.drama.findUnique({
    where: { id: parseInt(id) },
    include: { episodes: { orderBy: { episode: 'asc' } } },
  })
  if (!drama) notFound()

  return (
    <div className="max-w-4xl mx-auto">
      {/* 面包屑 */}
      <div className="text-sm text-gray-400 mb-5">
        <Link href="/" className="hover:text-rose-500 transition-colors">首页</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{drama.title}</span>
      </div>

      {/* 剧集信息卡 */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-40 shrink-0">
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-100 shadow">
              <CoverImage title={drama.title} category={drama.category} className="rounded-xl" />
            </div>
          </div>
          <div className="flex-1">
            <span className="inline-block bg-rose-100 text-rose-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {CATEGORY_LABELS[drama.category] ?? drama.category}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{drama.title}</h1>
            {drama.titleEn && <p className="text-gray-400 text-sm mb-3">{drama.titleEn}</p>}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gray-500">共 {drama.episodes.length} 集</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                drama.status === 'completed'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-amber-100 text-amber-600'
              }`}>
                {drama.status === 'completed' ? '已完结' : '更新中'}
              </span>
            </div>
            {drama.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{drama.description}</p>
            )}
            {drama.episodes[0] && (
              <Link href={`/play/${drama.episodes[0].id}`}
                className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm shadow-rose-200">
                ▶ 从第 1 集开始看
              </Link>
            )}
          </div>
        </div>
      </div>

      <AdBanner />

      <AdSquare />

      {/* 选集 */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-bold text-gray-800 mb-4">选集</h2>
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2">
          {drama.episodes.map(ep => (
            <Link key={ep.id} href={`/play/${ep.id}`}
              className="aspect-square flex items-center justify-center rounded-lg text-sm font-medium bg-gray-50 hover:bg-rose-500 hover:text-white text-gray-700 border border-gray-100 transition-colors">
              {ep.episode}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
