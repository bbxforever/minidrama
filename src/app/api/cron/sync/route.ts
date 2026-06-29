import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { fetchChannelVideos, fetchVideoDetails, parseDuration } from '@/lib/youtube'

export const maxDuration = 300

// 每次最多同步 5 个频道，用 batch 参数轮转（0=第1批, 1=第2批...）
const BATCH_SIZE = 5

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const batchParam = req.nextUrl.searchParams.get('batch')

  const allDramas = await prisma.drama.findMany({
    where: { youtubeChannelId: { not: null } },
    select: { id: true, title: true, youtubeChannelId: true },
    orderBy: { id: 'asc' },
  })

  // 自动计算批次：按 updatedAt 最旧的先同步
  let dramas = allDramas
  if (batchParam !== null) {
    const batch = parseInt(batchParam) || 0
    dramas = allDramas.slice(batch * BATCH_SIZE, (batch + 1) * BATCH_SIZE)
  } else {
    // 默认取最久未更新的 5 个
    const staleDramas = await prisma.drama.findMany({
      where: { youtubeChannelId: { not: null } },
      select: { id: true, title: true, youtubeChannelId: true },
      orderBy: { updatedAt: 'asc' },
      take: BATCH_SIZE,
    })
    dramas = staleDramas
  }

  const results: { title: string; synced: number; error?: string }[] = []

  for (const drama of dramas) {
    try {
      const videos = await fetchChannelVideos(drama.youtubeChannelId!, 30)
      if (!videos.length) { results.push({ title: drama.title, synced: 0 }); continue }

      const videoIds = videos.map((v: { id: { videoId: string } }) => v.id.videoId)
      const details = await fetchVideoDetails(videoIds)

      let synced = 0
      for (let i = 0; i < details.length; i++) {
        const v = details[i]
        await prisma.episode.upsert({
          where: { youtubeId: v.id },
          create: {
            dramaId: drama.id,
            episode: i + 1,
            title: v.snippet.title,
            youtubeId: v.id,
            duration: parseDuration(v.contentDetails.duration),
          },
          update: {},
        })
        synced++
      }

      await prisma.drama.update({ where: { id: drama.id }, data: { updatedAt: new Date() } })
      results.push({ title: drama.title, synced })
    } catch (e) {
      results.push({ title: drama.title, synced: 0, error: String(e) })
    }
  }

  const total = results.reduce((s, r) => s + r.synced, 0)
  console.log(`[cron/sync] ${dramas.length} channels, ${total} new episodes`)
  return NextResponse.json({
    ok: true,
    channels: dramas.length,
    totalSynced: total,
    totalChannels: allDramas.length,
    results,
  })
}
