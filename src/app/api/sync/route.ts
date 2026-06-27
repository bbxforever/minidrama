import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { fetchChannelVideos, fetchVideoDetails, parseDuration } from '@/lib/youtube'

// POST /api/sync  body: { channelId, dramaTitle, category, secret }
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { channelId, dramaTitle, category = 'romance', secret } = body

  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const videos = await fetchChannelVideos(channelId, 50)
  if (!videos.length) return NextResponse.json({ error: 'No videos found' }, { status: 404 })

  const videoIds = videos.map((v: { id: { videoId: string } }) => v.id.videoId)
  const details = await fetchVideoDetails(videoIds)

  const drama = await prisma.drama.upsert({
    where: { youtubeChannelId: channelId } as never,
    create: {
      title: dramaTitle,
      category,
      youtubeChannelId: channelId,
      coverUrl: videos[0]?.snippet?.thumbnails?.high?.url ?? null,
    },
    update: { updatedAt: new Date() },
  })

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

  return NextResponse.json({ ok: true, dramaId: drama.id, synced })
}
