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
  fireSides: (colors?: string[]) => void
}

const Confetti = forwardRef<ConfettiRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useImperativeHandle(ref, () => ({
    fire: (options?: confetti.Options) => {
      if (!canvasRef.current) return
      const shoot = confetti.create(canvasRef.current, { resize: true, useWorker: false })
      const colors = (options?.colors as string[]) ?? ['#FFD700', '#003f8a', '#e6b800']
      const base = { spread: 100, startVelocity: 60, ticks: 200, colors, ...options }

      // Tres ráfagas seguidas para que se vea exagerado
      shoot({ ...base, particleCount: 220, origin: { x: 0.5, y: 0 } })
      setTimeout(() => shoot({ ...base, particleCount: 180, origin: { x: 0.3, y: 0.1 } }), 200)
      setTimeout(() => shoot({ ...base, particleCount: 180, origin: { x: 0.7, y: 0.1 } }), 400)
    },
    fireSides: (colors?: string[]) => {
      if (!canvasRef.current) return
      const shoot = confetti.create(canvasRef.current, { resize: true, useWorker: false })
      const resolvedColors = colors ?? ['#FFD700', '#003f8a', '#e6b800']
      const base = { spread: 70, startVelocity: 65, ticks: 300, colors: resolvedColors }

      // Ráfagas desde los costados durante ~3 segundos
      const bursts = [
        [0,   { angle: 60,  origin: { x: 0,   y: 0.65 } }],
        [150, { angle: 120, origin: { x: 1,   y: 0.65 } }],
        [600, { angle: 70,  origin: { x: 0,   y: 0.5  } }],
        [750, { angle: 110, origin: { x: 1,   y: 0.5  } }],
        [1200,{ angle: 60,  origin: { x: 0.1, y: 0.4  } }],
        [1350,{ angle: 120, origin: { x: 0.9, y: 0.4  } }],
        [1900,{ angle: 75,  origin: { x: 0,   y: 0.6  } }],
        [2050,{ angle: 105, origin: { x: 1,   y: 0.6  } }],
        [2600,{ angle: 65,  origin: { x: 0.1, y: 0.55 } }],
        [2750,{ angle: 115, origin: { x: 0.9, y: 0.55 } }],
      ] as const

      for (const [delay, extra] of bursts) {
        setTimeout(() => shoot({ ...base, particleCount: 120, ...extra }), delay)
      }
    },
  }))

  return <canvas ref={canvasRef} className="confetti-canvas" />
})

Confetti.displayName = 'Confetti'
export { Confetti }
