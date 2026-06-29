import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/play/'] },
    sitemap: 'https://www.minidramawatch.com/sitemap.xml',
  }
}
