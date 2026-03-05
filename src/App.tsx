import { useState, useCallback } from 'react'
import { TitleScreen } from './screens/TitleScreen'
import { SetupScreen } from './screens/SetupScreen'
import { GameScreen } from './screens/GameScreen'
import { GameOverScreen } from './screens/GameOverScreen'
import { useGameEngine } from './hooks/useGameEngine'
import { isMuted, setMuted } from './audio/sfx'
import type { CompanyTemplate } from './data/company-templates'
import type { RoleProfile } from './data/roles'

type Screen = 'title' | 'setup' | 'game' | 'gameover'

export type GameSetup = {
  role: RoleProfile
  template: CompanyTemplate
  companyName: string
  gameModeId: string
  organizationId: string
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('title')
  const [setup, setSetup] = useState<GameSetup | null>(null)
  const [gameResult, setGameResult] = useState<'win' | 'lose'>('lose')
  const [audioMuted, setAudioMuted] = useState(false)

  const toggleAudio = useCallback(() => {
    const next = !audioMuted
    setAudioMuted(next)
    setMuted(next)
  }, [audioMuted])
  const { gameState, canPlayCard, previewCard, getRunway, actions } = useGameEngine()

  const handleStartPress = useCallback(() => {
    setScreen('setup')
  }, [])

  const handleSetupConfirm = useCallback((s: GameSetup) => {
    setSetup(s)
    actions.restart({ role: s.role, template: s.template, gameModeId: s.gameModeId, organizationId: s.organizationId })
    actions.startRound()
    setScreen('game')
  }, [actions])

  const handleGameOver = useCallback((result: 'win' | 'lose') => {
    setGameResult(result)
    setScreen('gameover')
  }, [])

  const handleRestart = useCallback(() => {
    setScreen('title')
    setSetup(null)
  }, [])

  const handleNewGame = useCallback(() => {
    setScreen('setup')
  }, [])

  return (
    <div className="game-root">
      <button className="audio-toggle" onClick={toggleAudio}>
        {audioMuted ? 'SOUND OFF' : 'SOUND ON'}
      </button>
      {screen === 'title' && (
        <TitleScreen onStart={handleStartPress} />
      )}
      {screen === 'setup' && (
        <SetupScreen onConfirm={handleSetupConfirm} />
      )}
      {screen === 'game' && setup && gameState && (
        <GameScreen
          setup={setup}
          gameState={gameState}
          canPlayCard={canPlayCard}
          previewCard={previewCard}
          getRunway={getRunway}
          actions={actions}
          onGameOver={handleGameOver}
          onNewGame={handleNewGame}
        />
      )}
      {screen === 'gameover' && (
        <GameOverScreen
          result={gameResult}
          gameState={gameState}
          onRestart={handleRestart}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  )
}
