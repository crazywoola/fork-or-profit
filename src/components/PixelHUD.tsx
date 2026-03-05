import { PALETTE } from '../pixel/palette'
import { PixelIcon } from './PixelIcon'
import type { GameState } from '../engine/types'

type Props = {
  gameState: GameState
}

const PHASE_ICON: Record<string, string> = {
  event: 'phase-event',
  action: 'phase-action',
  resolution: 'phase-resolve',
}

const PHASE_LABEL: Record<string, string> = {
  event: 'EVENT',
  action: 'ACTION',
  resolution: 'RESOLVE',
}

export function PixelHUD({ gameState }: Props) {
  const { round, phase, actionPoints, maxActionPoints } = gameState

  return (
    <div className="pixel-hud">
      <div className="hud-top-bar">
        <div className="hud-round">
          <span className="hud-label">ROUND</span>
          <span className="hud-value">{round}</span>
        </div>
        <div className="hud-phase">
          <PixelIcon name={PHASE_ICON[phase] ?? 'phase-event'} size={12} />
          <span>{PHASE_LABEL[phase] ?? phase.toUpperCase()}</span>
        </div>
        <div className="hud-ap">
          <span className="hud-label">AP</span>
          <div className="hud-ap-gems">
            {Array.from({ length: maxActionPoints }).map((_, i) => (
              <PixelIcon
                key={i}
                name="ap-gem"
                size={12}
                color={i < actionPoints ? PALETTE.engBlue : PALETTE.textMuted}
                className={i < actionPoints ? 'ap-active' : 'ap-spent'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
