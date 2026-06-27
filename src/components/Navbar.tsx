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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-rose-500 shrink-0">
          <Tv size={22} />
          MiniDrama
        </Link>

        <div className="hidden md:flex gap-1 text-sm">
          {[['/', '首页'], ['/category/romance', '爱情'], ['/category/historical', '古装'], ['/category/modern', '都市']].map(([href, label]) => (
            <Link key={href} href={href}
              className="px-3 py-1.5 rounded-full text-gray-600 hover:text-rose-500 hover:bg-rose-50 transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <form onSubmit={handleSearch} className="ml-auto flex items-center bg-gray-100 hover:bg-gray-200 rounded-full overflow-hidden transition-colors">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="搜索短剧..."
            className="bg-transparent px-4 py-2 text-sm outline-none w-44 md:w-56 placeholder-gray-400 text-gray-700"
          />
          <button type="submit" className="px-3 py-2 text-gray-400 hover:text-rose-500 transition-colors">
            <Search size={16} />
          </button>
        </form>
      </div>
    </nav>
  )
}
