import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { fetchChannelVideos, fetchVideoDetails, parseDuration } from '@/lib/youtube'

// Vercel Cron Job — runs daily at 02:00 UTC
// Authorization: Vercel automatically sends CRON_SECRET in Authorization header
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dramas = await prisma.drama.findMany({
    where: { youtubeChannelId: { not: null } },
    select: { id: true, title: true, category: true, youtubeChannelId: true },
  })

  const results: { title: string; synced: number; error?: string }[] = []

  for (const drama of dramas) {
    try {
      const videos = await fetchChannelVideos(drama.youtubeChannelId!, 50)
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
  return NextResponse.json({ ok: true, channels: dramas.length, totalSynced: total, results })
}
