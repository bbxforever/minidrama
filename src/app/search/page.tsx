import { prisma } from '@/lib/db'
import DramaCard from '@/components/DramaCard'

export const dynamic = 'force-dynamic'

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
    take: 48,
  }) : []

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">
        {query ? `搜索「${query}」· ${dramas.length} 个结果` : '请输入搜索词'}
      </h1>
      {dramas.length === 0 && query && (
        <p className="text-gray-400">没有找到相关短剧，换个关键词试试？</p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {dramas.map(d => (
          <DramaCard key={d.id} id={d.id} title={d.title} coverUrl={d.coverUrl}
            category={d.category} episodeCount={d._count.episodes} status={d.status} />
        ))}
      </div>
    </div>
  )
}
