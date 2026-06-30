import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DeleteButton from './DeleteButton'

export const dynamic = 'force-dynamic'

const ADMIN_KEY = process.env.CRON_SECRET

export default async function AdminChannelsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; filter?: string }>
}) {
  const { key, filter } = await searchParams
  if (key !== ADMIN_KEY) notFound()

  const where = filter === 'empty' ? { episodes: { none: {} } } : {}

  const dramas = await prisma.drama.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { episodes: true } } },
  })

  const total = await prisma.drama.count()
  const emptyCount = await prisma.drama.count({ where: { episodes: { none: {} } } })

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">频道管理</h1>
          <p className="text-sm text-gray-500 mt-1">共 {total} 个频道，其中 {emptyCount} 个无内容</p>
        </div>
        <Link href="/" className="text-sm text-rose-500 hover:underline">← 返回首页</Link>
      </div>

      {/* 过滤器 */}
      <div className="flex gap-2 mb-5">
        <Link href={`?key=${key}`}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!filter ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          全部 ({total})
        </Link>
        <Link href={`?key=${key}&filter=empty`}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'empty' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          无内容 ({emptyCount})
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">ID</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">频道名称</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">分类</th>
              <th className="text-center px-4 py-3 text-gray-500 font-medium">集数</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">YouTube 频道 ID</th>
              <th className="text-center px-4 py-3 text-gray-500 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {dramas.map(d => (
              <tr key={d.id} className={`hover:bg-gray-50 transition-colors ${d._count.episodes === 0 ? 'bg-amber-50/50' : ''}`}>
                <td className="px-4 py-3 text-gray-400">{d.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {d.coverUrl && (
                      <img src={d.coverUrl} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                    )}
                    <span className="font-medium text-gray-800 truncate max-w-[200px]">{d.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-rose-50 text-rose-600">{d.category}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-medium ${d._count.episodes === 0 ? 'text-amber-500' : 'text-gray-700'}`}>
                    {d._count.episodes}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 font-mono text-xs truncate max-w-[160px]">
                  {d.youtubeChannelId ?? '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <DeleteButton id={d.id} adminKey={key!} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
