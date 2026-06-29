const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!
const BASE = 'https://www.googleapis.com/youtube/v3'

export async function fetchChannelVideos(channelId: string, maxResults = 50) {
  const res = await fetch(
    `${BASE}/search?channelId=${channelId}&type=video&maxResults=${maxResults}&order=date&key=${YOUTUBE_API_KEY}&part=snippet`
  )
  const data = await res.json()
  return data.items ?? []
}

export async function fetchChannelInfo(channelId: string) {
  const res = await fetch(
    `${BASE}/channels?id=${channelId}&part=snippet&key=${YOUTUBE_API_KEY}`
  )
  const data = await res.json()
  const item = data.items?.[0]
  if (!item) return null
  return {
    description: item.snippet.description as string,
    thumbnailUrl: (item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url) as string | undefined,
  }
}

export async function fetchVideoDetails(videoIds: string[]) {
  const ids = videoIds.join(',')
  const res = await fetch(
    `${BASE}/videos?id=${ids}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
  )
  const data = await res.json()
  return data.items ?? []
}

export function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const h = parseInt(match[1] ?? '0')
  const m = parseInt(match[2] ?? '0')
  const s = parseInt(match[3] ?? '0')
  return h * 3600 + m * 60 + s
}
