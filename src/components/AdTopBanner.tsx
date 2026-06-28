'use client'
import { useEffect } from 'react'

export default function AdTopBanner() {
  useEffect(() => {
    (window as unknown as Record<string, unknown>).atOptions = {
      key: 'db67c1edb195de8072675d5bd85f1332',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {},
    }
    const script = document.createElement('script')
    script.src = 'https://www.highperformanceformat.com/db67c1edb195de8072675d5bd85f1332/invoke.js'
    document.getElementById('ad-top-banner')?.appendChild(script)
  }, [])

  return (
    <div className="flex justify-center py-2 bg-white border-b border-gray-100">
      <div id="ad-top-banner" style={{ width: 728, height: 90 }} />
    </div>
  )
}
