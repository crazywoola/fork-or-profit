import { useState, useRef, useCallback } from 'react'
import { GameEngine, type GameConfig } from '../engine/game'
import type { GameState, CardPreview } from '../engine/types'

export function useGameEngine() {
  const engineRef = useRef(new GameEngine())
  const [gameState, setGameState] = useState<GameState | null>(null)

  const syncState = useCallback(() => {
    const s = engineRef.current.state
    setGameState({
      ...s,
      stats: { ...s.stats },
      hand: [...s.hand],
      deck: [...s.deck],
      discardPile: [...s.discardPile],
      history: [...s.history],
      effectMultipliers: { ...s.effectMultipliers },
      activeEffects: s.activeEffects.map(effect => ({ ...effect })),
      playedCardIds: [...s.playedCardIds],
      usedEventIds: [...s.usedEventIds],
      cardsPlayedThisRound: [...s.cardsPlayedThisRound],
      previousRoundStats: s.previousRoundStats ? { ...s.previousRoundStats } : null,
      roundSummary: s.roundSummary
        ? {
            ...s.roundSummary,
            statDeltas: { ...s.roundSummary.statDeltas },
            previousStats: { ...s.roundSummary.previousStats },
            expiredEffects: [...s.roundSummary.expiredEffects],
            newEffects: [...s.roundSummary.newEffects],
            pendingThreats: [...s.roundSummary.pendingThreats],
          }
        : null,
      worldFlags: [...s.worldFlags],
      resolvedChains: [...s.resolvedChains],
      factionReputation: { ...s.factionReputation },
      roomBonus: s.roomBonus
        ? {
            ...s.roomBonus,
            categoryBoosts: { ...s.roomBonus.categoryBoosts },
            immediateEffect: s.roomBonus.immediateEffect ? { ...s.roomBonus.immediateEffect } : undefined,
            nextEventWeights: s.roomBonus.nextEventWeights ? { ...s.roomBonus.nextEventWeights } : undefined,
            synergyBoost: s.roomBonus.synergyBoost ? { ...s.roomBonus.synergyBoost } : undefined,
            factionShift: s.roomBonus.factionShift ? { ...s.roomBonus.factionShift } : undefined,
          }
        : null,
      progressionSelections: [...s.progressionSelections],
      stageMilestones: [...s.stageMilestones],
      pendingThreats: [...s.pendingThreats],
    })
  }, [])

  const canPlayCard = useCallback((cardId: string): boolean => {
    return engineRef.current.canPlayCard(cardId)
  }, [])

  const previewCard = useCallback((cardId: string): CardPreview | null => {
    return engineRef.current.previewCardEffect(cardId)
  }, [])

  const getRunway = useCallback((): number => {
    return engineRef.current.getRunwayRounds()
  }, [])

  const actions = {
    startRound: () => {
      engineRef.current.startRound()
      syncState()
    },
    resolveEvent: (optionIndex: number) => {
      engineRef.current.resolveEvent(optionIndex)
      syncState()
    },
    playCard: (cardId: string) => {
      engineRef.current.playCard(cardId)
      syncState()
    },
    chooseRoom: (roomId: string) => {
      engineRef.current.chooseRoom(roomId)
      syncState()
    },
    endTurn: () => {
      engineRef.current.endTurn()
      syncState()
    },
    advanceSummary: () => {
      engineRef.current.advanceFromSummary()
      syncState()
    },
    restart: (config?: GameConfig) => {
      engineRef.current = new GameEngine(config)
      syncState()
    },
  }

  return { gameState, canPlayCard, previewCard, getRunway, actions }
}
