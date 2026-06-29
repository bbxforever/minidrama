import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

const BASE = 'https://www.minidramawatch.com'
const CATEGORIES = ['romance', 'historical', 'modern', 'suspense']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dramas = await prisma.drama.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ...CATEGORIES.map(c => ({
      url: `${BASE}/category/${c}`,
      lastModified: new Date(),
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
