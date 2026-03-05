import { useState, useEffect } from 'react'
import { TypeWriter } from './TypeWriter'
import { EventCategoryIcon, PixelIcon } from './PixelIcon'
import { CATEGORY_COLORS, PALETTE } from '../pixel/palette'
import type { GameEvent } from '../engine/types'

type Props = {
  event: GameEvent
  onResolve: (optionIndex: number) => void
}

export function RPGDialog({ event, onResolve }: Props) {
  const [textDone, setTextDone] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)

  useEffect(() => {
    setTextDone(false)
    setSelectedIdx(0)
  }, [event.id])

  useEffect(() => {
    if (!textDone) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIdx(i => (i - 1 + event.options.length) % event.options.length)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIdx(i => (i + 1) % event.options.length)
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onResolve(selectedIdx)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [textDone, selectedIdx, event.options.length, onResolve])

  const catColor = CATEGORY_COLORS[event.category] ?? PALETTE.textDim

  const effectStr = (effect: Record<string, number>) => {
    return Object.entries(effect)
      .map(([k, v]) => `${k}: ${v > 0 ? '+' : ''}${v}`)
      .join(', ')
  }

  return (
    <div className="rpg-dialog-overlay">
      <div className="rpg-dialog">
        <div className="rpg-dialog-portrait">
          <div className="portrait-frame" style={{ borderColor: catColor }}>
            <div className="portrait-inner" style={{ backgroundColor: catColor }}>
              <EventCategoryIcon category={event.category} size={32} />
            </div>
          </div>
          <span className="portrait-label" style={{ color: catColor }}>{event.category}</span>
        </div>

        <div className="rpg-dialog-body">
          <div className="rpg-dialog-title">
            <span className="event-tag" style={{ backgroundColor: catColor }}>
              <EventCategoryIcon category={event.category} size={10} />
              {event.category}
            </span>
            <h3>{event.title}</h3>
          </div>

          <div className="rpg-dialog-text">
            <TypeWriter text={event.description} speed={25} onComplete={() => setTextDone(true)} />
          </div>

          {textDone && (
            <div className="rpg-dialog-options">
              {event.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`rpg-option ${idx === selectedIdx ? 'selected' : ''}`}
                  onClick={() => onResolve(idx)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                >
                  <span className="option-cursor">
                    {idx === selectedIdx
                      ? <PixelIcon name="cursor" size={12} color={PALETTE.highlight} />
                      : <span style={{ width: 12, display: 'inline-block' }} />
                    }
                  </span>
                  <span className="option-label">{opt.label}</span>
                  <span className="option-effect">{effectStr(opt.effect)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
