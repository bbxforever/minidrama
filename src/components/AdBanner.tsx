'use client'
import { useEffect } from 'react'

export default function AdBanner() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://pl30104190.effectivecpmnetwork.com/f0d8396b4d758460fde9998e9386b47a/invoke.js'
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    document.getElementById('container-f0d8396b4d758460fde9998e9386b47a')?.after(script)
  }, [])

  return <div id="container-f0d8396b4d758460fde9998e9386b47a" className="w-full my-4" />
}
