/**
 * 自动搜索 YouTube 短剧频道并添加到数据库
 * 运行：npx tsx scripts/find-channels.ts
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { config } from 'dotenv'
config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!
const BASE = 'https://www.googleapis.com/youtube/v3'

// 搜索关键词 — 覆盖各类短剧
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

// 频道分类规则（按标题/描述关键词判断）
function guessCategory(title: string, desc: string): string {
  const text = (title + desc).toLowerCase()
  if (/古装|宫廷|穿越|历史|古代|仙侠/.test(text)) return 'historical'
  if (/悬疑|惊悚|推理|犯罪|恐怖/.test(text)) return 'suspense'
  if (/都市|职场|现代|总裁|霸总|商战/.test(text)) return 'modern'
  return 'romance' // 默认爱情
}

// 搜索频道
async function searchChannels(query: string): Promise<{ channelId: string; title: string; description: string; thumbnailUrl: string }[]> {
  const url = `${BASE}/search?q=${encodeURIComponent(query)}&type=channel&maxResults=10&part=snippet&key=${YOUTUBE_API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  if (!data.items) return []

  return data.items.map((item: any) => ({
    channelId: item.snippet.channelId,
    title: item.snippet.title,
    description: item.snippet.description ?? '',
    thumbnailUrl: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url ?? '',
  }))
}

// 获取频道视频数量（过滤掉内容太少的）
async function getChannelVideoCount(channelId: string): Promise<number> {
  const url = `${BASE}/channels?id=${channelId}&part=statistics&key=${YOUTUBE_API_KEY}`
  const res = await fetch(url)
  const data = await res.json()
  return parseInt(data.items?.[0]?.statistics?.videoCount ?? '0')
}

async function main() {
  if (!YOUTUBE_API_KEY) {
    console.error('❌ 缺少 YOUTUBE_API_KEY 环境变量')
    process.exit(1)
  }

  // 加载已有频道 ID，避免重复
  const existing = await prisma.drama.findMany({
    where: { youtubeChannelId: { not: null } },
    select: { youtubeChannelId: true, title: true },
  })
  const existingIds = new Set(existing.map(d => d.youtubeChannelId!))
  console.log(`📋 已有 ${existingIds.size} 个频道\n`)

  const candidates = new Map<string, { channelId: string; title: string; description: string; thumbnailUrl: string }>()

  // 搜索所有关键词
  for (const query of SEARCH_QUERIES) {
    console.log(`🔍 搜索: ${query}`)
    const results = await searchChannels(query)
    for (const r of results) {
      if (!existingIds.has(r.channelId) && !candidates.has(r.channelId)) {
        candidates.set(r.channelId, r)
      }
    }
    // 避免 API 限速
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n🎯 找到 ${candidates.size} 个新候选频道，正在过滤...\n`)

  let added = 0
  for (const c of candidates.values()) {
    // 获取视频数量，少于 5 个的跳过
    const videoCount = await getChannelVideoCount(c.channelId)
    if (videoCount < 5) {
      console.log(`  ⏭  跳过 ${c.title}（仅 ${videoCount} 个视频）`)
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

    console.log(`  ✅ 添加: ${c.title} [${category}] (${videoCount} 视频)`)
    added++

    await new Promise(r => setTimeout(r, 200))
  }

  console.log(`\n🎉 完成！新增 ${added} 个频道，数据库共 ${existingIds.size + added} 个频道`)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
