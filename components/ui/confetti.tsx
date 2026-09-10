'use client'

import confetti from 'canvas-confetti'
import { forwardRef, useImperativeHandle, useRef } from 'react'

const TEAM_COLORS: Record<string, string[]> = {
  boca:  ['#003f8a', '#FFD700', '#002d6e', '#e6b800'],
  river: ['#ffffff', '#CC0000', '#ee1111', '#f0f0f0'],
}

export function getTeamColors(slug: string): string[] {
  return TEAM_COLORS[slug] ?? ['#FFD700', '#003f8a', '#1a3080']
}

export interface ConfettiRef {
  fire: (options?: confetti.Options) => void
  fireSides: () => void
}

const Confetti = forwardRef<ConfettiRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useImperativeHandle(ref, () => ({
    fire: (options?: confetti.Options) => {
      if (!canvasRef.current) return
      const shoot = confetti.create(canvasRef.current, { resize: true, useWorker: true })
      shoot({
        particleCount: 140,
        spread: 90,
        startVelocity: 55,
        colors: ['#FFD700', '#003f8a', '#e6b800'],
        origin: { x: 0.5, y: 0 },
        ...options,
      })
    },
    fireSides: () => {
      if (!canvasRef.current) return
      const shoot = confetti.create(canvasRef.current, { resize: true, useWorker: true })
      const colors = ['#FFD700', '#003f8a', '#e6b800']

      shoot({ particleCount: 80, angle: 60, spread: 55, startVelocity: 60, colors, origin: { x: 0, y: 0.6 } })
      setTimeout(() => {
        shoot({ particleCount: 80, angle: 120, spread: 55, startVelocity: 60, colors, origin: { x: 1, y: 0.6 } })
      }, 150)
    },
  }))

  return <canvas ref={canvasRef} className="confetti-canvas" />
})

Confetti.displayName = 'Confetti'
export { Confetti }
