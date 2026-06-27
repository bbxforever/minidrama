'use client'
import Link from 'next/link'
import { Search, Tv } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [q, setQ] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-rose-500 shrink-0">
          <Tv size={22} />
          MiniDrama
        </Link>

        <div className="hidden md:flex gap-5 text-sm text-gray-400">
          {[['/', '首页'], ['/category/romance', '爱情'], ['/category/historical', '古装'], ['/category/modern', '都市']].map(([href, label]) => (
            <Link key={href} href={href} className="hover:text-white transition-colors">{label}</Link>
          ))}
        </div>

        <form onSubmit={handleSearch} className="ml-auto flex items-center bg-gray-800 rounded-lg overflow-hidden">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="搜索短剧 / Search dramas..."
            className="bg-transparent px-3 py-1.5 text-sm outline-none w-48 md:w-64 placeholder-gray-500"
          />
          <button type="submit" className="px-3 py-1.5 text-gray-400 hover:text-white">
            <Search size={16} />
          </button>
        </form>
      </div>
    </nav>
  )
}
