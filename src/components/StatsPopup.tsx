import { useEffect, useState } from 'react'
import { PixelIcon } from './PixelIcon'
import type { GameState } from '../engine/types'

type Props = {
  gameState: GameState
}

type StatChange = {
  key: string
  delta: number
}

export function StatsPopup({ gameState }: Props) {
  const [changes, setChanges] = useState<StatChange[]>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const last = gameState.history[gameState.history.length - 1]
    if (!last || last.type !== 'system') return

    const match = last.message.match(/Net Income: (-?\d+)/)
    if (match) {
      const income = parseInt(match[1])
      setChanges([{ key: 'cash', delta: income }])
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2000)
      return () => clearTimeout(t)
    }
  }, [gameState.round])

  if (!visible || changes.length === 0) return null

  return (
    <div className="stats-popup">
      {changes.map((c, i) => (
        <div key={i} className={`stat-change ${c.delta >= 0 ? 'positive' : 'negative'}`}>
          <PixelIcon name={c.key} size={14} />
          <span>{c.key.toUpperCase()}</span>
          <span className="stat-delta">{c.delta >= 0 ? '+' : ''}{c.delta}</span>
        </div>
      ))}
    </div>
  )
}
