'use client'
import Link from 'next/link'
import { Search, Tv, X } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORY_ZH: Record<string, string> = {
  romance: '爱情', historical: '古装', modern: '都市', suspense: '悬疑',
}

interface Suggestion { id: number; title: string; category: string }

export default function Navbar() {
  const [q, setQ] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchSuggestions = useCallback(async (val: string) => {
    if (val.length < 1) { setSuggestions([]); return }
    const res = await fetch(`/api/suggest?q=${encodeURIComponent(val)}`)
    const data = await res.json()
    setSuggestions(data)
    setOpen(true)
    setActiveIdx(-1)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQ(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!val.trim()) { setSuggestions([]); setOpen(false); return }
    debounceRef.current = setTimeout(() => fetchSuggestions(val.trim()), 200)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const term = activeIdx >= 0 ? suggestions[activeIdx]?.title : q
    if (term?.trim()) {
      setOpen(false)
      router.push(`/search?q=${encodeURIComponent(term.trim())}`)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || !suggestions.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)) }
    if (e.key === 'Escape') { setOpen(false); setActiveIdx(-1) }
  }

  function selectSuggestion(s: Suggestion) {
    setQ(s.title)
    setOpen(false)
    router.push(`/drama/${s.id}`)
  }

  // 点击外部关闭
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

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

        {/* 搜索框 + 下拉 */}
        <div ref={wrapperRef} className="ml-auto relative">
          <form onSubmit={handleSubmit}
            className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-full overflow-hidden transition-colors">
            <input
              ref={inputRef}
              value={q}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length && setOpen(true)}
              placeholder="搜索短剧..."
              className="bg-transparent px-4 py-2 text-sm outline-none w-44 md:w-56 placeholder-gray-400 text-gray-700"
            />
            {q && (
              <button type="button" onClick={() => { setQ(''); setSuggestions([]); setOpen(false); inputRef.current?.focus() }}
                className="px-2 text-gray-300 hover:text-gray-500 transition-colors">
                <X size={14} />
              </button>
            )}
            <button type="submit" className="px-3 py-2 text-gray-400 hover:text-rose-500 transition-colors">
              <Search size={16} />
            </button>
          </form>

          {/* 建议下拉 */}
          {open && suggestions.length > 0 && (
            <div className="absolute top-full mt-1.5 right-0 w-72 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
              {suggestions.map((s, i) => (
                <button key={s.id} onMouseDown={() => selectSuggestion(s)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                    ${i === activeIdx ? 'bg-rose-50' : 'hover:bg-gray-50'}`}>
                  <Search size={13} className="text-gray-300 shrink-0" />
                  <span className="flex-1 text-sm text-gray-700 truncate">{s.title}</span>
                  <span className="text-xs text-gray-400 shrink-0">{CATEGORY_ZH[s.category] ?? s.category}</span>
                </button>
              ))}
              <div className="px-4 py-2 border-t border-gray-50">
                <button onMouseDown={handleSubmit}
                  className="text-xs text-rose-500 hover:text-rose-600 transition-colors">
                  搜索「{q}」全部结果 →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
