import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'

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
      {/* 顶部面包屑 */}
      <div className="text-sm text-gray-400 mb-3">
        <Link href="/" className="hover:text-white">首页</Link>
        {' · '}
        <Link href={`/drama/${drama.id}`} className="hover:text-white">{drama.title}</Link>
        {' · '}
        <span>第 {episode.episode} 集</span>
      </div>

      {/* AdSense 播放前横幅 */}
      <div className="w-full h-16 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 text-sm mb-4">
        广告位 · Advertisement
      </div>

      {/* YouTube 播放器 */}
      <div className="relative w-full aspect-[9/16] bg-black rounded-lg overflow-hidden mb-4">
        <iframe
          src={`https://www.youtube.com/embed/${episode.youtubeId}?autoplay=1&rel=0`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* 上下集切换 */}
      <div className="flex gap-3 mb-6">
        {prev ? (
          <Link href={`/play/${prev.id}`}
            className="flex-1 py-2 text-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm">
            ← 上一集
          </Link>
        ) : <div className="flex-1" />}
        <Link href={`/drama/${drama.id}`}
          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-sm">
          选集
        </Link>
        {next ? (
          <Link href={`/play/${next.id}`}
            className="flex-1 py-2 text-center rounded-lg bg-rose-600 hover:bg-rose-700 transition-colors text-sm">
            下一集 →
          </Link>
        ) : <div className="flex-1" />}
      </div>

      {/* AdSense 侧边/信息流广告位 */}
      <div className="w-full h-24 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 text-sm mb-4">
        广告位 · Advertisement
      </div>

      {/* 选集列表 */}
      <h3 className="font-bold mb-3">选集 · Episodes</h3>
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
        {drama.episodes.map(ep => (
          <Link key={ep.id} href={`/play/${ep.id}`}
            className={`aspect-square flex items-center justify-center rounded text-sm font-medium transition-colors
              ${ep.id === episode.id ? 'bg-rose-600' : 'bg-gray-800 hover:bg-gray-700'}`}>
            {ep.episode}
          </Link>
        ))}
      </div>
    </div>
  )
}
