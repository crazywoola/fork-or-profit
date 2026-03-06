import { useState, useMemo, useCallback, useEffect } from 'react'
import { PixelCanvas } from '../components/PixelCanvas'
import { PixelHUD } from '../components/PixelHUD'
import { PlayerPanel } from '../components/PlayerPanel'
import { RPGDialog } from '../components/RPGDialog'
import { BattleMenu } from '../components/BattleMenu'
import { PlanningPanel } from '../components/PlanningPanel'
import { MiniMap } from '../components/MiniMap'
import { GameLog } from '../components/GameLog'
import { StatsPopup } from '../components/StatsPopup'
import { PixelStatBar } from '../components/PixelStatBar'
import { PixelIcon } from '../components/PixelIcon'
import { sfxCardPlay, sfxEventAlert, sfxEndTurn, sfxDanger } from '../audio/sfx'
import { PALETTE } from '../pixel/palette'
import { OFFICE_ROOMS } from '../pixel/tiles'
import { gameModes } from '../data/game'
import {
  getActiveEffectLabel,
  getArchetypeLabel,
  getFactionLabel,
  getGameStageLabel,
  getModeGoal,
  getModeName,
  getProgressionChoiceLabel,
  getStatLabel,
} from '../i18n/content'
import { useI18n } from '../i18n'
import type { GameSetup } from '../App'
import type { GameState, CardPreview, StatId } from '../engine/types'

type Props = {
  setup: GameSetup
  gameState: GameState
  canPlayCard: (cardId: string) => boolean
  previewCard: (cardId: string) => CardPreview | null
  getRunway: () => number
  actions: {
    startRound: () => void
    resolveEvent: (optionIndex: number) => void
    playCard: (cardId: string) => void
    chooseRoom: (roomId: string) => void
    endTurn: () => void
    advanceSummary: () => void
    restart: () => void
  }
  onGameOver: (result: 'win' | 'lose') => void
  onNewGame: () => void
}

const MODE_KEY_STATS: Record<string, StatId[]> = {
  survival: ['revenue', 'growth'],
  ipo: ['revenue', 'reputation'],
  legend: ['growth', 'trust'],
  acquisition: ['revenue', 'reputation'],
  'open-core': ['revenue', 'community'],
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

export function GameScreen({ setup, gameState, canPlayCard, previewCard, getRunway, actions, onGameOver, onNewGame }: Props) {
  const { messages } = useI18n()
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
    if (phase === 'planning' && gameState.selectedRoomId) {
      return gameState.selectedRoomId
    }
    return ''
  }, [phase, activeEvent, gameState.selectedRoomId])

  useEffect(() => {
    if (gameState.selectedRoomId) {
      setActiveRoomId(gameState.selectedRoomId)
    }
  }, [gameState.selectedRoomId])

  // Victory / defeat detection
  useEffect(() => {
    if (gameState.victory !== 'none' && (phase === 'resolution' || phase === 'summary')) {
      onGameOver(gameState.victory)
    }
  }, [phase, gameState.victory, onGameOver])

  const runway = useMemo(() => getRunway(), [getRunway, stats.cash, stats.revenue, gameState.burnRate])
  const keyStats = MODE_KEY_STATS[setup.gameModeId] ?? ['revenue', 'growth']

  const getTrend = useCallback((statId: StatId): 'up' | 'down' | 'flat' => {
    if (!gameState.previousRoundStats) return 'flat'
    const prev = gameState.previousRoundStats[statId]
    const curr = stats[statId]
    if (curr > prev) return 'up'
    if (curr < prev) return 'down'
    return 'flat'
  }, [gameState.previousRoundStats, stats])

  const handleResolveEvent = useCallback((idx: number) => {
    sfxEventAlert()
    actions.resolveEvent(idx)
  }, [actions])

  const handlePlayCard = useCallback((cardId: string) => {
    sfxCardPlay()
    actions.playCard(cardId)
  }, [actions])

  const handleEndTurn = useCallback(() => {
    sfxEndTurn()
    actions.endTurn()
  }, [actions])

  const handleChooseRoom = useCallback((roomId: string) => {
    actions.chooseRoom(roomId)
  }, [actions])

  // Play danger sound when critical thresholds are reached
  useEffect(() => {
    if (stats.cash <= 3 || stats.community <= 2 || stats.risk >= 8 || stats.pressure >= 8) {
      sfxDanger()
    }
  }, [stats.cash <= 3, stats.community <= 2, stats.risk >= 8, stats.pressure >= 8])

  const selectedRoom = OFFICE_ROOMS.find(r => r.id === activeRoomId)
  const committedRoom = OFFICE_ROOMS.find(r => r.id === gameState.selectedRoomId)
  const phaseClass = `phase-${phase}`
  const interactionFocus = phase === 'planning' || phase === 'event' || phase === 'action'

  const statusAlert = useMemo(() => {
    const candidates = [
      stats.cash <= 3 ? {
        priority: 5,
        tone: 'critical',
        icon: 'cash',
        title: messages.game.statusAlerts.cashCritical.title,
        hint: messages.game.statusAlerts.cashCritical.hint,
      } : null,
      stats.community <= 2 ? {
        priority: 5,
        tone: 'critical',
        icon: 'community',
        title: messages.game.statusAlerts.communityRisk.title,
        hint: messages.game.statusAlerts.communityRisk.hint,
      } : null,
      stats.risk >= 8 ? {
        priority: 4,
        tone: 'warning',
        icon: 'risk',
        title: messages.game.statusAlerts.riskHigh.title,
        hint: messages.game.statusAlerts.riskHigh.hint,
      } : null,
      stats.pressure >= 8 ? {
        priority: 4,
        tone: 'warning',
        icon: 'pressure',
        title: messages.game.statusAlerts.pressureHigh.title,
        hint: messages.game.statusAlerts.pressureHigh.hint,
      } : null,
      gameState.burnRate >= 4 ? {
        priority: 3,
        tone: 'warning',
        icon: 'cash',
        title: messages.game.statusAlerts.burnFast.title,
        hint: messages.game.statusAlerts.burnFast.hint,
      } : null,
    ].filter(Boolean)

    if (candidates.length === 0) {
      return {
        tone: 'safe',
        icon: 'reputation',
        title: messages.game.statusAlerts.stable.title,
        hint: messages.game.statusAlerts.stable.hint,
      }
    }

    candidates.sort((a, b) => b.priority - a.priority)
    return candidates[0]
  }, [stats, gameState.burnRate, messages])

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
    <div className={`screen game-screen ${phaseClass} ${interactionFocus ? 'interaction-focus' : ''}`}>
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
            {getModeName(setup.gameModeId, mode?.name)}
          </div>
          <p>{getModeGoal(setup.gameModeId, mode?.goal || messages.game.fallbackGoal)}</p>
        </div>
        <div className="hud-stats-section">
          <PixelStatBar label={getStatLabel('cash', 'upper')}      value={stats.cash}      max={50} color={PALETTE.cashGold}      danger={stats.cash <= 3}     icon="cash" />
          <PixelStatBar label={getStatLabel('community', 'upper')} value={stats.community} max={50} color={PALETTE.communityTeal} danger={stats.community <= 2} icon="community" />
          {keyStats.map(statId => {
            const trend = getTrend(statId)
            const trendChar = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'
            const trendColor = trend === 'up' ? PALETTE.healthGreen : trend === 'down' ? PALETTE.dangerRed : PALETTE.textDim
            return (
              <div key={statId} className="hud-contextual-stat">
                <PixelStatBar
                  label={getStatLabel(statId, 'upper')}
                  value={stats[statId]}
                  max={statId === 'pressure' || statId === 'risk' ? 10 : 50}
                  color={statId === 'revenue' ? PALETTE.orange : statId === 'reputation' ? PALETTE.accentGold : statId === 'growth' ? PALETTE.growthPink : PALETTE.communityTeal}
                  icon={statId}
                  compact
                />
                <span className="hud-trend" style={{ color: trendColor }}>{trendChar}</span>
              </div>
            )
          })}
          <div className="hud-danger-stats">
            <PixelDangerStat label={getStatLabel('pressure', 'upper')} value={stats.pressure} max={10} danger={stats.pressure >= 7} />
            <PixelDangerStat label={getStatLabel('risk', 'upper')}     value={stats.risk}     max={10} danger={stats.risk >= 7} />
          </div>
          <button className="hud-expand-stats-btn" onClick={() => setShowStats(true)}>
            <PixelIcon name="star" size={8} color={PALETTE.textDim} />
            {messages.hud.allStats}
          </button>
        </div>
        <div className="hud-meta-row">
          <span className="hud-burn-rate">{messages.hud.burn(gameState.burnRate)}</span>
          <span className={`hud-runway ${runway <= 3 ? 'danger' : ''}`}>
            {runway >= 999 ? messages.hud.profitable : messages.hud.runway(runway)}
          </span>
          <span className="hud-stage-badge">{getGameStageLabel(gameState.gameStage)}</span>
          {gameState.selectedRoomId && committedRoom && (
            <span className="hud-stage-badge">
              {messages.hud.room(committedRoom.name)}
            </span>
          )}
          {activeBoneCount > 0 && (
            <span className="hud-buff-count" title={gameState.activeEffects.map(e => {
              const label = getActiveEffectLabel(e.label)
              return e.remainingRounds > 0 && e.remainingRounds < 999
                ? `${label} (${e.remainingRounds}r left)`
                : label
            }).join('\n')}>
              {messages.hud.effectsActive(activeBoneCount)}
            </span>
          )}
        </div>
        <div className="hud-shortcuts">
          <span>{messages.hud.shortcuts.stats}</span>
          <span>{messages.hud.shortcuts.help}</span>
          <span>{messages.hud.shortcuts.intel}</span>
        </div>
      </div>

      <div className={`game-center ${phaseClass}`}>
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
            <button className="hud-mini-btn" onClick={() => setShowGuide(true)}>{messages.game.helpButton}</button>
            <button className="hud-mini-btn mobile-only" onClick={() => setShowMobileIntel(true)}>{messages.game.intelButton}</button>
          </div>
        </div>

        <div className={`game-world ${interactionFocus ? 'deemphasized' : ''}`}>
          <PixelCanvas
            activeRoomId={activeRoomId}
            highlightRoomId={highlightRoomId}
            onRoomSelect={setActiveRoomId}
          />
        </div>

        <div className={`game-bottom-panel ${phaseClass}`}>
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
              previewCard={previewCard}
              onPlayCard={handlePlayCard}
              onEndTurn={handleEndTurn}
            />
          )}

          {phase === 'planning' && (
            <PlanningPanel
              rooms={OFFICE_ROOMS}
              activeRoomId={activeRoomId}
              pendingThreats={gameState.pendingThreats}
              factionReputation={gameState.factionReputation}
              onHoverRoom={setActiveRoomId}
              onChooseRoom={handleChooseRoom}
            />
          )}

          {phase === 'summary' && gameState.roundSummary && (
            <div className="round-summary-overlay">
              <div className="round-summary-panel">
                <h3>{messages.game.roundComplete(gameState.roundSummary.round)}</h3>
                <div className="summary-income">
                  <span className="summary-formula">
                    {messages.game.revenue} ({gameState.roundSummary.revenue}) - {messages.game.burn} ({gameState.roundSummary.burnRate}) = <strong className={gameState.roundSummary.netIncome >= 0 ? 'positive' : 'negative'}>
                      {gameState.roundSummary.netIncome >= 0 ? '+' : ''}{gameState.roundSummary.netIncome}
                    </strong>
                  </span>
                </div>
                <div className="summary-deltas">
                  {Object.entries(gameState.roundSummary.statDeltas).map(([key, val]) => (
                    <div key={key} className={`summary-delta ${(val as number) > 0 ? 'positive' : 'negative'}`}>
                      <span className="summary-delta-name">{getStatLabel(key, 'upper')}</span>
                      <span className="summary-delta-val">{(val as number) > 0 ? '+' : ''}{val as number}</span>
                    </div>
                  ))}
                </div>
                {gameState.roundSummary.expiredEffects.length > 0 && (
                  <div className="summary-expired">
                    <span className="summary-expired-label">{messages.game.effectsExpired}</span>
                    {gameState.roundSummary.expiredEffects.map((e, i) => (
                      <span key={i} className="summary-expired-item">{e}</span>
                    ))}
                  </div>
                )}
                {gameState.roundSummary.pendingThreats.length > 0 && (
                  <div className="summary-expired">
                    <span className="summary-expired-label">{messages.game.nextRoundPressure}</span>
                    {gameState.roundSummary.pendingThreats.map((threat, i) => (
                      <span key={i} className="summary-expired-item">{threat}</span>
                    ))}
                  </div>
                )}
                <button className="pixel-btn primary" onClick={actions.advanceSummary}>
                  {messages.game.continue}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`game-hud-right ${phase === 'event' ? 'hud-dimmed' : ''} ${interactionFocus ? 'focus-condensed' : ''}`}>
        <MiniMap activeRoomId={activeRoomId} highlightRoomId={highlightRoomId} />
        {selectedRoom && (
          <div className="room-info-box">
            <h4>
              <PixelIcon name={`evt-${selectedRoom.archetype === 'engineering' ? 'tech' : 'community'}`} size={10} />
              {selectedRoom.name}
            </h4>
            <p className="room-type">{getArchetypeLabel(selectedRoom.archetype)}</p>
            <p className="room-type">{selectedRoom.summary}</p>
            <p className="room-type">{selectedRoom.bonusHint}</p>
          </div>
        )}
        {gameState.pendingThreats.length > 0 && (
          <div className="room-info-box">
            <h4>
              <PixelIcon name="risk" size={10} />
              {messages.game.incomingPressure}
            </h4>
            {gameState.pendingThreats.map((threat, idx) => (
              <p key={idx} className="room-type">{threat}</p>
            ))}
          </div>
        )}
        {gameState.progressionSelections.length > 0 && (
          <div className="room-info-box">
            <h4>
              <PixelIcon name="star" size={10} />
              {messages.game.buildPath}
            </h4>
            {gameState.progressionSelections.map(choice => (
              <p key={choice} className="room-type">{getProgressionChoiceLabel(choice.replace(/^.*:/, ''))}</p>
            ))}
          </div>
        )}
        <div className="room-info-box">
          <h4>
            <PixelIcon name="community" size={10} />
            {messages.game.factions}
          </h4>
          {Object.entries(gameState.factionReputation).map(([key, val]) => (
            <p key={key} className="room-type">{getFactionLabel(key)}: {val}/10</p>
          ))}
        </div>
        <GameLog history={gameState.history} />
      </div>

      <StatsPopup gameState={gameState} />

      {showGuide && (
        <div className="stats-overlay" onClick={() => setShowGuide(false)}>
          <div className="help-panel" onClick={e => e.stopPropagation()}>
            <h3>{messages.game.commandCenter}</h3>
            <div className="help-grid">
              {messages.game.helpRows.map(row => (
                <div key={row.key} className="help-row"><span>{row.key}</span><span>{row.text}</span></div>
              ))}
            </div>
            <button className="pixel-btn primary" onClick={() => setShowGuide(false)}>{messages.game.backToGame}</button>
          </div>
        </div>
      )}

      {showMobileIntel && (
        <div className="stats-overlay" onClick={() => setShowMobileIntel(false)}>
          <div className="intel-panel" onClick={e => e.stopPropagation()}>
            <div className="intel-panel-head">
              <h3>{messages.game.intelPanel}</h3>
              <button className="pixel-btn" onClick={() => setShowMobileIntel(false)}>{messages.game.close}</button>
            </div>
            <MiniMap activeRoomId={activeRoomId} highlightRoomId={highlightRoomId} />
            {selectedRoom && (
              <div className="room-info-box">
                <h4>
                  <PixelIcon name={`evt-${selectedRoom.archetype === 'engineering' ? 'tech' : 'community'}`} size={10} />
                  {selectedRoom.name}
                </h4>
                <p className="room-type">{getArchetypeLabel(selectedRoom.archetype)}</p>
              </div>
            )}
            <GameLog history={gameState.history} />
          </div>
        </div>
      )}

      {showStats && (
        <div className="stats-overlay" onClick={() => setShowStats(false)}>
          <div className="stats-detail-panel" onClick={e => e.stopPropagation()}>
            <h3>{messages.game.companyStatus}</h3>
            <div className="stats-grid">
              <PixelStatBar label={getStatLabel('cash', 'upper')}       value={stats.cash}       max={50} color={PALETTE.cashGold}      danger={stats.cash <= 3}     icon="cash" />
              <PixelStatBar label={getStatLabel('revenue', 'upper')}    value={stats.revenue}    max={50} color={PALETTE.orange}                                      icon="revenue" />
              <PixelStatBar label={getStatLabel('community', 'upper')}  value={stats.community}  max={50} color={PALETTE.communityTeal} danger={stats.community <= 2} icon="community" />
              <PixelStatBar label={getStatLabel('growth', 'upper')}     value={stats.growth}     max={50} color={PALETTE.growthPink}                                  icon="growth" />
              <PixelStatBar label={getStatLabel('reputation', 'upper')} value={stats.reputation} max={50} color={PALETTE.accentGold}                                  icon="reputation" />
              <PixelStatBar label={getStatLabel('control', 'upper')}    value={stats.control}    max={50} color={PALETTE.engBlue}                                     icon="control" />
              <PixelStatBar label={getStatLabel('dev_speed', 'upper')}  value={stats.dev_speed}  max={50} color={PALETTE.engBlue}                                     icon="dev_speed" />
              <PixelStatBar label={getStatLabel('stability', 'upper')}  value={stats.stability}  max={50} color={PALETTE.healthGreen}                                 icon="stability" />
              <PixelStatBar label={getStatLabel('trust', 'upper')}      value={stats.trust}      max={50} color={PALETTE.communityTeal}                               icon="trust" />
              <PixelStatBar label={getStatLabel('pressure', 'upper')}   value={stats.pressure}   max={10} color={PALETTE.dangerRed}     danger={stats.pressure >= 7} icon="pressure" />
              <PixelStatBar label={getStatLabel('risk', 'upper')}       value={stats.risk}       max={10} color={PALETTE.dangerRed}     danger={stats.risk >= 7}      icon="risk" />
            </div>

            {/* Active effects list */}
            {gameState.activeEffects.length > 0 && (
              <div className="stats-active-effects">
                <h4>{messages.game.activeEffects}</h4>
                {gameState.activeEffects.map(e => (
                  <div key={e.id} className="active-effect-row">
                    <span className="effect-label">{getActiveEffectLabel(e.label) || messages.game.temporaryEffect}</span>
                    {e.remainingRounds > 0 && e.remainingRounds < 999 && (
                      <span className="effect-rounds">{messages.game.rounds(e.remainingRounds)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button className="pixel-btn" onClick={() => setShowStats(false)}>{messages.game.close} [S]</button>
          </div>
        </div>
      )}
    </div>
  )
}
