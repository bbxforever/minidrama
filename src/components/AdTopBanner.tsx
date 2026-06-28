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
      var atOptions_728 = {
        'key' : 'db67c1edb195de8072675d5bd85f1332',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
      window.atOptions = atOptions_728;
    `
    ref.current.appendChild(cfg)

    const invoke = document.createElement('script')
    invoke.src = 'https://www.highperformanceformat.com/db67c1edb195de8072675d5bd85f1332/invoke.js'
    invoke.async = true
    ref.current.appendChild(invoke)
  }, [])

  return (
    <div className="flex justify-center py-2 bg-white border-b border-gray-100 min-h-[94px]">
      <div ref={ref} style={{ width: 728, height: 90 }} />
    </div>
  )
}
