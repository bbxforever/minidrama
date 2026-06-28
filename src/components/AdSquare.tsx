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
        'key' : '4bd72f571a17b6bf2d2308e2093cbf38',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `
    ref.current.appendChild(cfg)

    const invoke = document.createElement('script')
    invoke.src = 'https://www.highperformanceformat.com/4bd72f571a17b6bf2d2308e2093cbf38/invoke.js'
    invoke.async = true
    ref.current.appendChild(invoke)
  }, [])

  return (
    <div className="flex justify-center my-4 min-h-[250px]">
      <div ref={ref} style={{ width: 300, height: 250 }} />
    </div>
  )
}
