'use client'
import { useEffect, useRef } from 'react'

export default function AdSquare() {
  const ref = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current || !ref.current) return
    loaded.current = true

    const cfg = document.createElement('script')
    cfg.text = `
      window.atOptions = {
        'key' : '4ebdcc6f81d0ef89d61d7d8de7dcd7bf',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `
    ref.current.appendChild(cfg)

    const invoke = document.createElement('script')
    invoke.src = 'https://www.highperformanceformat.com/4ebdcc6f81d0ef89d61d7d8de7dcd7bf/invoke.js'
    invoke.async = true
    ref.current.appendChild(invoke)
  }, [])

  return (
    <div className="flex justify-center my-4 min-h-[250px]">
      <div ref={ref} style={{ width: 300, height: 250 }} />
    </div>
  )
}
