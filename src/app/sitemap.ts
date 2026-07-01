import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

const BASE = 'https://www.minidramawatch.com'
const CATEGORIES = ['romance', 'historical', 'modern', 'suspense']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dramas = await prisma.drama.findMany({
    select: { id: true, updatedAt: true, category: true },
    orderBy: { updatedAt: 'desc' },
  })

  // 用真实的最近更新时间，而不是每次请求都写"此刻"——
  // 否则 Google 会看到所有页面永远"刚刚改过"，反而不再信任 lastmod
  const latestUpdate = dramas[0]?.updatedAt ?? new Date()
  const latestByCategory = new Map<string, Date>()
  for (const d of dramas) {
    if (!latestByCategory.has(d.category)) latestByCategory.set(d.category, d.updatedAt)
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: latestUpdate, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date('2026-06-27'), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: new Date('2026-06-27'), changeFrequency: 'monthly', priority: 0.3 },
    ...CATEGORIES.map(c => ({
      url: `${BASE}/category/${c}`,
      lastModified: latestByCategory.get(c) ?? latestUpdate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ]

  const dramaRoutes: MetadataRoute.Sitemap = dramas.map(d => ({
    url: `${BASE}/drama/${d.id}`,
    lastModified: d.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...dramaRoutes]
}
