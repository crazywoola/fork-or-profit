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
import type { GameSetup } from '../App'
import type { GameState } from '../engine/types'

type Props = {
  setup: GameSetup
  gameState: GameState
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

function eventToRoomId(category: string): string {
  switch (category) {
    case 'Tech': return 'eng'
    case 'Community': return 'community'
    case 'Market': return 'revenue'
    case 'Competition': return 'product'
    case 'Ecosystem': return 'platform'
    case 'Media': return 'growth'
    case 'Regulation': return 'finance'
    default: return 'hq'
  }
}

export function GameScreen({ setup, gameState, actions, onGameOver, onNewGame }: Props) {
  const [activeRoomId, setActiveRoomId] = useState('hq')
  const [showStats, setShowStats] = useState(false)

  const { phase, activeEvent, hand, actionPoints, maxActionPoints, stats } = gameState

  const highlightRoomId = useMemo(() => {
    if (phase === 'event' && activeEvent) {
      return eventToRoomId(activeEvent.category)
    }
    return ''
  }, [phase, activeEvent])

  useEffect(() => {
    if (phase === 'resolution') {
      if (stats.cash <= 0 || stats.community <= 0) {
        onGameOver('lose')
      }
    }
  }, [phase, stats.cash, stats.community, onGameOver])

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 's' || e.key === 'S') {
        if (phase !== 'event') setShowStats(v => !v)
      } else if (e.key === 'Escape') {
        setShowStats(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase])

  return (
    <div className="screen game-screen">
      <div className="game-hud-left">
        <PixelHUD gameState={gameState} />
        <PlayerPanel
          role={setup.role}
          template={setup.template}
          companyName={setup.companyName}
        />
        <div className="hud-stats-section">
          <PixelStatBar label="CASH" value={stats.cash} max={50} color={PALETTE.cashGold} danger={stats.cash <= 3} icon="cash" />
          <PixelStatBar label="GROWTH" value={stats.growth} max={50} color={PALETTE.growthPink} compact icon="growth" />
          <PixelStatBar label="COMMUNITY" value={stats.community} max={50} color={PALETTE.communityTeal} danger={stats.community <= 2} compact icon="community" />
          <PixelStatBar label="REVENUE" value={stats.revenue} max={50} color={PALETTE.orange} compact icon="revenue" />
          <PixelStatBar label="REPUTATION" value={stats.reputation} max={50} color={PALETTE.accentGold} compact icon="reputation" />
          <PixelStatBar label="PRESSURE" value={stats.pressure} max={10} color={PALETTE.dangerRed} danger={stats.pressure >= 7} compact icon="pressure" />
          <PixelStatBar label="RISK" value={stats.risk} max={10} color={PALETTE.dangerRed} danger={stats.risk >= 7} compact icon="risk" />
        </div>
        <div className="hud-shortcuts">
          <span>[S] Stats</span>
        </div>
      </div>

      <div className="game-center">
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
              onPlayCard={handlePlayCard}
              onEndTurn={handleEndTurn}
            />
          )}
        </div>
      </div>

      <div className="game-hud-right">
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

      {showStats && (
        <div className="stats-overlay" onClick={() => setShowStats(false)}>
          <div className="stats-detail-panel" onClick={e => e.stopPropagation()}>
            <h3>COMPANY STATUS</h3>
            <div className="stats-grid">
              <PixelStatBar label="CASH" value={stats.cash} max={50} color={PALETTE.cashGold} danger={stats.cash <= 3} icon="cash" />
              <PixelStatBar label="REVENUE" value={stats.revenue} max={50} color={PALETTE.orange} icon="revenue" />
              <PixelStatBar label="COMMUNITY" value={stats.community} max={50} color={PALETTE.communityTeal} danger={stats.community <= 2} icon="community" />
              <PixelStatBar label="GROWTH" value={stats.growth} max={50} color={PALETTE.growthPink} icon="growth" />
              <PixelStatBar label="REPUTATION" value={stats.reputation} max={50} color={PALETTE.accentGold} icon="reputation" />
              <PixelStatBar label="CONTROL" value={stats.control} max={50} color={PALETTE.engBlue} icon="control" />
              <PixelStatBar label="DEV SPEED" value={stats.dev_speed} max={50} color={PALETTE.engBlue} icon="dev_speed" />
              <PixelStatBar label="STABILITY" value={stats.stability} max={50} color={PALETTE.healthGreen} icon="stability" />
              <PixelStatBar label="TRUST" value={stats.trust} max={50} color={PALETTE.communityTeal} icon="trust" />
              <PixelStatBar label="PRESSURE" value={stats.pressure} max={10} color={PALETTE.dangerRed} danger={stats.pressure >= 7} icon="pressure" />
              <PixelStatBar label="RISK" value={stats.risk} max={10} color={PALETTE.dangerRed} danger={stats.risk >= 7} icon="risk" />
            </div>
            <button className="pixel-btn" onClick={() => setShowStats(false)}>CLOSE [S]</button>
          </div>
        </div>
      )}
    </div>
  )
}
