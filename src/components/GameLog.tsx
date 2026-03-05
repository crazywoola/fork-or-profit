import { useEffect, useRef, useState } from 'react'
import { PixelIcon } from './PixelIcon'
import { PALETTE } from '../pixel/palette'
import type { LogEntry, LogType } from '../engine/types'

type Props = {
  history: LogEntry[]
}

const TABS: { id: LogType | 'all'; label: string }[] = [
  { id: 'all', label: 'ALL' },
  { id: 'event', label: 'EVT' },
  { id: 'action', label: 'ACT' },
  { id: 'decision', label: 'DEC' },
]

const LOG_ICON_NAMES: Record<LogType, string> = {
  event: 'log-event',
  action: 'log-action',
  decision: 'log-decision',
  system: 'log-system',
}

const LOG_COLORS: Record<LogType, string> = {
  event: PALETTE.accentGold,
  action: PALETTE.engBlue,
  decision: PALETTE.growthPink,
  system: PALETTE.textDim,
}

export function GameLog({ history }: Props) {
  const [activeTab, setActiveTab] = useState<LogType | 'all'>('all')
  const scrollRef = useRef<HTMLDivElement>(null)

  const filtered = activeTab === 'all'
    ? history
    : history.filter(e => e.type === activeTab)

  const displayed = filtered.slice(-40).reverse()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [history.length, activeTab])

  return (
    <div className="game-log">
      <div className="log-scroll" ref={scrollRef}>
        {displayed.length === 0 && (
          <div className="log-empty">No entries yet.</div>
        )}
        {displayed.map((entry, i) => (
          <div key={history.length - i} className="log-entry-row">
            <PixelIcon name={LOG_ICON_NAMES[entry.type]} size={10} color={LOG_COLORS[entry.type]} />
            <span className="log-round" style={{ color: LOG_COLORS[entry.type] }}>R{entry.round}</span>
            <span className="log-msg">{entry.message}</span>
          </div>
        ))}
      </div>
      <div className="log-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`log-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
