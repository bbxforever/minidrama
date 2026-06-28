import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdBanner from '@/components/AdBanner'

export const dynamic = 'force-dynamic'

export default async function PlayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const episode = await prisma.episode.findUnique({
    where: { id: parseInt(id) },
    include: { drama: { include: { episodes: { orderBy: { episode: 'asc' } } } } },
  })
  if (!episode) notFound()

  const { drama } = episode
  const currentIndex = drama.episodes.findIndex(e => e.id === episode.id)
  const prev = drama.episodes[currentIndex - 1]
  const next = drama.episodes[currentIndex + 1]

  return (
    <div className="max-w-2xl mx-auto">
      {/* 面包屑 */}
      <div className="text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-rose-500 transition-colors">首页</Link>
        <span className="mx-2">›</span>
        <Link href={`/drama/${drama.id}`} className="hover:text-rose-500 transition-colors">{drama.title}</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">第 {episode.episode} 集</span>
      </div>

      <AdBanner />

      {/* 播放器 */}
      <div className="relative w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-lg mb-4">
        <iframe
          src={`https://www.youtube.com/embed/${episode.youtubeId}?autoplay=1&rel=0`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* 剧集标题 */}
      <div className="bg-white rounded-xl px-4 py-3 mb-4 shadow-sm">
        <p className="font-semibold text-gray-800">{drama.title}</p>
        <p className="text-sm text-gray-400 mt-0.5">第 {episode.episode} 集{episode.title ? ` · ${episode.title}` : ''}</p>
      </div>

      {/* 上下集 */}
      <div className="flex gap-3 mb-5">
        {prev ? (
          <Link href={`/play/${prev.id}`}
            className="flex-1 py-2.5 text-center rounded-xl bg-white border border-gray-200 hover:border-rose-300 hover:text-rose-500 transition-colors text-sm font-medium shadow-sm">
            ← 上一集
          </Link>
        ) : <div className="flex-1" />}
        <Link href={`/drama/${drama.id}`}
          className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-rose-300 hover:text-rose-500 transition-colors text-sm font-medium shadow-sm">
          选集
        </Link>
        {next ? (
          <Link href={`/play/${next.id}`}
            className="flex-1 py-2.5 text-center rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors text-sm font-medium shadow-sm shadow-rose-200">
            下一集 →
          </Link>
        ) : <div className="flex-1" />}
      </div>

      <AdBanner />

      {/* 选集列表 */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-800 mb-3">选集</h3>
        <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
          {drama.episodes.map(ep => (
            <Link key={ep.id} href={`/play/${ep.id}`}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors border
                ${ep.id === episode.id
                  ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-100 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200'
                }`}>
              {ep.episode}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
