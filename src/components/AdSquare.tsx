'use client'
import { useEffect } from 'react'

export default function AdSquare() {
  useEffect(() => {
    (window as unknown as Record<string, unknown>).atOptions = {
      key: '4bd72f571a17b6bf2d2308e2093cbf38',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {},
    }
    const script = document.createElement('script')
    script.src = 'https://www.highperformanceformat.com/4bd72f571a17b6bf2d2308e2093cbf38/invoke.js'
    document.getElementById('ad-square')?.appendChild(script)
  }, [])

  return (
    <div className="flex justify-center my-4">
      <div id="ad-square" style={{ width: 300, height: 250 }} />
    </div>
  )
}
