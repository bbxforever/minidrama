import type { Metadata } from 'next'
import { Noto_Sans_SC } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import AdTopBanner from '@/components/AdTopBanner'

const notoSansSC = Noto_Sans_SC({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata: Metadata = {
  title: { default: 'MiniDrama - 免费短剧在线看 | Free Chinese Short Dramas', template: '%s | MiniDrama' },
  description: '免费在线观看中文短剧，爱情、古装、都市、悬疑短剧大全。Watch free Chinese short dramas online — romance, historical, modern & suspense.',
  keywords: '短剧, 免费短剧, 短剧在线看, 爱情短剧, 古装短剧, 都市短剧, short drama, Chinese drama, mini drama, free drama',
  metadataBase: new URL('https://www.minidramawatch.com'),
  alternates: { canonical: 'https://www.minidramawatch.com' },
  openGraph: {
    siteName: 'MiniDrama',
    type: 'website',
    locale: 'zh_CN',
    url: 'https://www.minidramawatch.com',
    title: 'MiniDrama - 免费短剧在线看',
    description: '精选爱情·古装·都市·悬疑短剧，免费在线观看。',
  },
  twitter: { card: 'summary_large_image', title: 'MiniDrama - 免费短剧在线看' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className={`${notoSansSC.className} bg-gray-50 text-gray-900 min-h-screen`}>
        <Navbar />
        <AdTopBanner />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <Script
          src="https://pl30104189.effectivecpmnetwork.com/22/a4/63/22a4639fda7b02ba85d8e36e96d68f35.js"
          strategy="afterInteractive"
        />
        <footer className="text-center text-gray-400 text-sm py-8 border-t border-gray-200 mt-12 bg-white">
          <p className="font-medium text-gray-500">© 2025 MiniDrama · Free Short Dramas Online</p>
          <div className="flex justify-center gap-6 mt-2">
            <a href="/privacy" className="hover:text-rose-500 transition-colors">Privacy Policy</a>
            <a href="/about" className="hover:text-rose-500 transition-colors">About Us</a>
          </div>
        </footer>
      </body>
    </html>
  )
}
