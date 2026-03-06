import { useState, useCallback, useEffect, useMemo } from 'react'
import { roles } from '../data/roles'
import { companyTemplates } from '../data/company-templates'
import { gameModes, organizations } from '../data/game'
import { STRATEGY_CARDS } from '../data/cards'
import { PALETTE } from '../pixel/palette'
import { PixelPortrait, CompanyPixelIcon, PixelIcon } from '../components/PixelIcon'
import {
  getModeGoal,
  getModeName,
  getRoleFocus,
  getRoleName,
  getRolePerk,
  getRoleTitle,
  getStatLabel,
  getTemplateSummary,
} from '../i18n/content'
import { titleFromId } from '../utils/english'
import { useI18n } from '../i18n'
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

const namePrefixes = ['Aurora', 'Nimbus', 'Vertex', 'Pulse', 'Atlas', 'Nova', 'Cobalt', 'Lattice']
const nameSuffixes = ['Labs', 'Works', 'Cloud', 'Systems', 'Studio', 'Forge', 'Core', 'Dynamics']

function randomName() {
  const p = namePrefixes[Math.floor(Math.random() * namePrefixes.length)]
  const s = nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)]
  return `${p} ${s}`
}

function StatPreview({ statId, label, value, max, color, tooltip, onHover, onLeave }: {
  statId: string; label: string; value: number; max: number; color: string;
  tooltip?: string; onHover?: (statId: string) => void; onLeave?: () => void;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      className="setup-stat-row"
      onMouseEnter={() => onHover?.(statId)}
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

export function SetupScreen({ onConfirm }: Props) {
  const { messages } = useI18n()
  const [initialSelection] = useState(() => {
    const roleIdx = Math.floor(Math.random() * roles.length)
    const templateIdx = Math.floor(Math.random() * companyTemplates.length)
    return {
      roleIdx,
      templateIdx,
      modeIdx: 0,
      orgIdx: 0,
      companyName: randomName(),
    }
  })

  const [roleIdx, setRoleIdx] = useState(initialSelection.roleIdx)
  const [templateIdx, setTemplateIdx] = useState(initialSelection.templateIdx)
  const [modeIdx, setModeIdx] = useState(initialSelection.modeIdx)
  const [orgIdx, setOrgIdx] = useState(initialSelection.orgIdx)
  const [companyName, setCompanyName] = useState(initialSelection.companyName)
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
    { statId: 'cash',       value: 10 + (mods.cash ?? 0)       + (rb.cash ?? 0),       max: 50, color: PALETTE.cashGold },
    { statId: 'community',  value: 5  + (mods.community ?? 0)  + (rb.community ?? 0),  max: 50, color: PALETTE.communityTeal },
    { statId: 'growth',     value: 3  + (mods.growth ?? 0)     + (rb.growth ?? 0),     max: 50, color: PALETTE.growthPink },
    { statId: 'reputation', value: 5  + (mods.reputation ?? 0) + (rb.reputation ?? 0), max: 50, color: PALETTE.accentGold },
    { statId: 'revenue',    value: 0  + (mods.revenue ?? 0)    + (rb.revenue ?? 0),    max: 50, color: PALETTE.orange },
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
        <h1>{messages.setup.title}</h1>
        <p className="setup-hint">{messages.setup.hint}</p>
      </div>

      <div className="setup-panels">
        {/* ── Role ── */}
        <div className={`setup-panel ${activePanel === 'role' ? 'active' : ''}`} onClick={() => setActivePanel('role')}>
          {BEGINNER_ROLES.has(role.id) && <span className="recommended-badge">{messages.setup.beginner}</span>}
          <h2>{messages.setup.role}</h2>
          <div className="setup-selector">
            <button className="arrow-btn" onClick={(e) => { e.stopPropagation(); setRoleIdx(i => (i - 1 + roles.length) % roles.length) }}>
              <PixelIcon name="arrow-left" size={14} />
            </button>
            <div className="setup-entity">
              <PixelPortrait archetype={role.archetype} size={80} />
              <h3>{getRoleName(role.id, role.name)}</h3>
              <p className="role-title">{getRoleTitle(role.id, role.title)}</p>
            </div>
            <button className="arrow-btn" onClick={(e) => { e.stopPropagation(); setRoleIdx(i => (i + 1) % roles.length) }}>
              <PixelIcon name="arrow-right" size={14} />
            </button>
          </div>
          <p className="role-focus">{getRoleFocus(role.id, role.focus || messages.setup.fallbackRoleFocus)}</p>
          <div className="role-perks">
            {role.perks.slice(0, 3).map((p, i) => (
              <span key={i} className="perk-chip">
                <PixelIcon name="star" size={8} color={PALETTE.accentGold} /> {getRolePerk(role.id, i, p)}
              </span>
            ))}
          </div>
          <button className="pixel-btn" onClick={handleRandomRole}>
            <PixelIcon name="dice" size={10} /> {messages.setup.random}
          </button>
        </div>

        <div className="setup-divider"><span>×</span></div>

        {/* ── Company ── */}
        <div className={`setup-panel ${activePanel === 'company' ? 'active' : ''}`} onClick={() => setActivePanel('company')}>
          {BEGINNER_TEMPLATES.has(template.id) && <span className="recommended-badge">{messages.setup.recommended}</span>}
          <h2>{messages.setup.company}</h2>
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
              <h3>{template.name || titleFromId(template.id)}</h3>
              <p className="role-title">{template.phase || messages.setup.growthStage}</p>
            </div>
            <button className="arrow-btn" onClick={(e) => {
              e.stopPropagation()
              setTemplateIdx(i => (i + 1) % companyTemplates.length)
            }}>
              <PixelIcon name="arrow-right" size={14} />
            </button>
          </div>
          <p className="role-focus">{getTemplateSummary(template.id, template.summary || messages.setup.fallbackTemplateSummary)}</p>
          <div className="setup-stats-preview">
            {baseStats.map(s => (
              <StatPreview
                key={s.statId}
                statId={s.statId}
                label={getStatLabel(s.statId, 'upper')}
                value={s.value}
                max={s.max}
                color={s.color}
                tooltip={messages.setup.statTooltips[s.statId as keyof typeof messages.setup.statTooltips]}
                onHover={setHoveredStat}
                onLeave={() => setHoveredStat(null)}
              />
            ))}
            {hoveredStat && messages.setup.statTooltips[hoveredStat as keyof typeof messages.setup.statTooltips] && (
              <div className="stat-tooltip-inline">{messages.setup.statTooltips[hoveredStat as keyof typeof messages.setup.statTooltips]}</div>
            )}
          </div>
          <div className="setup-deck-info">
            <span className="deck-count">{messages.setup.deckCount(deckSize)}</span>
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
            <label>{messages.setup.nameLabel}</label>
            <input
              type="text"
              value={companyName}
              maxLength={24}
              onChange={e => setCompanyName(e.target.value)}
              placeholder={messages.setup.namePlaceholder}
            />
          </div>
          <button className="pixel-btn" onClick={handleRandomCompany}>
            <PixelIcon name="dice" size={10} /> {messages.setup.random}
          </button>
        </div>

        <div className="setup-divider"><span>×</span></div>

        {/* ── Game Mode ── */}
        <div
          className={`setup-panel mode-panel ${activePanel === 'mode' ? 'active' : ''}`}
          onClick={() => setActivePanel('mode')}
        >
          <h2>{messages.setup.gameMode}</h2>
          <div className="setup-selector">
            <button className="arrow-btn" onClick={(e) => {
              e.stopPropagation()
              setModeIdx(i => (i - 1 + gameModes.length) % gameModes.length)
            }}>
              <PixelIcon name="arrow-left" size={14} />
            </button>
            <div className="setup-entity">
              <div className="mode-icon-large">{MODE_ICONS[mode.id] ?? '?'}</div>
              <h3>{getModeName(mode.id, mode.name || titleFromId(mode.id))}</h3>
            </div>
            <button className="arrow-btn" onClick={(e) => {
              e.stopPropagation()
              setModeIdx(i => (i + 1) % gameModes.length)
            }}>
              <PixelIcon name="arrow-right" size={14} />
            </button>
          </div>

          <div className="mode-goal-box">
            <span className="mode-goal-label">{messages.setup.victoryGoal}</span>
            <p className="mode-goal-text">{getModeGoal(mode.id, mode.goal || messages.setup.fallbackGoal)}</p>
          </div>

          <div className="mode-all-list">
            {gameModes.map((m, i) => (
              <div
                key={m.id}
                className={`mode-item ${i === modeIdx ? 'selected' : ''}`}
                onClick={(e) => { e.stopPropagation(); setModeIdx(i) }}
              >
                <span className="mode-item-icon">{MODE_ICONS[m.id] ?? '?'}</span>
                <span className="mode-item-name">{getModeName(m.id, m.name || titleFromId(m.id))}</span>
              </div>
            ))}
          </div>

          <div className="org-selector">
            <span className="org-selector-label">{messages.setup.organization}</span>
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
              <span className="org-rule-label">{messages.setup.rule}</span>
              <p className="org-rule-text">{org.specialRule}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="setup-footer">
        <button className="pixel-btn" onClick={handleQuickStart}>
          <PixelIcon name="play" size={10} /> {messages.setup.quickStart}
        </button>
        <button className="pixel-btn" onClick={handleRandomAll}>
          <PixelIcon name="dice" size={10} /> {messages.setup.randomAll}
        </button>
        <button className="pixel-btn primary" onClick={handleConfirm}>
          <PixelIcon name="play" size={10} /> {messages.setup.startGame}
        </button>
        {isRecommendedCombo && (
          <span className="recommended-combo-hint">{messages.setup.goodCombo}</span>
        )}
      </div>
    </div>
  )
}
