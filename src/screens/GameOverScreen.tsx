import { useEffect, useRef, useState } from 'react'
import { PALETTE } from '../pixel/palette'
import { PixelStatBar } from '../components/PixelStatBar'
import { PixelIcon } from '../components/PixelIcon'
import type { GameState } from '../engine/types'

type Props = {
  result: 'win' | 'lose'
  gameState: GameState | null
  onRestart: () => void
  onNewGame: () => void
}

function Firework({ canvas }: { canvas: HTMLCanvasElement }) {
  useEffect(() => {
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = false
    const W = 320
    const H = 200
    canvas.width = W
    canvas.height = H

    type Particle = { x: number; y: number; vx: number; vy: number; color: string; life: number }
    const particles: Particle[] = []
    const colors = ['#fee761', '#f4b41b', '#73c64a', '#597dce', '#d77bba', '#d04648', '#6dc2ca']

    let frame = 0
    let animId = 0

    function render() {
      frame++
      ctx.fillStyle = PALETTE.bg
      ctx.globalAlpha = 0.15
      ctx.fillRect(0, 0, W, H)
      ctx.globalAlpha = 1

      if (frame % 30 === 0) {
        const cx = 40 + Math.random() * (W - 80)
        const cy = 30 + Math.random() * 80
        for (let i = 0; i < 20; i++) {
          const angle = (Math.PI * 2 * i) / 20
          const speed = 1 + Math.random() * 2
          particles.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 40 + Math.random() * 30,
          })
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.04
        p.life--
        if (p.life <= 0) { particles.splice(i, 1); continue }
        ctx.globalAlpha = Math.min(p.life / 20, 1)
        ctx.fillStyle = p.color
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2)
      }
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(render)
    }

    ctx.fillStyle = PALETTE.bg
    ctx.fillRect(0, 0, W, H)
    render()
    return () => cancelAnimationFrame(animId)
  }, [canvas])

  return null
}

export function GameOverScreen({ result, gameState, onRestart, onNewGame }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setBlink(v => !v), 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onRestart()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onRestart])

  const isWin = result === 'win'
  const stats = gameState?.stats

  return (
    <div className={`screen gameover-screen ${isWin ? 'win' : 'lose'}`}>
      {isWin && canvasRef.current && <Firework canvas={canvasRef.current} />}
      <canvas ref={canvasRef} className="gameover-bg-canvas" style={{ display: isWin ? 'block' : 'none' }} />

      <div className="gameover-content">
        <h1 className={`gameover-title ${isWin ? 'win' : 'lose'}`}>
          {isWin ? (
            <>
              <PixelIcon name="star" size={28} color={PALETTE.highlight} /> VICTORY! <PixelIcon name="star" size={28} color={PALETTE.highlight} />
            </>
          ) : 'GAME OVER'}
        </h1>

        {!isWin && (
          <p className="gameover-reason">
            {stats && stats.cash <= 0 ? 'Your company ran out of cash.' :
             stats && stats.community <= 0 ? 'Your open source community collapsed.' :
             'The company could not survive.'}
          </p>
        )}

        {stats && (
          <div className="gameover-stats">
            <h3>FINAL STATUS</h3>
            <div className="gameover-stats-grid">
              <PixelStatBar label="CASH" value={stats.cash} max={50} color={PALETTE.cashGold} icon="cash" />
              <PixelStatBar label="REVENUE" value={stats.revenue} max={50} color={PALETTE.orange} icon="revenue" />
              <PixelStatBar label="COMMUNITY" value={stats.community} max={50} color={PALETTE.communityTeal} icon="community" />
              <PixelStatBar label="GROWTH" value={stats.growth} max={50} color={PALETTE.growthPink} icon="growth" />
              <PixelStatBar label="REPUTATION" value={stats.reputation} max={50} color={PALETTE.accentGold} icon="reputation" />
            </div>
            <p className="gameover-rounds">Survived {gameState.round} rounds</p>
          </div>
        )}

        <div className="gameover-actions">
          <button className="pixel-btn" onClick={onNewGame}>
            <PixelIcon name="dice" size={10} /> NEW GAME
          </button>
          <button className={`pixel-btn primary ${blink ? '' : 'dim'}`} onClick={onRestart}>
            <PixelIcon name="play" size={10} /> TITLE SCREEN
          </button>
        </div>
      </div>
    </div>
  )
}
