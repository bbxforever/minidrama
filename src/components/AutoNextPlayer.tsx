'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  youtubeId: string
  nextId: number | null
  episodeNum: number
  totalEpisodes: number
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function AutoNextPlayer({ youtubeId, nextId, episodeNum, totalEpisodes }: Props) {
  const router = useRouter()
  const playerRef = useRef<HTMLDivElement>(null)
  const playerInstanceRef = useRef<any>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cancelledRef = useRef(false)

  const startCountdown = useCallback(() => {
    if (!nextId) return
    cancelledRef.current = false
    setCountdown(5)
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || cancelledRef.current) {
          clearInterval(countdownRef.current!)
          return null
        }
        if (prev <= 1) {
          clearInterval(countdownRef.current!)
          router.push(`/play/${nextId}`)
          return null
        }
        return prev - 1
      })
    }, 1000)
  }, [nextId, router])

  const cancelCountdown = () => {
    cancelledRef.current = true
    if (countdownRef.current) clearInterval(countdownRef.current)
    setCountdown(null)
  }

  useEffect(() => {
    cancelledRef.current = false

    const initPlayer = () => {
      if (!playerRef.current) return
      playerInstanceRef.current = new window.YT.Player(playerRef.current, {
        videoId: youtubeId,
        playerVars: { autoplay: 1, rel: 0, modestbranding: 1 },
        events: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) startCountdown()
            if (e.data === window.YT.PlayerState.PLAYING) cancelCountdown()
          },
        },
      })
    }

    if (window.YT?.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
      if (!document.getElementById('yt-iframe-api')) {
        const tag = document.createElement('script')
        tag.id = 'yt-iframe-api'
        tag.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(tag)
      }
    }

    return () => {
      cancelledRef.current = true
      if (countdownRef.current) clearInterval(countdownRef.current)
      playerInstanceRef.current?.destroy()
    }
  }, [youtubeId, startCountdown])

  return (
    <div className="relative w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-lg mb-4">
      <div ref={playerRef} className="absolute inset-0 w-full h-full" />

      {/* 自动播下一集倒计时遮罩 */}
      {countdown !== null && nextId && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4 z-10">
          <p className="text-white text-lg font-medium">即将播放第 {episodeNum + 1} 集</p>
          <div className="w-16 h-16 rounded-full border-4 border-rose-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{countdown}</span>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => router.push(`/play/${nextId}`)}
              className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-sm font-medium transition-colors">
              立即播放
            </button>
            <button
              onClick={cancelCountdown}
              className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-sm font-medium transition-colors">
              取消
            </button>
          </div>
        </div>
      )}

      {/* 最后一集提示 */}
      {countdown === null && !nextId && episodeNum === totalEpisodes && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <span className="bg-black/60 text-white text-sm px-4 py-1.5 rounded-full">
            🎉 本剧完结
          </span>
        </div>
      )}
    </div>
  )
}
