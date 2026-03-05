import { useEffect, useRef, useState } from 'react'
import { PALETTE } from '../pixel/palette'

type Props = { onStart: () => void }

export function TitleScreen({ onStart }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [blinkOn, setBlinkOn] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setBlinkOn(v => !v), 600)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onStart()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onStart])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = false

    const W = 320
    const H = 200
    canvas.width = W
    canvas.height = H

    interface Star { x: number; y: number; speed: number; bright: number }
    const stars: Star[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: 0.2 + Math.random() * 0.8,
      bright: Math.random(),
    }))

    interface CodeDrop { x: number; y: number; speed: number; char: string; life: number }
    const drops: CodeDrop[] = []
    const codeChars = '{}[]();=>const let var if else return function async await import export'.split('')

    let frame = 0
    let animId = 0

    function render() {
      frame++
      ctx.fillStyle = PALETTE.bg
      ctx.fillRect(0, 0, W, H)

      for (const s of stars) {
        s.y += s.speed
        if (s.y > H) { s.y = 0; s.x = Math.random() * W }
        const tw = Math.sin(frame * 0.03 + s.bright * 10) * 0.3 + 0.7
        ctx.globalAlpha = tw * 0.6
        ctx.fillStyle = s.bright > 0.7 ? '#fee761' : s.bright > 0.4 ? '#94b0c2' : '#566c86'
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1)
      }
      ctx.globalAlpha = 1

      if (frame % 8 === 0 && drops.length < 30) {
        drops.push({
          x: Math.floor(Math.random() * (W / 6)) * 6,
          y: -8,
          speed: 0.5 + Math.random() * 1,
          char: codeChars[Math.floor(Math.random() * codeChars.length)],
          life: 60 + Math.random() * 120,
        })
      }

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]
        d.y += d.speed
        d.life--
        if (d.life <= 0 || d.y > H) { drops.splice(i, 1); continue }
        ctx.globalAlpha = Math.min(d.life / 30, 0.25)
        ctx.fillStyle = '#73c64a'
        ctx.font = '6px monospace'
        ctx.fillText(d.char, d.x, Math.floor(d.y))
      }
      ctx.globalAlpha = 1

      // server racks at bottom
      for (let i = 0; i < 12; i++) {
        const sx = 20 + i * 24
        const sy = H - 35
        ctx.fillStyle = '#262b44'
        ctx.fillRect(sx, sy, 16, 30)
        ctx.fillStyle = '#333c57'
        ctx.fillRect(sx + 1, sy + 1, 14, 28)

        for (let r = 0; r < 5; r++) {
          ctx.fillStyle = '#1a1c2c'
          ctx.fillRect(sx + 2, sy + 3 + r * 5, 12, 3)
          const ledColor = (frame + i * 7 + r * 13) % 30 < 15 ? '#73c64a' : '#333c57'
          ctx.fillStyle = ledColor
          ctx.fillRect(sx + 12, sy + 3 + r * 5, 2, 2)
        }
      }

      animId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className="screen title-screen" onClick={onStart}>
      <canvas ref={canvasRef} className="title-bg-canvas" />
      <div className="title-content">
        <h1 className="title-logo">
          <span className="title-fork">FORK</span>
          <span className="title-or">or</span>
          <span className="title-profit">PROFIT</span>
        </h1>
        <p className="title-subtitle">An Open Source Strategy RPG</p>
        <p className={`title-press-start ${blinkOn ? '' : 'hidden'}`}>
          ▶ PRESS START
        </p>
        <p className="title-version">v0.1.0 · PIXEL EDITION</p>
        <a
          className="title-github-link"
          href="https://github.com/crazywoola/fork-or-profit"
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
        >
          GitHub
        </a>
      </div>
    </div>
  )
}
