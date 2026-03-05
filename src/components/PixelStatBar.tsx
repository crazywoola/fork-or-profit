import { PALETTE } from '../pixel/palette'
import { PixelIcon } from './PixelIcon'

type Props = {
  label: string
  value: number
  max: number
  color?: string
  danger?: boolean
  compact?: boolean
  icon?: string
}

export function PixelStatBar({ label, value, max, color = PALETTE.healthGreen, danger, compact, icon }: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const displayColor = danger ? PALETTE.dangerRed : color

  return (
    <div className={`px-stat ${compact ? 'compact' : ''} ${danger ? 'danger' : ''}`}>
      <div className="px-stat-header">
        <span className="px-stat-label">
          {icon && <PixelIcon name={icon} size={compact ? 8 : 10} color={displayColor} />}
          {label}
        </span>
        <span className="px-stat-value">{value}/{max}</span>
      </div>
      <div className="px-stat-track">
        <div
          className="px-stat-fill"
          style={{ width: `${pct}%`, backgroundColor: displayColor }}
        />
      </div>
    </div>
  )
}
