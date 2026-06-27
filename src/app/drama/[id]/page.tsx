import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function DramaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const drama = await prisma.drama.findUnique({
    where: { id: parseInt(id) },
    include: { episodes: { orderBy: { episode: 'asc' } } },
  })
  if (!drama) notFound()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-48 shrink-0">
          <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gray-800">
            {drama.coverUrl && (
              <Image src={drama.coverUrl} alt={drama.title} fill className="object-cover" />
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="inline-block bg-rose-600 text-xs px-2 py-1 rounded mb-3">{drama.category}</div>
          <h1 className="text-2xl font-bold mb-1">{drama.title}</h1>
          {drama.titleEn && <p className="text-gray-400 mb-3">{drama.titleEn}</p>}
          <p className="text-sm text-gray-400 mb-4">
            共 {drama.episodes.length} 集 · {drama.status === 'completed' ? '已完结' : '更新中'}
          </p>
          {drama.description && <p className="text-gray-300 text-sm leading-relaxed">{drama.description}</p>}
          {drama.episodes[0] && (
            <Link href={`/play/${drama.episodes[0].id}`}
              className="mt-4 inline-block bg-rose-600 hover:bg-rose-700 px-6 py-2 rounded-lg font-medium transition-colors">
              ▶ 从第1集开始看
            </Link>
          )}
        </div>
      </div>

      {/* AdSense 位 */}
      <div className="w-full h-16 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 text-sm mb-6">
        广告位 · Advertisement
      </div>

      <h2 className="text-lg font-bold mb-3">选集 · Episodes</h2>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {drama.episodes.map(ep => (
          <Link key={ep.id} href={`/play/${ep.id}`}
            className="aspect-square flex items-center justify-center rounded bg-gray-800 hover:bg-rose-600 transition-colors text-sm font-medium">
            {ep.episode}
          </Link>
        ))}
      </div>
    </div>
  )
}
