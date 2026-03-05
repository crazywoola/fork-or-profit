import { useState, useEffect } from 'react'
import { TypeWriter } from './TypeWriter'
import { EventCategoryIcon, PixelIcon } from './PixelIcon'
import { EVENT_DESCRIPTION_TRANSLATIONS } from '../data/event-translations'
import { CATEGORY_COLORS, PALETTE } from '../pixel/palette'
import { EVENT_OPTION_TRANSLATIONS } from '../data/event-option-translations'
import { englishText } from '../utils/english'
import type { GameEvent } from '../engine/types'

type Props = {
  event: GameEvent
  onResolve: (optionIndex: number) => void
}

const STAT_LABELS: Record<string, string> = {
  cash: 'cash',
  revenue: 'revenue',
  community: 'community',
  growth: 'growth',
  reputation: 'reputation',
  control: 'control',
  dev_speed: 'dev speed',
  stability: 'stability',
  pressure: 'pressure',
  trust: 'trust',
  risk: 'risk',
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
  const eventDescription =
    EVENT_DESCRIPTION_TRANSLATIONS[event.id] ??
    englishText(event.description, 'A major change is affecting your company. Choose your response.')

  const effectStr = (effect: Record<string, number>) => {
    return Object.entries(effect)
      .map(([k, v]) => `${STAT_LABELS[k] ?? k}: ${v > 0 ? '+' : ''}${v}`)
      .join(', ')
  }

  const optionLabel = (label: string, effect: Record<string, number>, idx: number) => {
    const translated = EVENT_OPTION_TRANSLATIONS[event.id]?.[idx]?.label
    if (translated) return translated

    const cleaned = englishText(label, '')
    if (cleaned) return cleaned
    const summary = effectStr(effect)
    return summary ? `Option ${idx + 1}: ${summary}` : `Option ${idx + 1}`
  }

  const optionDescription = (description: string | undefined, effect: Record<string, number>, idx: number) => {
    const translated = EVENT_OPTION_TRANSLATIONS[event.id]?.[idx]?.description
    if (translated) return translated
    return englishText(description, effectStr(effect))
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
            <h3>{englishText(event.title, 'Critical Event')}</h3>
          </div>

          <div className="rpg-dialog-text">
            <TypeWriter text={eventDescription} speed={25} onComplete={() => setTextDone(true)} />
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
                  <span className="option-label">{optionLabel(opt.label, opt.effect, idx)}</span>
                  <span className="option-effect">{optionDescription(opt.description, opt.effect, idx)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
