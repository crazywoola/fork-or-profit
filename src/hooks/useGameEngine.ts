import { useState, useRef, useCallback } from 'react'
import { GameEngine, type GameConfig } from '../engine/game'
import type { GameState } from '../engine/types'

export function useGameEngine() {
  const engineRef = useRef(new GameEngine())
  const [gameState, setGameState] = useState<GameState | null>(null)

  const syncState = useCallback(() => {
    const engine = engineRef.current
    setGameState({
      ...engine.state,
      stats: { ...engine.state.stats },
      hand: [...engine.state.hand],
      history: [...engine.state.history],
      effectMultipliers: { ...engine.state.effectMultipliers },
    })
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

  return { gameState, actions }
}
