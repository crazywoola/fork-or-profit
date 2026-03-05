import { PixelPortrait, CompanyPixelIcon, PixelIcon } from './PixelIcon'
import { ARCHETYPE_COLORS, PALETTE } from '../pixel/palette'
import type { RoleProfile } from '../data/roles'
import type { CompanyTemplate } from '../data/company-templates'

type Props = {
  role: RoleProfile
  template: CompanyTemplate
  companyName: string
}

export function PlayerPanel({ role, template, companyName }: Props) {
  const archColor = ARCHETYPE_COLORS[role.archetype] ?? PALETTE.textDim

  return (
    <div className="player-panel">
      <div className="player-role">
        <PixelPortrait archetype={role.archetype} size={40} />
        <div className="player-role-info">
          <span className="player-role-name">{role.name}</span>
          <span className="player-role-title">{role.title}</span>
          <span className="player-archetype-badge" style={{ borderColor: archColor, color: archColor }}>
            {role.archetype}
          </span>
        </div>
      </div>
      <div className="player-perks">
        {role.perks.slice(0, 2).map((p, i) => (
          <span key={i} className="player-perk">
            <PixelIcon name="star" size={8} color={PALETTE.accentGold} />
            {p}
          </span>
        ))}
      </div>
      <div className="player-company">
        <CompanyPixelIcon templateId={template.id} size={24} />
        <div className="player-company-info">
          <span className="player-company-name">{companyName}</span>
          <span className="player-company-route">{template.recommendedRoute}</span>
        </div>
      </div>
    </div>
  )
}
