import { useState, useEffect } from 'react'
import { CATEGORY_COLORS, PALETTE } from '../pixel/palette'
import { PixelIcon, CardCategoryIcon } from './PixelIcon'
import type { Card } from '../engine/types'

type Props = {
  hand: Card[]
  actionPoints: number
  maxActionPoints: number
  onPlayCard: (cardId: string) => void
  onEndTurn: () => void
}

export function BattleMenu({ hand, actionPoints, maxActionPoints, onPlayCard, onEndTurn }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [hoverIdx, setHoverIdx] = useState(-1)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setSelectedIdx(i => (i - 1 + hand.length) % hand.length)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setSelectedIdx(i => (i + 1) % hand.length)
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (hand[selectedIdx] && actionPoints > 0) {
          onPlayCard(hand[selectedIdx].id)
        }
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        onEndTurn()
      } else if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key) - 1
        if (idx < hand.length && actionPoints > 0) {
          onPlayCard(hand[idx].id)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [hand, selectedIdx, actionPoints, onPlayCard, onEndTurn])

  const activeIdx = hoverIdx >= 0 ? hoverIdx : selectedIdx

  const effectStr = (effect: Record<string, number>) => {
    return Object.entries(effect)
      .map(([k, v]) => `${k}: ${v > 0 ? '+' : ''}${v}`)
      .join(', ')
  }

  return (
    <div className="battle-menu">
      <div className="battle-ap-bar">
        <span className="battle-label">ACTION POINTS</span>
        <div className="battle-ap-gems">
          {Array.from({ length: maxActionPoints }).map((_, i) => (
            <PixelIcon
              key={i}
              name="ap-gem"
              size={16}
              color={i < actionPoints ? PALETTE.engBlue : PALETTE.textMuted}
              className={i < actionPoints ? 'ap-active' : 'ap-spent'}
            />
          ))}
        </div>
        <button className="pixel-btn end-turn-btn" onClick={onEndTurn}>
          END TURN [E]
        </button>
      </div>

      <div className="battle-cards">
        {hand.map((card, idx) => {
          const color = CATEGORY_COLORS[card.category] ?? PALETTE.textDim
          const isActive = idx === activeIdx
          return (
            <div
              key={card.id}
              className={`battle-card ${isActive ? 'active' : ''} ${actionPoints <= 0 ? 'disabled' : ''}`}
              onClick={() => actionPoints > 0 && onPlayCard(card.id)}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(-1)}
            >
              <div className="card-top" style={{ backgroundColor: color }}>
                <span className="card-cat">
                  <CardCategoryIcon category={card.category} size={10} />
                  {card.category}
                </span>
                <span className="card-num-badge">{idx + 1}</span>
              </div>
              <h4 className="card-title">{card.title}</h4>
              <p className="card-desc">{card.description}</p>
              <div className="card-bottom">
                <span className="card-effect-text">{effectStr(card.effect)}</span>
                {card.cost && (
                  <span className="card-cost">Cost: {effectStr(card.cost)}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {hand.length === 0 && (
        <div className="battle-empty">
          <p>No cards in hand. Press [E] to end turn.</p>
        </div>
      )}
    </div>
  )
}
