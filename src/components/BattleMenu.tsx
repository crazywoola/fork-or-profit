import { useState, useEffect, useMemo } from 'react'
import { CATEGORY_COLORS, PALETTE } from '../pixel/palette'
import { PixelIcon, CardCategoryIcon } from './PixelIcon'
import { englishText } from '../utils/english'
import type { Card, CardPreview } from '../engine/types'

type Props = {
  hand: Card[]
  actionPoints: number
  maxActionPoints: number
  effectMultipliers: Record<string, number>
  canPlayCard: (cardId: string) => boolean
  previewCard: (cardId: string) => CardPreview | null
  onPlayCard: (cardId: string) => void
  onEndTurn: () => void
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

export function BattleMenu({ hand, actionPoints, maxActionPoints, effectMultipliers, canPlayCard, previewCard, onPlayCard, onEndTurn }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [hoverIdx, setHoverIdx] = useState(-1)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (hand.length === 0) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setSelectedIdx(i => (i - 1 + hand.length) % hand.length)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setSelectedIdx(i => (i + 1) % hand.length)
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (hand[selectedIdx] && canPlayCard(hand[selectedIdx].id)) {
          onPlayCard(hand[selectedIdx].id)
        }
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        onEndTurn()
      } else if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key) - 1
        if (idx < hand.length && canPlayCard(hand[idx].id)) {
          onPlayCard(hand[idx].id)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [hand, selectedIdx, canPlayCard, onPlayCard, onEndTurn])

  useEffect(() => {
    if (hand.length === 0) {
      setSelectedIdx(0)
      setHoverIdx(-1)
      return
    }
    setSelectedIdx(i => Math.min(i, hand.length - 1))
    setHoverIdx(i => (i >= hand.length ? -1 : i))
  }, [hand.length])

  const activeIdx = hoverIdx >= 0 ? hoverIdx : selectedIdx
  const activeCard = hand[activeIdx]
  const activePlayable = activeCard ? canPlayCard(activeCard.id) : false
  const activeMultiplier = activeCard ? (effectMultipliers[activeCard.category] ?? 1) : 1

  const preview = useMemo<CardPreview | null>(() => {
    if (!activeCard) return null
    return previewCard(activeCard.id)
  }, [activeCard, previewCard])

  const effectStr = (effect: Record<string, number>) => {
    return Object.entries(effect)
      .filter(([, v]) => v !== 0)
      .map(([k, v]) => `${STAT_LABELS[k] ?? k}: ${v > 0 ? '+' : ''}${v}`)
      .join(', ')
  }

  return (
    <div className="battle-menu">
      <div className="battle-ap-bar">
        <div className="battle-ap-title">
          <span className="battle-label">AP</span>
          <span className="battle-ap-count">{actionPoints}/{maxActionPoints}</span>
        </div>
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

      {activeCard && (
        <div className="battle-card-detail">
          <div className="battle-card-detail-head">
            <span className="battle-card-detail-cat" style={{ backgroundColor: CATEGORY_COLORS[activeCard.category] ?? PALETTE.textDim }}>
              <CardCategoryIcon category={activeCard.category} size={10} />
              {activeCard.category}
            </span>
            <h4>{activeCard.title}</h4>
            <span className={`battle-card-detail-status ${activePlayable ? 'ok' : 'warn'}`}>
              {activePlayable ? 'READY' : 'LOCKED'}
            </span>
          </div>
          <div className="battle-card-detail-meta">
            {!activePlayable && activeCard.condition && (
              <span className="battle-card-detail-condition">
                Requires: {englishText(activeCard.condition, 'Requirements not met')}
              </span>
            )}
            {preview && preview.multiplier !== 1 && (
              <span className={`battle-card-detail-mult ${preview.multiplier > 1 ? 'boost' : 'penalty'}`}>
                {preview.multiplier > 1 ? '▲' : '▼'} x{preview.multiplier} {activeCard.category}
              </span>
            )}
          </div>
          {preview && (
            <div className="battle-card-preview">
              <div className="preview-section">
                <span className="preview-label">TOTAL IMPACT</span>
                <span className="preview-effects">{effectStr(preview.totalEffect)}</span>
              </div>
              {Object.keys(preview.bonusEffect).length > 0 && (
                <div className="preview-section bonus">
                  <span className="preview-label">BONUS</span>
                  <span className="preview-effects">{effectStr(preview.bonusEffect)}</span>
                </div>
              )}
              {Object.keys(preview.templateBonus).length > 0 && (
                <div className="preview-section template">
                  <span className="preview-label">PASSIVE</span>
                  <span className="preview-effects">{effectStr(preview.templateBonus)}</span>
                </div>
              )}
              {preview.synergyLabel && (
                <div className="preview-section synergy">
                  <span className="preview-label">SYNERGY</span>
                  <span className="preview-effects">{preview.synergyLabel}</span>
                </div>
              )}
            </div>
          )}
          <p className="battle-card-detail-tip">[Enter] Play · [←→] Switch · [1-9] Quick Play · [E] End Turn</p>
        </div>
      )}

      <div className="battle-cards">
        {hand.map((card, idx) => {
          const color = CATEGORY_COLORS[card.category] ?? PALETTE.textDim
          const isActive = idx === activeIdx
          const playable = canPlayCard(card.id)
          const mult = effectMultipliers[card.category] ?? 1
          const isBoosted = mult > 1

          return (
            <div
              key={card.id}
              className={[
                'battle-card',
                isActive ? 'active' : '',
                !playable ? 'locked' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => playable && onPlayCard(card.id)}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(-1)}
              aria-disabled={!playable}
            >
              {/* Lock indicator for cards with unmet conditions */}
              {!playable && card.condition && (
                <div className="card-lock-overlay">
                  <PixelIcon name="lock" size={16} color={PALETTE.dangerRed} />
                  <span className="card-lock-reason">{englishText(card.condition, 'Requirements not met')}</span>
                </div>
              )}

              <div className="card-top" style={{ backgroundColor: color }}>
                <span className="card-cat">
                  <CardCategoryIcon category={card.category} size={10} />
                  {card.category}
                </span>
                <span className="card-num-badge">{idx + 1}</span>
              </div>
              <h4 className="card-title">{card.title}</h4>
              <p className="card-desc">{englishText(card.description, 'Play this strategy to gain an advantage.')}</p>
              <div className="card-bottom">
                <span className="card-effect-text">{effectStr(card.effect)}</span>
                {card.cost && (
                  <span className="card-cost">Cost: {effectStr(card.cost)}</span>
                )}
              </div>
              {mult !== 1 && (
                <div className={`card-mult-badge ${isBoosted ? 'boost' : 'penalty'}`}>
                  x{mult}
                </div>
              )}
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
