import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MiniDrama - Free Chinese Short Dramas Online | 免费短剧在线看',
  description: 'Watch free Chinese short dramas online. Best collection of romance, historical, and modern dramas. 免费在线观看中文短剧，霸总、古装、都市爱情短剧大全。',
  keywords: 'short drama, Chinese drama, 短剧, 免费短剧, mini drama, online drama',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className={`${geist.className} bg-gray-950 text-white min-h-screen`}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-800 mt-12">
          <p>© 2025 MiniDrama · Free Short Dramas Online</p>
          <div className="flex justify-center gap-6 mt-2">
            <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
            <a href="/about" className="hover:text-gray-300">About Us</a>
          </div>
        </footer>
      </body>
    </html>
  )
}
