'use client'
import { useEffect, useRef } from 'react'

export default function AdTopBanner() {
  const ref = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current || !ref.current) return
    loaded.current = true

    const cfg = document.createElement('script')
    cfg.text = `
      window.atOptions = {
        'key' : '5d3c8a346617fc0ded23ec443ad3970f',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `
    ref.current.appendChild(cfg)

    const invoke = document.createElement('script')
    invoke.src = 'https://www.highperformanceformat.com/5d3c8a346617fc0ded23ec443ad3970f/invoke.js'
    invoke.async = true
    ref.current.appendChild(invoke)
  }, [])

  return (
    <div className="flex justify-center py-2 bg-white border-b border-gray-100 min-h-[94px]">
      <div ref={ref} style={{ width: 728, height: 90 }} />
    </div>
  )
}
