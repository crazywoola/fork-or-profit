import { useEffect, useState } from 'react'
import { PixelIcon } from './PixelIcon'
import { getStatLabel } from '../i18n/content'
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
    if (!gameState.roundSummary) return
    setChanges([{ key: 'cash', delta: gameState.roundSummary.netIncome }])
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
  }, [gameState.roundSummary?.round])

  if (!visible || changes.length === 0) return null

  return (
    <div className="stats-popup">
      {changes.map((c, i) => (
        <div key={i} className={`stat-change ${c.delta >= 0 ? 'positive' : 'negative'}`}>
          <PixelIcon name={c.key} size={14} />
          <span>{getStatLabel(c.key, 'upper')}</span>
          <span className="stat-delta">{c.delta >= 0 ? '+' : ''}{c.delta}</span>
        </div>
      ))}
    </div>
  )
}
