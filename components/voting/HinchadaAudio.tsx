'use client'

import { useEffect, useRef } from 'react'

interface HinchadaAudioProps {
  leaderSlug: string
}

const HINCHADA_SOUNDS: Record<string, string> = {
  boca: '/sounds/hinchada-boca.mp3',
  river: '/sounds/hinchada-river.mp3',
}

export default function HinchadaAudio({ leaderSlug }: HinchadaAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const played = useRef(false)

  useEffect(() => {
    const src = HINCHADA_SOUNDS[leaderSlug]
    if (!src) return

    const audio = new Audio(src)
    audio.volume = 0.4
    audio.loop = false
    audioRef.current = audio

    // Browsers block autoplay — we hook into first user interaction
    function tryPlay() {
      if (played.current) return
      played.current = true
      audio.play().catch(() => {
        // blocked silently — no crash
      })
      window.removeEventListener('click', tryPlay)
      window.removeEventListener('touchstart', tryPlay)
    }

    window.addEventListener('click', tryPlay, { once: true })
    window.addEventListener('touchstart', tryPlay, { once: true })

    return () => {
      window.removeEventListener('click', tryPlay)
      window.removeEventListener('touchstart', tryPlay)
      audio.pause()
    }
  }, [leaderSlug])

  return null
}
