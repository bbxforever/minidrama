import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const maxDuration = 300

const BASE = 'https://www.googleapis.com/youtube/v3'
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!

const SEARCH_QUERIES = [
  '短剧 全集',
  '爱情短剧 全集',
  '古装短剧 全集',
  '都市短剧 全集',
  '甜宠短剧 全集',
  '霸总短剧 全集',
  '穿越短剧 全集',
  '悬疑短剧 全集',
  'Chinese short drama',
  'mini drama Chinese',
]

function guessCategory(title: string, desc: string): string {
  const text = (title + desc).toLowerCase()
  if (/古装|宫廷|穿越|历史|古代|仙侠/.test(text)) return 'historical'
  if (/悬疑|惊悚|推理|犯罪|恐怖/.test(text)) return 'suspense'
  if (/都市|职场|现代|总裁|霸总|商战/.test(text)) return 'modern'
  return 'romance'
}

async function searchChannels(query: string) {
  const url = `${BASE}/search?q=${encodeURIComponent(query)}&type=channel&maxResults=10&part=snippet&key=${YOUTUBE_API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.items) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.items.map((item: any) => ({
    channelId: item.snippet.channelId as string,
    title: item.snippet.title as string,
    description: (item.snippet.description ?? '') as string,
    thumbnailUrl: (item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url ?? '') as string,
  }))
}

async function getChannelVideoCount(channelId: string): Promise<number> {
  const url = `${BASE}/channels?id=${channelId}&part=statistics&key=${YOUTUBE_API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  return parseInt(data.items?.[0]?.statistics?.videoCount ?? '0')
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await prisma.drama.findMany({
    where: { youtubeChannelId: { not: null } },
    select: { youtubeChannelId: true },
  })
  const existingIds = new Set(existing.map(d => d.youtubeChannelId!))

  // 搜索所有关键词，去重
  const candidates = new Map<string, { channelId: string; title: string; description: string; thumbnailUrl: string }>()
  for (const query of SEARCH_QUERIES) {
    const results = await searchChannels(query)
    for (const r of results) {
      if (!existingIds.has(r.channelId) && !candidates.has(r.channelId)) {
        candidates.set(r.channelId, r)
      }
    }
    await new Promise(r => setTimeout(r, 200))
  }

  const added: string[] = []
  const skipped: string[] = []

  for (const c of candidates.values()) {
    const videoCount = await getChannelVideoCount(c.channelId)
    if (videoCount < 5) {
      skipped.push(`${c.title} (${videoCount}视频)`)
      continue
    }

    const category = guessCategory(c.title, c.description)
    await prisma.drama.create({
      data: {
        title: c.title,
        description: c.description ? c.description.slice(0, 1000) : null,
        coverUrl: c.thumbnailUrl || null,
        category,
        youtubeChannelId: c.channelId,
        status: 'ongoing',
      },
    })
    added.push(`${c.title} [${category}]`)
    await new Promise(r => setTimeout(r, 100))
  }

  return NextResponse.json({
    ok: true,
    existingChannels: existingIds.size,
    candidates: candidates.size,
    added: added.length,
    addedList: added,
    skipped: skipped.length,
    skippedList: skipped,
  })
}
