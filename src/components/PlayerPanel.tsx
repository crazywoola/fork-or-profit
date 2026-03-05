import { PixelPortrait, CompanyPixelIcon, PixelIcon } from './PixelIcon'
import { ARCHETYPE_COLORS, PALETTE } from '../pixel/palette'
import { englishText, titleFromId } from '../utils/english'
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
          <span className="player-role-name">{englishText(role.name, titleFromId(role.id))}</span>
          <span className="player-role-title">{englishText(role.title, 'Leadership Role')}</span>
          <span className="player-archetype-badge" style={{ borderColor: archColor, color: archColor }}>
            {role.archetype}
          </span>
        </div>
      </div>
      <div className="player-perks">
        {role.perks.slice(0, 2).map((p, i) => (
          <span key={i} className="player-perk">
            <PixelIcon name="star" size={8} color={PALETTE.accentGold} />
            {englishText(p, `Perk ${i + 1}`)}
          </span>
        ))}
      </div>
      <div className="player-company">
        <CompanyPixelIcon templateId={template.id} size={24} />
        <div className="player-company-info">
          <span className="player-company-name">{companyName}</span>
          <span className="player-company-route">{englishText(template.recommendedRoute, 'Balanced route')}</span>
        </div>
      </div>
    </div>
  )
}
