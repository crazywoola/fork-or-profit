import { useState, useCallback, useEffect } from 'react'
import { roles } from '../data/roles'
import { companyTemplates } from '../data/company-templates'
import { PALETTE } from '../pixel/palette'
import { PixelPortrait, CompanyPixelIcon, PixelIcon } from '../components/PixelIcon'
import type { GameSetup } from '../App'

type Props = { onConfirm: (setup: GameSetup) => void }

const namePrefixes = ['Aurora', 'Nimbus', 'Vertex', 'Pulse', 'Atlas', 'Nova', 'Cobalt', 'Lattice']
const nameSuffixes = ['Labs', 'Works', 'Cloud', 'Systems', 'Studio', 'Forge', 'Core', 'Dynamics']

function randomName() {
  const p = namePrefixes[Math.floor(Math.random() * namePrefixes.length)]
  const s = nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)]
  return `${p} ${s}`
}

function StatPreview({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className="setup-stat-row">
      <span className="setup-stat-label">{label}</span>
      <div className="setup-stat-track">
        <div className="setup-stat-fill" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="setup-stat-val">{value}</span>
    </div>
  )
}

export function SetupScreen({ onConfirm }: Props) {
  const [roleIdx, setRoleIdx] = useState(0)
  const [templateIdx, setTemplateIdx] = useState(0)
  const [companyName, setCompanyName] = useState(companyTemplates[0].name)
  const [activePanel, setActivePanel] = useState<'role' | 'company'>('role')

  const role = roles[roleIdx]
  const template = companyTemplates[templateIdx]

  const handleRandomRole = useCallback(() => {
    setRoleIdx(Math.floor(Math.random() * roles.length))
  }, [])

  const handleRandomCompany = useCallback(() => {
    const idx = Math.floor(Math.random() * companyTemplates.length)
    setTemplateIdx(idx)
    setCompanyName(randomName())
  }, [])

  const handleRandomAll = useCallback(() => {
    handleRandomRole()
    handleRandomCompany()
  }, [handleRandomRole, handleRandomCompany])

  const handleConfirm = useCallback(() => {
    onConfirm({
      role,
      template,
      companyName: companyName.trim() || template.name,
    })
  }, [role, template, companyName, onConfirm])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (activePanel === 'role') {
          setRoleIdx(i => (i - 1 + roles.length) % roles.length)
        } else {
          setTemplateIdx(i => (i - 1 + companyTemplates.length) % companyTemplates.length)
        }
      } else if (e.key === 'ArrowRight') {
        if (activePanel === 'role') {
          setRoleIdx(i => (i + 1) % roles.length)
        } else {
          const idx = (templateIdx + 1) % companyTemplates.length
          setTemplateIdx(idx)
        }
      } else if (e.key === 'Tab') {
        e.preventDefault()
        setActivePanel(p => p === 'role' ? 'company' : 'role')
      } else if (e.key === 'Enter') {
        handleConfirm()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activePanel, templateIdx, handleConfirm])

  const mods = template.modifiers
  const baseStats = [
    { label: 'CASH', value: 10 + (mods.cash ?? 0), max: 50, color: PALETTE.cashGold },
    { label: 'COMMUNITY', value: 5 + (mods.community ?? 0), max: 50, color: PALETTE.communityTeal },
    { label: 'GROWTH', value: 3 + (mods.growth ?? 0), max: 50, color: PALETTE.growthPink },
    { label: 'REPUTATION', value: 5 + (mods.reputation ?? 0), max: 50, color: PALETTE.accentGold },
    { label: 'REVENUE', value: 0 + (mods.revenue ?? 0), max: 50, color: PALETTE.orange },
  ]

  return (
    <div className="screen setup-screen">
      <div className="setup-header">
        <h1>CHARACTER SELECT</h1>
        <p className="setup-hint">Choose your role and company archetype</p>
      </div>

      <div className="setup-panels">
        <div className={`setup-panel ${activePanel === 'role' ? 'active' : ''}`} onClick={() => setActivePanel('role')}>
          <h2>ROLE</h2>
          <div className="setup-selector">
            <button className="arrow-btn" onClick={(e) => { e.stopPropagation(); setRoleIdx(i => (i - 1 + roles.length) % roles.length) }}>
              <PixelIcon name="arrow-left" size={14} />
            </button>
            <div className="setup-entity">
              <PixelPortrait archetype={role.archetype} size={80} />
              <h3>{role.name}</h3>
              <p className="role-title">{role.title}</p>
            </div>
            <button className="arrow-btn" onClick={(e) => { e.stopPropagation(); setRoleIdx(i => (i + 1) % roles.length) }}>
              <PixelIcon name="arrow-right" size={14} />
            </button>
          </div>
          <p className="role-focus">{role.focus}</p>
          <div className="role-perks">
            {role.perks.slice(0, 3).map((p, i) => (
              <span key={i} className="perk-chip">
                <PixelIcon name="star" size={8} color={PALETTE.accentGold} /> {p}
              </span>
            ))}
          </div>
          <button className="pixel-btn" onClick={handleRandomRole}>
            <PixelIcon name="dice" size={10} /> RANDOM
          </button>
        </div>

        <div className="setup-divider">
          <span>VS</span>
        </div>

        <div className={`setup-panel ${activePanel === 'company' ? 'active' : ''}`} onClick={() => setActivePanel('company')}>
          <h2>COMPANY</h2>
          <div className="setup-selector">
            <button className="arrow-btn" onClick={(e) => {
              e.stopPropagation()
              setTemplateIdx(i => (i - 1 + companyTemplates.length) % companyTemplates.length)
            }}>
              <PixelIcon name="arrow-left" size={14} />
            </button>
            <div className="setup-entity">
              <div className="company-icon-wrap">
                <CompanyPixelIcon templateId={template.id} size={48} />
              </div>
              <h3>{template.name}</h3>
              <p className="role-title">{template.phase}</p>
            </div>
            <button className="arrow-btn" onClick={(e) => {
              e.stopPropagation()
              setTemplateIdx(i => (i + 1) % companyTemplates.length)
            }}>
              <PixelIcon name="arrow-right" size={14} />
            </button>
          </div>
          <p className="role-focus">{template.summary}</p>
          <div className="setup-stats-preview">
            {baseStats.map(s => (
              <StatPreview key={s.label} {...s} />
            ))}
          </div>
          <div className="setup-name-input">
            <label>NAME:</label>
            <input
              type="text"
              value={companyName}
              maxLength={24}
              onChange={e => setCompanyName(e.target.value)}
              placeholder="Company name..."
            />
          </div>
          <button className="pixel-btn" onClick={handleRandomCompany}>
            <PixelIcon name="dice" size={10} /> RANDOM
          </button>
        </div>
      </div>

      <div className="setup-footer">
        <button className="pixel-btn" onClick={handleRandomAll}>
          <PixelIcon name="dice" size={10} /> RANDOM ALL
        </button>
        <button className="pixel-btn primary" onClick={handleConfirm}>
          <PixelIcon name="play" size={10} /> START GAME
        </button>
      </div>
    </div>
  )
}
