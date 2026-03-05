import { useState, useMemo, useCallback, useEffect } from 'react'
import { PixelCanvas } from '../components/PixelCanvas'
import { PixelHUD } from '../components/PixelHUD'
import { PlayerPanel } from '../components/PlayerPanel'
import { RPGDialog } from '../components/RPGDialog'
import { BattleMenu } from '../components/BattleMenu'
import { MiniMap } from '../components/MiniMap'
import { GameLog } from '../components/GameLog'
import { StatsPopup } from '../components/StatsPopup'
import { PixelStatBar } from '../components/PixelStatBar'
import { PixelIcon } from '../components/PixelIcon'
import { PALETTE } from '../pixel/palette'
import { OFFICE_ROOMS } from '../pixel/tiles'
import { gameModes } from '../data/game'
import { englishText, titleFromId } from '../utils/english'
import type { GameSetup } from '../App'
import type { GameState } from '../engine/types'

type Props = {
  setup: GameSetup
  gameState: GameState
  canPlayCard: (cardId: string) => boolean
  actions: {
    startRound: () => void
    resolveEvent: (optionIndex: number) => void
    playCard: (cardId: string) => void
    endTurn: () => void
    restart: () => void
  }
  onGameOver: (result: 'win' | 'lose') => void
  onNewGame: () => void
}

// Segmented danger stat (PRESSURE / RISK, max=10) — distinct from progress bars
function PixelDangerStat({ label, value, max, danger }: { label: string; value: number; max: number; danger: boolean }) { return (
  <div className={`px-danger-stat ${danger ? 'danger' : ''}`}>
    <span className="px-danger-label">{label}</span>
    <div className="px-danger-segments">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className={`px-danger-seg ${i < value ? (danger ? 'filled-danger' : 'filled') : 'empty'}`}
        />
      ))}
    </div>
    <span className="px-danger-value">{value}/{max}</span>
  </div>
) }

function eventToRoomId(category: string): string {
  switch (category) {
    case 'Tech':        return 'eng'
    case 'Community':   return 'community'
    case 'Market':      return 'revenue'
    case 'Competition': return 'product'
    case 'Ecosystem':   return 'platform'
    case 'Media':       return 'growth'
    case 'Regulation':  return 'finance'
    default:            return 'hq'
  }
}

export function GameScreen({ setup, gameState, canPlayCard, actions, onGameOver, onNewGame }: Props) {
  const [activeRoomId, setActiveRoomId] = useState('hq')
  const [showStats, setShowStats] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showMobileIntel, setShowMobileIntel] = useState(false)

  const { phase, activeEvent, hand, actionPoints, maxActionPoints, stats } = gameState

  const mode = useMemo(
    () => gameModes.find(m => m.id === setup.gameModeId),
    [setup.gameModeId],
  )

  const highlightRoomId = useMemo(() => {
    if (phase === 'event' && activeEvent) {
      return eventToRoomId(activeEvent.category)
    }
    return ''
  }, [phase, activeEvent])

  // Victory / defeat detection: phase stays 'resolution' when game ends
  useEffect(() => {
    if (phase === 'resolution' && gameState.victory !== 'none') {
      onGameOver(gameState.victory)
    }
  }, [phase, gameState.victory, onGameOver])

  const handleResolveEvent = useCallback((idx: number) => {
    actions.resolveEvent(idx)
  }, [actions])

  const handlePlayCard = useCallback((cardId: string) => {
    actions.playCard(cardId)
  }, [actions])

  const handleEndTurn = useCallback(() => {
    actions.endTurn()
  }, [actions])

  const selectedRoom = OFFICE_ROOMS.find(r => r.id === activeRoomId)

  const statusAlert = useMemo(() => {
    const candidates = [
      stats.cash <= 3 ? {
        priority: 5,
        tone: 'critical',
        icon: 'cash',
        title: 'Cash Critical',
        hint: 'Prioritize Finance and Monetization cards to avoid bankruptcy.',
      } : null,
      stats.community <= 2 ? {
        priority: 5,
        tone: 'critical',
        icon: 'community',
        title: 'Community Collapse Risk',
        hint: 'Recover trust and community health before contributors leave.',
      } : null,
      stats.risk >= 8 ? {
        priority: 4,
        tone: 'warning',
        icon: 'risk',
        title: 'Risk Exposure High',
        hint: 'Play risk-control cards to prevent negative chain events.',
      } : null,
      stats.pressure >= 8 ? {
        priority: 4,
        tone: 'warning',
        icon: 'pressure',
        title: 'Pressure Too High',
        hint: 'Reduce burn rate or increase stability to relieve pressure.',
      } : null,
      gameState.burnRate >= 4 ? {
        priority: 3,
        tone: 'warning',
        icon: 'cash',
        title: 'Burn Rate Too Fast',
        hint: 'Prepare cash and cost-control actions for upcoming rounds.',
      } : null,
    ].filter(Boolean)

    if (candidates.length === 0) {
      return {
        tone: 'safe',
        icon: 'reputation',
        title: 'Stable Situation',
        hint: 'Push key stats toward your current mode objective.',
      }
    }

    candidates.sort((a, b) => b.priority - a.priority)
    return candidates[0]
  }, [stats, gameState.burnRate])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 's' || e.key === 'S') {
        if (phase !== 'event') setShowStats(v => !v)
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault()
        setShowGuide(v => !v)
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault()
        setShowMobileIntel(v => !v)
      } else if (e.key === 'Escape') {
        setShowStats(false)
        setShowGuide(false)
        setShowMobileIntel(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase])

  // Active buff count for HUD indicator
  const activeBoneCount = gameState.activeEffects.length

  return (
    <div className="screen game-screen">
      <div className={`game-hud-left ${phase === 'event' ? 'hud-dimmed' : ''}`}>
        <PixelHUD gameState={gameState} />
        <PlayerPanel
          role={setup.role}
          template={setup.template}
          companyName={setup.companyName}
        />
        <div className="hud-goal-box">
          <div className="hud-goal-title">
            <PixelIcon name="star" size={9} color={PALETTE.accentGold} />
            {englishText(mode?.name, titleFromId(setup.gameModeId))}
          </div>
          <p>{englishText(mode?.goal, 'Stay alive and keep the company growing.')}</p>
        </div>
        <div className="hud-stats-section">
          <PixelStatBar label="CASH"      value={stats.cash}      max={50} color={PALETTE.cashGold}      danger={stats.cash <= 3}     icon="cash" />
          <PixelStatBar label="COMMUNITY" value={stats.community} max={50} color={PALETTE.communityTeal} danger={stats.community <= 2} icon="community" />
          <div className="hud-danger-stats">
            <PixelDangerStat label="PRESSURE" value={stats.pressure} max={10} danger={stats.pressure >= 7} />
            <PixelDangerStat label="RISK"     value={stats.risk}     max={10} danger={stats.risk >= 7} />
          </div>
          <button className="hud-expand-stats-btn" onClick={() => setShowStats(true)}>
            <PixelIcon name="star" size={8} color={PALETTE.textDim} />
            GROWTH · REVENUE · REPUTATION · MORE [S]
          </button>
        </div>
        <div className="hud-meta-row">
          <span className="hud-burn-rate">BURN: {gameState.burnRate}/round</span>
          {activeBoneCount > 0 && (
            <span className="hud-buff-count" title={gameState.activeEffects.map(e => {
              const label = englishText(e.label, 'Effect')
              return e.remainingRounds > 0 && e.remainingRounds < 999
                ? `${label} (${e.remainingRounds}r left)`
                : label
            }).join('\n')}>
              ✦ {activeBoneCount} effect{activeBoneCount > 1 ? 's' : ''} active
            </span>
          )}
        </div>
        <div className="hud-shortcuts">
          <span>[S] Stats</span>
          <span>[H] Help</span>
          <span>[I] Intel</span>
        </div>
      </div>

      <div className="game-center">
        <div className={`status-alert-bar ${statusAlert.tone}`}>
          <div className="status-alert-main">
            <PixelIcon
              name={statusAlert.icon}
              size={14}
              color={statusAlert.tone === 'critical' ? PALETTE.dangerRed : statusAlert.tone === 'warning' ? PALETTE.accentGold : PALETTE.healthGreen}
            />
            <div className="status-alert-text">
              <strong>{statusAlert.title}</strong>
              <span>{statusAlert.hint}</span>
            </div>
          </div>
          <div className="status-alert-actions">
            <button className="hud-mini-btn" onClick={() => setShowGuide(true)}>HELP [H]</button>
            <button className="hud-mini-btn mobile-only" onClick={() => setShowMobileIntel(true)}>INTEL [I]</button>
          </div>
        </div>

        <div className="game-world">
          <PixelCanvas
            activeRoomId={activeRoomId}
            highlightRoomId={highlightRoomId}
            onRoomSelect={setActiveRoomId}
          />
        </div>

        <div className="game-bottom-panel">
          {phase === 'event' && activeEvent && (
            <RPGDialog event={activeEvent} onResolve={handleResolveEvent} />
          )}

          {phase === 'action' && (
            <BattleMenu
              hand={hand}
              actionPoints={actionPoints}
              maxActionPoints={maxActionPoints}
              effectMultipliers={gameState.effectMultipliers}
              canPlayCard={canPlayCard}
              onPlayCard={handlePlayCard}
              onEndTurn={handleEndTurn}
            />
          )}
        </div>
      </div>

      <div className={`game-hud-right ${phase === 'event' ? 'hud-dimmed' : ''}`}>
        <MiniMap activeRoomId={activeRoomId} highlightRoomId={highlightRoomId} />
        {selectedRoom && (
          <div className="room-info-box">
            <h4>
              <PixelIcon name={`evt-${selectedRoom.archetype === 'engineering' ? 'tech' : 'community'}`} size={10} />
              {selectedRoom.name}
            </h4>
            <p className="room-type">{selectedRoom.archetype}</p>
          </div>
        )}
        <GameLog history={gameState.history} />
      </div>

      <StatsPopup gameState={gameState} />

      {showGuide && (
        <div className="stats-overlay" onClick={() => setShowGuide(false)}>
          <div className="help-panel" onClick={e => e.stopPropagation()}>
            <h3>COMMAND CENTER</h3>
            <div className="help-grid">
              <div className="help-row"><span>[Tab]</span><span>Switch setup panel focus</span></div>
              <div className="help-row"><span>[←/→]</span><span>Change role, company, or mode</span></div>
              <div className="help-row"><span>[↑/↓]</span><span>Select event decision options</span></div>
              <div className="help-row"><span>[1-9]</span><span>Quick-play cards in action phase</span></div>
              <div className="help-row"><span>[Enter]</span><span>Confirm selection / play selected card</span></div>
              <div className="help-row"><span>[E]</span><span>End the current action turn</span></div>
              <div className="help-row"><span>[S]</span><span>Toggle detailed company status</span></div>
              <div className="help-row"><span>[I]</span><span>Toggle Intel panel (map and logs)</span></div>
              <div className="help-row"><span>[Esc]</span><span>Close the current overlay</span></div>
            </div>
            <button className="pixel-btn primary" onClick={() => setShowGuide(false)}>Back To Game</button>
          </div>
        </div>
      )}

      {showMobileIntel && (
        <div className="stats-overlay" onClick={() => setShowMobileIntel(false)}>
          <div className="intel-panel" onClick={e => e.stopPropagation()}>
            <div className="intel-panel-head">
              <h3>INTEL PANEL</h3>
              <button className="pixel-btn" onClick={() => setShowMobileIntel(false)}>CLOSE</button>
            </div>
            <MiniMap activeRoomId={activeRoomId} highlightRoomId={highlightRoomId} />
            {selectedRoom && (
              <div className="room-info-box">
                <h4>
                  <PixelIcon name={`evt-${selectedRoom.archetype === 'engineering' ? 'tech' : 'community'}`} size={10} />
                  {selectedRoom.name}
                </h4>
                <p className="room-type">{selectedRoom.archetype}</p>
              </div>
            )}
            <GameLog history={gameState.history} />
          </div>
        </div>
      )}

      {showStats && (
        <div className="stats-overlay" onClick={() => setShowStats(false)}>
          <div className="stats-detail-panel" onClick={e => e.stopPropagation()}>
            <h3>COMPANY STATUS</h3>
            <div className="stats-grid">
              <PixelStatBar label="CASH"       value={stats.cash}       max={50} color={PALETTE.cashGold}      danger={stats.cash <= 3}     icon="cash" />
              <PixelStatBar label="REVENUE"    value={stats.revenue}    max={50} color={PALETTE.orange}                                      icon="revenue" />
              <PixelStatBar label="COMMUNITY"  value={stats.community}  max={50} color={PALETTE.communityTeal} danger={stats.community <= 2} icon="community" />
              <PixelStatBar label="GROWTH"     value={stats.growth}     max={50} color={PALETTE.growthPink}                                  icon="growth" />
              <PixelStatBar label="REPUTATION" value={stats.reputation} max={50} color={PALETTE.accentGold}                                  icon="reputation" />
              <PixelStatBar label="CONTROL"    value={stats.control}    max={50} color={PALETTE.engBlue}                                     icon="control" />
              <PixelStatBar label="DEV SPEED"  value={stats.dev_speed}  max={50} color={PALETTE.engBlue}                                     icon="dev_speed" />
              <PixelStatBar label="STABILITY"  value={stats.stability}  max={50} color={PALETTE.healthGreen}                                 icon="stability" />
              <PixelStatBar label="TRUST"      value={stats.trust}      max={50} color={PALETTE.communityTeal}                               icon="trust" />
              <PixelStatBar label="PRESSURE"   value={stats.pressure}   max={10} color={PALETTE.dangerRed}     danger={stats.pressure >= 7} icon="pressure" />
              <PixelStatBar label="RISK"       value={stats.risk}       max={10} color={PALETTE.dangerRed}     danger={stats.risk >= 7}      icon="risk" />
            </div>

            {/* Active effects list */}
            {gameState.activeEffects.length > 0 && (
              <div className="stats-active-effects">
                <h4>Active Effects</h4>
                {gameState.activeEffects.map(e => (
                  <div key={e.id} className="active-effect-row">
                    <span className="effect-label">{englishText(e.label, 'Temporary effect')}</span>
                    {e.remainingRounds > 0 && e.remainingRounds < 999 && (
                      <span className="effect-rounds">{e.remainingRounds} rounds</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button className="pixel-btn" onClick={() => setShowStats(false)}>CLOSE [S]</button>
          </div>
        </div>
      )}
    </div>
  )
}
