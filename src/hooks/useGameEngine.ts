import { useState, useRef, useCallback } from 'react'
import { GameEngine, type GameConfig } from '../engine/game'
import type { GameState } from '../engine/types'

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
    })
  }, [])

  /** Check if the card in the current hand is playable. Reads live engine state. */
  const canPlayCard = useCallback((cardId: string): boolean => {
    return engineRef.current.canPlayCard(cardId)
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
    restart: (config?: GameConfig) => {
      engineRef.current = new GameEngine(config)
      syncState()
    },
  }

  return { gameState, canPlayCard, actions }
}
