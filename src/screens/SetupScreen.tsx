import { useState, useCallback, useEffect, useMemo } from 'react'
import { roles } from '../data/roles'
import { companyTemplates } from '../data/company-templates'
import { gameModes } from '../data/game'
import { STRATEGY_CARDS } from '../data/cards'
import { PALETTE } from '../pixel/palette'
import { PixelPortrait, CompanyPixelIcon, PixelIcon } from '../components/PixelIcon'
import { englishText, roleNameFromId, roleTitleFromId, titleFromId } from '../utils/english'
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

const MODE_ICONS: Record<string, string> = {
  survival:    '🛡',
  ipo:         '📈',
  legend:      '⭐',
  acquisition: '🤝',
  'open-core': '⚖',
}

const MODE_FALLBACK_NAMES: Record<string, string> = {
  survival: 'Survival',
  ipo: 'IPO',
  legend: 'OSS Legend',
  acquisition: 'Acquisition Exit',
  'open-core': 'Open Core',
}

const MODE_FALLBACK_GOALS: Record<string, string> = {
  survival: 'Keep both cash and community above 0 through Round 12.',
  ipo: 'Reach revenue >= 30 and reputation >= 15 by Round 20.',
  legend: 'Reach community >= 30 and growth >= 20 by Round 20.',
  acquisition: 'Trigger an acquisition and satisfy exit conditions.',
  'open-core': 'Reach community >= 15 and revenue >= 15 by Round 20.',
}

export function SetupScreen({ onConfirm }: Props) {
  const [roleIdx, setRoleIdx] = useState(0)
  const [templateIdx, setTemplateIdx] = useState(0)
  const [modeIdx, setModeIdx] = useState(0)
  const [companyName, setCompanyName] = useState(companyTemplates[0].name)
  const [activePanel, setActivePanel] = useState<'role' | 'company' | 'mode'>('role')

  const role = roles[roleIdx]
  const template = companyTemplates[templateIdx]
  const mode = gameModes[modeIdx]

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
    setModeIdx(Math.floor(Math.random() * gameModes.length))
  }, [handleRandomRole, handleRandomCompany])

  const handleConfirm = useCallback(() => {
    onConfirm({
      role,
      template,
      companyName: companyName.trim() || template.name,
      gameModeId: mode.id,
    })
  }, [role, template, companyName, mode, onConfirm])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (activePanel === 'role') {
          setRoleIdx(i => (i - 1 + roles.length) % roles.length)
        } else if (activePanel === 'company') {
          setTemplateIdx(i => (i - 1 + companyTemplates.length) % companyTemplates.length)
        } else {
          setModeIdx(i => (i - 1 + gameModes.length) % gameModes.length)
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (activePanel === 'role') {
          setRoleIdx(i => (i + 1) % roles.length)
        } else if (activePanel === 'company') {
          setTemplateIdx(i => (i + 1) % companyTemplates.length)
        } else {
          setModeIdx(i => (i + 1) % gameModes.length)
        }
      } else if (e.key === 'Tab') {
        e.preventDefault()
        setActivePanel(p => p === 'role' ? 'company' : p === 'company' ? 'mode' : 'role')
      } else if (e.key === 'Enter') {
        handleConfirm()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [activePanel, handleConfirm])

  const mods = template.modifiers
  const rb = role.statBonuses
  const baseStats = [
    { label: 'CASH',       value: 10 + (mods.cash ?? 0)       + (rb.cash ?? 0),       max: 50, color: PALETTE.cashGold },
    { label: 'COMMUNITY',  value: 5  + (mods.community ?? 0)  + (rb.community ?? 0),  max: 50, color: PALETTE.communityTeal },
    { label: 'GROWTH',     value: 3  + (mods.growth ?? 0)     + (rb.growth ?? 0),     max: 50, color: PALETTE.growthPink },
    { label: 'REPUTATION', value: 5  + (mods.reputation ?? 0) + (rb.reputation ?? 0), max: 50, color: PALETTE.accentGold },
    { label: 'REVENUE',    value: 0  + (mods.revenue ?? 0)    + (rb.revenue ?? 0),    max: 50, color: PALETTE.orange },
  ]

  const deckSize = useMemo(() => {
    const archetype = role.archetype
    const roleCardTitles = new Set(role.cards)
    return STRATEGY_CARDS.filter(
      c => c.core || c.archetypes?.includes(archetype) || roleCardTitles.has(c.title)
    ).length
  }, [role])

  const combinedMultipliers = useMemo(() => {
    const cats = ['Open Source', 'Monetization', 'Growth', 'Operations', 'Finance'] as const
    return cats
      .map(c => {
        const v = Math.round((role.effectMultipliers[c] ?? 1) * (template.effectMultipliers[c] ?? 1) * 100) / 100
        return { cat: c, val: v }
      })
      .filter(m => m.val !== 1)
  }, [role, template])

  return (
    <div className="screen setup-screen">
      <div className="setup-header">
        <h1>CHARACTER SELECT</h1>
        <p className="setup-hint">[Tab] Switch Panel · [←→] Change Option · [Enter] Start</p>
      </div>

      <div className="setup-panels">
        {/* ── Role ── */}
        <div className={`setup-panel ${activePanel === 'role' ? 'active' : ''}`} onClick={() => setActivePanel('role')}>
          <h2>ROLE</h2>
          <div className="setup-selector">
            <button className="arrow-btn" onClick={(e) => { e.stopPropagation(); setRoleIdx(i => (i - 1 + roles.length) % roles.length) }}>
              <PixelIcon name="arrow-left" size={14} />
            </button>
            <div className="setup-entity">
              <PixelPortrait archetype={role.archetype} size={80} />
              <h3>{englishText(role.name, roleNameFromId(role.id))}</h3>
              <p className="role-title">{englishText(role.title, roleTitleFromId(role.id))}</p>
            </div>
            <button className="arrow-btn" onClick={(e) => { e.stopPropagation(); setRoleIdx(i => (i + 1) % roles.length) }}>
              <PixelIcon name="arrow-right" size={14} />
            </button>
          </div>
          <p className="role-focus">{englishText(role.focus, 'Lead your team through strategic trade-offs.')}</p>
          <div className="role-perks">
            {role.perks.slice(0, 3).map((p, i) => (
              <span key={i} className="perk-chip">
                <PixelIcon name="star" size={8} color={PALETTE.accentGold} /> {englishText(p, `Perk ${i + 1}`)}
              </span>
            ))}
          </div>
          <button className="pixel-btn" onClick={handleRandomRole}>
            <PixelIcon name="dice" size={10} /> RANDOM
          </button>
        </div>

        <div className="setup-divider"><span>×</span></div>

        {/* ── Company ── */}
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
              <h3>{englishText(template.name, titleFromId(template.id))}</h3>
              <p className="role-title">{englishText(template.phase, 'Growth Stage')}</p>
            </div>
            <button className="arrow-btn" onClick={(e) => {
              e.stopPropagation()
              setTemplateIdx(i => (i + 1) % companyTemplates.length)
            }}>
              <PixelIcon name="arrow-right" size={14} />
            </button>
          </div>
          <p className="role-focus">{englishText(template.summary, 'A distinct company archetype with different trade-offs.')}</p>
          <div className="setup-stats-preview">
            {baseStats.map(s => <StatPreview key={s.label} {...s} />)}
          </div>
          <div className="setup-deck-info">
            <span className="deck-count">{deckSize} cards in deck</span>
            {combinedMultipliers.length > 0 && (
              <div className="deck-multipliers">
                {combinedMultipliers.map(m => (
                  <span key={m.cat} className={`mult-chip ${m.val > 1 ? 'boost' : 'penalty'}`}>
                    {m.cat}: x{m.val}
                  </span>
                ))}
              </div>
            )}
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

        <div className="setup-divider"><span>×</span></div>

        {/* ── Game Mode ── */}
        <div
          className={`setup-panel mode-panel ${activePanel === 'mode' ? 'active' : ''}`}
          onClick={() => setActivePanel('mode')}
        >
          <h2>GAME MODE</h2>
          <div className="setup-selector">
            <button className="arrow-btn" onClick={(e) => {
              e.stopPropagation()
              setModeIdx(i => (i - 1 + gameModes.length) % gameModes.length)
            }}>
              <PixelIcon name="arrow-left" size={14} />
            </button>
            <div className="setup-entity">
              <div className="mode-icon-large">{MODE_ICONS[mode.id] ?? '?'}</div>
              <h3>{englishText(mode.name, MODE_FALLBACK_NAMES[mode.id] ?? titleFromId(mode.id))}</h3>
            </div>
            <button className="arrow-btn" onClick={(e) => {
              e.stopPropagation()
              setModeIdx(i => (i + 1) % gameModes.length)
            }}>
              <PixelIcon name="arrow-right" size={14} />
            </button>
          </div>

          <div className="mode-goal-box">
            <span className="mode-goal-label">Victory Goal</span>
            <p className="mode-goal-text">{englishText(mode.goal, MODE_FALLBACK_GOALS[mode.id] ?? 'Complete your strategic objective before time runs out.')}</p>
          </div>

          <div className="mode-all-list">
            {gameModes.map((m, i) => (
              <div
                key={m.id}
                className={`mode-item ${i === modeIdx ? 'selected' : ''}`}
                onClick={(e) => { e.stopPropagation(); setModeIdx(i) }}
              >
                <span className="mode-item-icon">{MODE_ICONS[m.id] ?? '?'}</span>
                <span className="mode-item-name">{englishText(m.name, MODE_FALLBACK_NAMES[m.id] ?? titleFromId(m.id))}</span>
              </div>
            ))}
          </div>
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
