'use client'
import { useEffect, useRef } from 'react'

export default function AdBanner() {
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    const script = document.createElement('script')
    script.src = 'https://pl30120826.effectivecpmnetwork.com/207cd4dc6e04ccb522c748a87172ab88/invoke.js'
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    document.getElementById('container-207cd4dc6e04ccb522c748a87172ab88')?.after(script)
  }, [])

  return <div id="container-207cd4dc6e04ccb522c748a87172ab88" className="w-full my-4" />
}
