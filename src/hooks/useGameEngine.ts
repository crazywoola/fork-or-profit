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
      history: [...s.history],
      effectMultipliers: { ...s.effectMultipliers },
      activeEffects: [...s.activeEffects],
      playedCardIds: [...s.playedCardIds],
      usedEventIds: [...s.usedEventIds],
      cardsPlayedThisRound: [...s.cardsPlayedThisRound],
      previousRoundStats: s.previousRoundStats ? { ...s.previousRoundStats } : null,
      roundSummary: s.roundSummary ? { ...s.roundSummary } : null,
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
