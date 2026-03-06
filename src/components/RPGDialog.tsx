import { useState, useEffect } from 'react'
import { TypeWriter } from './TypeWriter'
import { EventCategoryIcon, PixelIcon } from './PixelIcon'
import { CATEGORY_COLORS, PALETTE } from '../pixel/palette'
import { formatEffect, getEventDescription, getEventOptionDescription, getEventOptionLabel } from '../i18n/content'
import { useI18n } from '../i18n'
import type { GameEvent } from '../engine/types'

type Props = {
  event: GameEvent
  onResolve: (optionIndex: number) => void
}

export function RPGDialog({ event, onResolve }: Props) {
  const { messages } = useI18n()
  const [textDone, setTextDone] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [skipSignal, setSkipSignal] = useState(false)

  useEffect(() => {
    setTextDone(false)
    setSelectedIdx(0)
    setSkipSignal(false)
  }, [event.id])

  // When text is still animating: Enter/Space skips the animation
  useEffect(() => {
    if (textDone) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setSkipSignal(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [textDone])

  // After text is done: arrow keys navigate, Enter/Space confirms
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
  const eventDescription = getEventDescription(event.id, event.description || messages.dialog.fallbackDescription)

  const optionLabel = (label: string, effect: Record<string, number>, idx: number) => {
    const translated = getEventOptionLabel(event.id, idx, label)
    if (translated) return translated
    const summary = formatEffect(effect)
    return summary ? `${messages.dialog.option(idx)}: ${summary}` : messages.dialog.option(idx)
  }

  const optionDescription = (description: string | undefined, effect: Record<string, number>, idx: number) => {
    return getEventOptionDescription(event.id, idx, description || formatEffect(effect))
  }

  const optionFuture = (idx: number) => {
    const option = event.options[idx]
    if (option.consequenceHint) return option.consequenceHint
    if (option.followupEventId || option.unlocks) return messages.dialog.futureBranch
    return ''
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
          <div className="rpg-dialog-header">
            <div className="rpg-dialog-title">
              <span className="event-tag" style={{ backgroundColor: catColor }}>
                <EventCategoryIcon category={event.category} size={10} />
                {event.category}
              </span>
              <h3>{event.title || messages.dialog.criticalEvent}</h3>
            </div>
            <p className="rpg-dialog-subtitle">{messages.dialog.subtitle}</p>
          </div>

          <div className="rpg-dialog-text" title={messages.dialog.skipTitle}>
            <TypeWriter text={eventDescription} speed={25} onComplete={() => setTextDone(true)} skipSignal={skipSignal} />
            {!textDone && <span className="tw-skip-hint">{messages.dialog.skipHint}</span>}
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
                  <div className="rpg-option-main">
                    <span className="option-cursor">
                      {idx === selectedIdx
                        ? <PixelIcon name="cursor" size={12} color={PALETTE.highlight} />
                        : <span style={{ width: 12, display: 'inline-block' }} />
                      }
                    </span>
                    <span className="option-label">{optionLabel(opt.label, opt.effect, idx)}</span>
                  </div>
                  {formatEffect(opt.effect) && (
                    <span className="option-impact">{messages.dialog.immediate}: {formatEffect(opt.effect)}</span>
                  )}
                  <span className="option-effect">{optionDescription(opt.description, opt.effect, idx)}</span>
                  {optionFuture(idx) && (
                    <span className="option-future">{messages.dialog.future}: {optionFuture(idx)}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
