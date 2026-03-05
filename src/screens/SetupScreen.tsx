import { useState, useCallback, useEffect, useMemo } from 'react'
import { roles } from '../data/roles'
import { companyTemplates } from '../data/company-templates'
import { gameModes, organizations } from '../data/game'
import { STRATEGY_CARDS } from '../data/cards'
import { PALETTE } from '../pixel/palette'
import { PixelPortrait, CompanyPixelIcon, PixelIcon } from '../components/PixelIcon'
import { englishText, roleNameFromId, roleTitleFromId, titleFromId } from '../utils/english'
import type { GameSetup } from '../App'

type Props = { onConfirm: (setup: GameSetup) => void }

const RECOMMENDED_COMBOS: Record<string, string[]> = {
  mongodb: ['ipo', 'open-core'],
  redis: ['open-core', 'survival'],
  redhat: ['acquisition', 'survival'],
  dify: ['open-core', 'ipo'],
}

const BEGINNER_ROLES = new Set(['ceo', 'cto', 'pm'])
const BEGINNER_TEMPLATES = new Set(['mongodb', 'redis', 'dify'])

const STAT_TOOLTIPS: Record<string, string> = {
  CASH: 'Money in the bank. Reach 0 and the company dies.',
  COMMUNITY: 'Open-source community strength. Reach 0 and the project dies.',
  GROWTH: 'User adoption momentum. Needed for Legend mode.',
  REPUTATION: 'Brand trust with customers. Needed for IPO mode.',
  REVENUE: 'Monthly income. Offsets burn rate each round.',
}

const namePrefixes = ['Aurora', 'Nimbus', 'Vertex', 'Pulse', 'Atlas', 'Nova', 'Cobalt', 'Lattice']
const nameSuffixes = ['Labs', 'Works', 'Cloud', 'Systems', 'Studio', 'Forge', 'Core', 'Dynamics']

function randomName() {
  const p = namePrefixes[Math.floor(Math.random() * namePrefixes.length)]
  const s = nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)]
  return `${p} ${s}`
}

function StatPreview({ label, value, max, color, tooltip, onHover, onLeave }: {
  label: string; value: number; max: number; color: string;
  tooltip?: string; onHover?: (label: string) => void; onLeave?: () => void;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      className="setup-stat-row"
      onMouseEnter={() => onHover?.(label)}
      onMouseLeave={onLeave}
      title={tooltip}
    >
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
  const [orgIdx, setOrgIdx] = useState(0)
  const [companyName, setCompanyName] = useState(companyTemplates[0].name)
  const [activePanel, setActivePanel] = useState<'role' | 'company' | 'mode'>('role')
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  const role = roles[roleIdx]
  const template = companyTemplates[templateIdx]
  const mode = gameModes[modeIdx]
  const org = organizations[orgIdx]

  const isRecommendedCombo = useMemo(() => {
    const combos = RECOMMENDED_COMBOS[template.id]
    return combos?.includes(mode.id) ?? false
  }, [template.id, mode.id])

  const handleQuickStart = useCallback(() => {
    const mongoIdx = companyTemplates.findIndex(t => t.id === 'mongodb')
    const ceoIdx = roles.findIndex(r => r.id === 'ceo')
    const survivalIdx = gameModes.findIndex(m => m.id === 'survival')
    if (mongoIdx >= 0) setTemplateIdx(mongoIdx)
    if (ceoIdx >= 0) setRoleIdx(ceoIdx)
    if (survivalIdx >= 0) setModeIdx(survivalIdx)
    setCompanyName('Nova Systems')
    onConfirm({
      role: roles[ceoIdx >= 0 ? ceoIdx : 0],
      template: companyTemplates[mongoIdx >= 0 ? mongoIdx : 0],
      companyName: 'Nova Systems',
      gameModeId: gameModes[survivalIdx >= 0 ? survivalIdx : 0].id,
      organizationId: 'flat',
    })
  }, [onConfirm])

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
    setOrgIdx(Math.floor(Math.random() * organizations.length))
  }, [handleRandomRole, handleRandomCompany])

  const handleConfirm = useCallback(() => {
    onConfirm({
      role,
      template,
      companyName: companyName.trim() || template.name,
      gameModeId: mode.id,
      organizationId: org.id,
    })
  }, [role, template, companyName, mode, org, onConfirm])

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
          {BEGINNER_ROLES.has(role.id) && <span className="recommended-badge">BEGINNER</span>}
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
          {BEGINNER_TEMPLATES.has(template.id) && <span className="recommended-badge">RECOMMENDED</span>}
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
            {baseStats.map(s => (
              <StatPreview
                key={s.label}
                {...s}
                tooltip={STAT_TOOLTIPS[s.label]}
                onHover={setHoveredStat}
                onLeave={() => setHoveredStat(null)}
              />
            ))}
            {hoveredStat && STAT_TOOLTIPS[hoveredStat] && (
              <div className="stat-tooltip-inline">{STAT_TOOLTIPS[hoveredStat]}</div>
            )}
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

          <div className="org-selector">
            <span className="org-selector-label">ORGANIZATION</span>
            <div className="org-selector-list">
              {organizations.map((o, i) => (
                <div
                  key={o.id}
                  className={`mode-item ${i === orgIdx ? 'selected' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setOrgIdx(i) }}
                >
                  <span className="mode-item-name">{o.name}</span>
                </div>
              ))}
            </div>
            <div className="org-rule-box">
              <span className="org-rule-label">Rule</span>
              <p className="org-rule-text">{org.specialRule}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="setup-footer">
        <button className="pixel-btn" onClick={handleQuickStart}>
          <PixelIcon name="play" size={10} /> QUICK START
        </button>
        <button className="pixel-btn" onClick={handleRandomAll}>
          <PixelIcon name="dice" size={10} /> RANDOM ALL
        </button>
        <button className="pixel-btn primary" onClick={handleConfirm}>
          <PixelIcon name="play" size={10} /> START GAME
        </button>
        {isRecommendedCombo && (
          <span className="recommended-combo-hint">Good combo for this archetype!</span>
        )}
      </div>
    </div>
  )
}
