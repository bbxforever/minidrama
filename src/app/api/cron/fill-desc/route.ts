import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { fetchChannelInfo } from '@/lib/youtube'

export const maxDuration = 300

// 一次性为所有缺少简介的剧集从 YouTube 频道拉取描述
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dramas = await prisma.drama.findMany({
    where: {
      youtubeChannelId: { not: null },
      description: null,
    },
    select: { id: true, title: true, youtubeChannelId: true, coverUrl: true },
  })

  const results: { title: string; filled: boolean; error?: string }[] = []

  for (const drama of dramas) {
    try {
      const info = await fetchChannelInfo(drama.youtubeChannelId!)
      if (!info?.description) {
        results.push({ title: drama.title, filled: false })
        continue
      }

      const update: Record<string, string> = {
        description: info.description.slice(0, 1000),
      }
      if (info.thumbnailUrl && !drama.coverUrl) {
        update.coverUrl = info.thumbnailUrl
      }

      await prisma.drama.update({ where: { id: drama.id }, data: update })
      results.push({ title: drama.title, filled: true })
    } catch (e) {
      results.push({ title: drama.title, filled: false, error: String(e) })
    }
  }

  const filled = results.filter(r => r.filled).length
  return NextResponse.json({ ok: true, total: dramas.length, filled, results })
}
