import {
  Card,
  CardCategory,
  GameEvent,
  GameState,
  LogType,
  StatEffect,
  StatId,
  ActiveEffect,
  ActiveEffectType,
} from './types'
import { STRATEGY_CARDS } from '../data/cards'
import { GAME_EVENTS } from '../data/events'
import type { RoleProfile } from '../data/roles'
import type { CompanyTemplate } from '../data/company-templates'

// ── Starting stats ────────────────────────────────────────────────────────────

const INITIAL_STATS: Record<StatId, number> = {
  cash: 10,
  revenue: 0,
  community: 5,
  growth: 3,
  reputation: 5,
  control: 8,
  dev_speed: 3,
  stability: 5,
  pressure: 0,
  trust: 5,
  risk: 2,
}

const MAX_STATS: Record<StatId, number> = {
  cash: 50,
  revenue: 50,
  community: 50,
  growth: 50,
  reputation: 50,
  control: 50,
  dev_speed: 50,
  stability: 50,
  pressure: 10,
  trust: 50,
  risk: 10,
}

// ── Card bonus effects from "notes" field (immediate, applied when card is played) ──

const CARD_IMMEDIATE_BONUS: Partial<Record<string, StatEffect>> = {
  'fully-open-source':    { trust: 2 },
  'dual-license':         { control: 2 },
  'dev-docs-push':        { trust: 1 },
  'open-governance':      { trust: 3 },
  'accept-community-prs': { stability: -1 },
  'usage-pricing':        { risk: 1 },
  'consulting-services':  { reputation: 1 },
  'enterprise-support':   { trust: 1 },
  'paid-api-access':      { growth: -1 },
  'license-enforcement':  { reputation: -2 },
  'developer-evangelism': { reputation: 1 },
  'free-tier':            { community: 2 },
  'global-conference':    { community: 2 },
  'dev-tools-integration':{ dev_speed: 1 },
  'sdk-release':          { dev_speed: 1 },
  'hire-engineers':       { stability: 1 },
  'hire-sales-team':      { pressure: 1 },
  'reduce-burn':          { community: -1 },
  'remote-company':       { community: 1 },
  'build-internal-tools': { stability: 1 },
  'tech-debt-cleanup':    { dev_speed: 1 },
  'security-audit':       { risk: -2 },
  'legal-defense':        { risk: -3 },
  'crowdfunding':         { trust: 2 },
  'government-grant':     { risk: -1 },
  'stock-buyback':        { pressure: -1, trust: 1 },
  'foundation-donation':  { community: 1 },
  'partner-program':      { reputation: 1 },
}

// ── Temporal/buff effects from "notes" field ──────────────────────────────────

type ActiveEffectTemplate = Omit<ActiveEffect, 'id'>

const CARD_ACTIVE_EFFECTS: Partial<Record<string, ActiveEffectTemplate[]>> = {
  'contributor-program': [{
    sourceCardId: 'contributor-program',
    type: 'stat_per_round',
    remainingRounds: 3,
    label: 'Contributor Program: +1 community per round',
    statEffects: { community: 1 },
  }],
  'fully-open-source': [{
    sourceCardId: 'fully-open-source',
    type: 'next_card_boost',
    remainingRounds: 999,
    label: 'Fully Open Source: next Open Source card +20%',
    category: 'Open Source',
    multiplier: 0.2,
  }],
  'improve-ci-cd': [{
    sourceCardId: 'improve-ci-cd',
    type: 'next_card_boost',
    remainingRounds: 999,
    label: 'CI/CD Upgrade: next Operations card +15%',
    category: 'Operations',
    multiplier: 0.15,
  }],
  'hire-engineers': [{
    sourceCardId: 'hire-engineers',
    type: 'burn_rate_delta',
    remainingRounds: -1,
    label: 'Engineering Team Upkeep: burn rate +1',
    burnRateDelta: 1,
  }],
  'hire-sales-team': [{
    sourceCardId: 'hire-sales-team',
    type: 'burn_rate_delta',
    remainingRounds: -1,
    label: 'Sales Team Upkeep: burn rate +1',
    burnRateDelta: 1,
  }],
  'remote-company': [{
    sourceCardId: 'remote-company',
    type: 'burn_rate_delta',
    remainingRounds: -1,
    label: 'Remote Collaboration Savings: burn rate -1',
    burnRateDelta: -1,
  }],
  'launch-plugin-ecosystem': [{
    sourceCardId: 'launch-plugin-ecosystem',
    type: 'event_trigger',
    remainingRounds: 4,
    label: 'Plugin Ecosystem: trigger Ecosystem Explosion in 4 rounds',
    eventId: 'ecosystem-explosion',
  }],
  'open-core': [{
    sourceCardId: 'open-core',
    type: 'stat_per_round',
    remainingRounds: -1,
    label: 'Open Core Dual Track: +1 community per round',
    statEffects: { community: 1 },
  }],
}

// ── Config ────────────────────────────────────────────────────────────────────

export type GameConfig = {
  role: RoleProfile
  template: CompanyTemplate
  gameModeId: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildDeck(role: RoleProfile): Card[] {
  const archetype = role.archetype
  const roleCardTitles = new Set(role.cards)

  const deck = STRATEGY_CARDS.filter(card => {
    if (card.core) return true
    if (card.archetypes?.includes(archetype)) return true
    if (roleCardTitles.has(card.title)) return true
    return false
  })

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }

  return deck
}

function computeMultipliers(
  role: RoleProfile,
  template: CompanyTemplate,
): Record<string, number> {
  const categories: CardCategory[] = ['Open Source', 'Monetization', 'Growth', 'Operations', 'Finance']
  const result: Record<string, number> = {}
  for (const cat of categories) {
    const rm = role.effectMultipliers[cat] ?? 1
    const cm = template.effectMultipliers[cat] ?? 1
    result[cat] = Math.round(rm * cm * 100) / 100
  }
  return result
}

let effectIdCounter = 0
function makeEffectId(sourceCardId: string) {
  return `${sourceCardId}-${++effectIdCounter}-${Date.now()}`
}

// ── Engine ────────────────────────────────────────────────────────────────────

export class GameEngine {
  state: GameState
  private config: GameConfig | null
  private cardsPlayedThisRound = 0

  constructor(config?: GameConfig) {
    this.config = config ?? null
    this.state = this.getInitialState()
  }

  getInitialState(): GameState {
    const stats = { ...INITIAL_STATS }

    if (this.config) {
      const { role, template } = this.config

      for (const [key, val] of Object.entries(role.statBonuses)) {
        const k = key as StatId
        if (stats[k] !== undefined) {
          stats[k] = this.clamp(stats[k] + val, 0, MAX_STATS[k])
        }
      }

      for (const [key, val] of Object.entries(template.modifiers)) {
        const k = key as StatId
        if (stats[k] !== undefined && val !== undefined) {
          stats[k] = this.clamp(stats[k] + val, 0, MAX_STATS[k])
        }
      }
    }

    const deck = this.config ? buildDeck(this.config.role) : [...STRATEGY_CARDS]
    const multipliers = this.config
      ? computeMultipliers(this.config.role, this.config.template)
      : { 'Open Source': 1, 'Monetization': 1, 'Growth': 1, 'Operations': 1, 'Finance': 1 }

    // Finance archetype starts with lower burn rate (fiscal discipline)
    const burnRate = this.config?.role.archetype === 'finance' ? 1 : 2

    return {
      stats,
      round: 1,
      phase: 'event',
      activeEvent: null,
      hand: [],
      deck,
      discardPile: [],
      actionPoints: 3,
      maxActionPoints: 3,
      history: [],
      roleId: this.config?.role.id ?? '',
      templateId: this.config?.template.id ?? '',
      effectMultipliers: multipliers,
      playedCardIds: [],
      activeEffects: [],
      usedEventIds: [],
      pendingEventId: null,
      gameModeId: this.config?.gameModeId ?? 'survival',
      burnRate,
      victory: 'none',
      victoryReason: '',
    }
  }

  // ── Round flow ─────────────────────────────────────────────────────────────

  startRound() {
    this.cardsPlayedThisRound = 0

    // Apply ongoing buffs
    this.tickEffects()

    // Role passives
    this.applyRolePassives()

    // Template: Dify Fast-Track (every 3rd round: +1 action point)
    if (
      this.config?.template.id === 'dify' &&
      this.state.round % 3 === 0 &&
      this.state.round > 1
    ) {
      this.state.actionPoints = Math.min(this.state.actionPoints + 1, this.state.maxActionPoints + 1)
      this.log('buff', 'Dify Fast-Track: +1 extra action point')
    }

    const event = this.drawEvent()
    this.state.activeEvent = event
    this.state.phase = 'event'
    this.log('event', `Round ${this.state.round} started. Event: ${event.title}`)

    if (event.immediateEffect) {
      this.applyEffect(event.immediateEffect)
    }
  }

  resolveEvent(optionIndex: number) {
    if (!this.state.activeEvent) return
    const event = this.state.activeEvent
    const option = event.options[optionIndex]
    if (!option) return

    this.log('decision', `Selected: ${option.label}`)
    this.applyEffect(option.effect)

    // Track acquisition acceptance for 'acquisition' game mode
    if (event.id === 'acquisition-offer' && optionIndex === 0) {
      this.state.playedCardIds.push('__acquisition_accepted')
      this.log('system', 'Acquisition accepted. Exit path triggered.')
    }

    this.state.activeEvent = null
    this.state.phase = 'action'
    this.drawHand()
  }

  playCard(cardId: string) {
    if (this.state.phase !== 'action') return
    if (this.state.actionPoints <= 0) return

    const cardIndex = this.state.hand.findIndex(c => c.id === cardId)
    if (cardIndex === -1) return

    const card = this.state.hand[cardIndex]

    // Condition check
    if (card.condition && !this.evaluateCondition(card.condition)) {
      this.log('system', `Cannot play [${card.title}]: condition unmet (${card.condition})`)
      return
    }

    // Calculate multiplier: base × template boost × active boost
    let extraMultiplier = 0
    const consumedBoostIds: string[] = []
    for (const effect of this.state.activeEffects) {
      if (effect.type === 'next_card_boost' && effect.category === card.category) {
        extraMultiplier += effect.multiplier ?? 0
        consumedBoostIds.push(effect.id)
      }
    }
    if (consumedBoostIds.length > 0) {
      this.state.activeEffects = this.state.activeEffects.filter(
        e => !consumedBoostIds.includes(e.id)
      )
    }

    const baseMultiplier = this.state.effectMultipliers[card.category] ?? 1
    // Docker: Growth cards are truly doubled (overrides base multiplier)
    const isDockerGrowth =
      this.config?.template.id === 'docker' && card.category === 'Growth'
    const finalMultiplier = isDockerGrowth
      ? 2.0 + extraMultiplier
      : baseMultiplier + extraMultiplier

    const logSuffix =
      finalMultiplier !== 1
        ? ` (x${Math.round(finalMultiplier * 100) / 100})`
        : ''

    this.log('action', `Played strategy card: ${card.title}${logSuffix}`)

    // Apply main effect
    this.applyEffect(card.effect, finalMultiplier)

    // Apply cost
    if (card.cost) this.applyEffect(card.cost)

    // Apply immediate bonus effects from notes
    const bonus = CARD_IMMEDIATE_BONUS[card.id]
    if (bonus) this.applyEffect(bonus)

    // Special random effects
    this.applyCardSpecialRandom(card.id)

    // Apply active buff effects (temporal)
    this.applyCardBuff(card)

    // Apply template special ability
    this.applyTemplateAbility(card)

    // Track played cards
    this.state.playedCardIds.push(card.id)
    this.cardsPlayedThisRound++

    this.state.hand.splice(cardIndex, 1)
    this.state.discardPile.push(card)
    this.state.actionPoints -= 1
  }

  endTurn() {
    this.state.phase = 'resolution'

    const netIncome = this.state.stats.revenue - this.state.burnRate
    this.state.stats.cash = this.clamp(
      this.state.stats.cash + netIncome,
      0,
      MAX_STATS.cash,
    )

    this.log('system', `Round ${this.state.round} ended. Net income: ${netIncome > 0 ? '+' : ''}${netIncome} (burn: ${this.state.burnRate})`)

    // Check victory / defeat
    const verdict = this.checkVictory()
    if (verdict !== 'none') {
      this.state.victory = verdict
      this.log('victory', verdict === 'win'
        ? `🏆 Victory! ${this.state.victoryReason}`
        : `💀 Game over. ${this.state.victoryReason}`)
      return  // stay in 'resolution' phase so UI can react
    }

    this.state.round += 1
    this.state.actionPoints = this.state.maxActionPoints

    this.state.discardPile.push(...this.state.hand)
    this.state.hand = []

    this.startRound()
  }

  // ── Public helpers ─────────────────────────────────────────────────────────

  /** Returns true if the card in hand is currently playable */
  canPlayCard(cardId: string): boolean {
    if (this.state.phase !== 'action') return false
    if (this.state.actionPoints <= 0) return false
    const card = this.state.hand.find(c => c.id === cardId)
    if (!card) return false
    if (card.condition) return this.evaluateCondition(card.condition)
    return true
  }

  // ── Victory / defeat check ─────────────────────────────────────────────────

  private checkVictory(): 'none' | 'win' | 'lose' {
    const { stats, round, gameModeId, playedCardIds } = this.state

    // Lose conditions (universal)
    if (stats.cash <= 0) {
      this.state.victoryReason = 'Cash is depleted and the company is bankrupt.'
      return 'lose'
    }
    if (stats.community <= 0) {
      this.state.victoryReason = 'The open-source community collapsed.'
      return 'lose'
    }
    if (stats.risk >= 10) {
      this.state.victoryReason = 'Risk exposure reached a critical limit.'
      return 'lose'
    }
    if (stats.pressure >= 10) {
      this.state.victoryReason = 'External pressure broke team morale.'
      return 'lose'
    }

    // Win conditions by mode
    switch (gameModeId) {
      case 'survival':
        if (round >= 12) {
          this.state.victoryReason = 'You survived 12 rounds of pressure.'
          return 'win'
        }
        break

      case 'ipo':
        if (stats.revenue >= 30 && stats.reputation >= 15) {
          this.state.victoryReason = 'IPO conditions met. The company successfully listed.'
          return 'win'
        }
        if (playedCardIds.includes('ipo')) {
          this.state.victoryReason = 'You rang the IPO bell successfully.'
          return 'win'
        }
        if (round > 20) {
          this.state.victoryReason = 'Failed to meet IPO goals within 20 rounds.'
          return 'lose'
        }
        break

      case 'legend':
        if (stats.community >= 30 && stats.growth >= 20) {
          this.state.victoryReason = 'Open-source legend achieved: community and growth peaked together.'
          return 'win'
        }
        if (round > 20) {
          this.state.victoryReason = 'Failed to establish an OSS legend within 20 rounds.'
          return 'lose'
        }
        break

      case 'acquisition':
        if (playedCardIds.includes('__acquisition_accepted')) {
          this.state.victoryReason = 'Acquisition exit completed successfully.'
          return 'win'
        }
        if (round > 20) {
          this.state.victoryReason = 'No acquisition offer arrived within 20 rounds.'
          return 'lose'
        }
        break

      case 'open-core':
        if (stats.community >= 15 && stats.revenue >= 15) {
          this.state.victoryReason = 'Open-Core balance achieved across community and revenue.'
          return 'win'
        }
        if (round > 20) {
          this.state.victoryReason = 'Failed to achieve Open-Core balance within 20 rounds.'
          return 'lose'
        }
        break
    }

    return 'none'
  }

  // ── Condition parser ──────────────────────────────────────────────────────

  private evaluateCondition(condition: string): boolean {
    if (!condition) return true

    // Remove parenthetical notes like （有还款能力证明）
    const clean = condition
      .replace(/（[^）]*）/g, '')
      .replace(/\([^)]*\)/g, '')
      .trim()

    // "需先打出「X」或「Y」" or "需先打出「X」"
    const needPlayedMatches = [...clean.matchAll(/「([^」]+)」/g)].map(m => m[1])
    if (needPlayedMatches.length > 0 && clean.includes('需先打出')) {
      const lookup = (title: string) => STRATEGY_CARDS.find(c => c.title === title)?.id ?? ''
      if (clean.includes('或')) {
        return needPlayedMatches.some(t => this.state.playedCardIds.includes(lookup(t)))
      }
      return needPlayedMatches.every(t => this.state.playedCardIds.includes(lookup(t)))
    }

    // "已完成 X" — check if card X has been played
    const completedMatch = clean.match(/已完成\s*(.+)/)
    if (completedMatch) {
      const title = completedMatch[1].trim()
      const card = STRATEGY_CARDS.find(c => c.title === title)
      return card ? this.state.playedCardIds.includes(card.id) : true
    }

    // "游戏开局可用" — only playable in early game
    if (clean.includes('游戏开局')) {
      return this.state.round <= 5
    }

    // "仅在触发相关法律事件后可打出" — allow if any law event was recently active
    if (clean.includes('仅在触发')) {
      return this.state.usedEventIds.some(id =>
        id === 'patent-lawsuit' || id === 'government-regulation' || id === 'licensing-controversy'
      )
    }

    // Handle 且 (AND) and 或 (OR) conjunctions
    if (clean.includes('且')) {
      return clean.split('且').every(c => this.evaluateSingleCondition(c.trim()))
    }
    if (clean.includes('或')) {
      return clean.split('或').some(c => this.evaluateSingleCondition(c.trim()))
    }

    return this.evaluateSingleCondition(clean)
  }

  private evaluateSingleCondition(cond: string): boolean {
    const match = cond.match(/(\w+)\s*(>=|<=|>|<|==)\s*(\d+)/)
    if (match) {
      const [, statKey, op, valStr] = match
      const statVal = this.state.stats[statKey as StatId] ?? 0
      const threshold = parseInt(valStr)
      switch (op) {
        case '>=': return statVal >= threshold
        case '<=': return statVal <= threshold
        case '>':  return statVal > threshold
        case '<':  return statVal < threshold
        case '==': return statVal === threshold
      }
    }
    return true
  }

  // ── Active effect ticker ──────────────────────────────────────────────────

  private tickEffects() {
    const toRemove: string[] = []

    for (const effect of this.state.activeEffects) {
      if (effect.type === 'stat_per_round' && effect.statEffects) {
        this.applyEffect(effect.statEffects)
        this.log('buff', `[Ongoing Effect] ${effect.label}`)
      }

      if (effect.type === 'event_trigger') {
        effect.remainingRounds--
        if (effect.remainingRounds <= 0) {
          this.state.pendingEventId = effect.eventId ?? null
          this.log('buff', `[Triggered Event] ${effect.label}`)
          toRemove.push(effect.id)
          continue
        }
      }

      if (effect.remainingRounds > 0 && effect.type !== 'burn_rate_delta') {
        effect.remainingRounds--
        if (effect.remainingRounds <= 0 && effect.type !== 'next_card_boost') {
          toRemove.push(effect.id)
        }
      }
    }

    this.state.activeEffects = this.state.activeEffects.filter(e => !toRemove.includes(e.id))
  }

  // ── Card buff application ─────────────────────────────────────────────────

  private applyCardBuff(card: Card) {
    const templates = CARD_ACTIVE_EFFECTS[card.id]
    if (!templates) return

    for (const tpl of templates) {
      if (tpl.type === 'burn_rate_delta' && tpl.burnRateDelta !== undefined) {
        this.state.burnRate = Math.max(1, this.state.burnRate + tpl.burnRateDelta)
        this.log('buff', `[Cost Change] ${tpl.label} -> burn per round: ${this.state.burnRate}`)
        continue
      }

      const effect: ActiveEffect = { ...tpl, id: makeEffectId(card.id) }
      this.state.activeEffects.push(effect)
      this.log('buff', `[Effect Activated] ${tpl.label}`)
    }
  }

  // ── Special random card effects ───────────────────────────────────────────

  private applyCardSpecialRandom(cardId: string) {
    switch (cardId) {
      case 'hacker-news-launch':
        if (Math.random() < 0.4) {
          this.applyEffect({ reputation: -1 })
          this.log('system', 'Hacker News: controversial comments emerged, reputation -1')
        } else {
          this.log('system', 'Hacker News: comment section is positive.')
        }
        break

      case 'product-hunt-launch':
        if (Math.random() < 0.5) {
          this.applyEffect({ reputation: 2 })
          this.log('system', 'Product Hunt: reached Top 3. Reputation +2 and draw 1 extra card.')
          this.drawOneCard()
        } else {
          this.log('system', 'Product Hunt: did not enter Top 3.')
        }
        break
    }
  }

  // ── Template special abilities ────────────────────────────────────────────

  private applyTemplateAbility(card: Card) {
    const templateId = this.config?.template.id
    if (!templateId) return

    switch (templateId) {
      // Redis: Open Source cards grant trust +1
      case 'redis':
        if (card.category === 'Open Source') {
          this.applyEffect({ trust: 1 })
          this.log('buff', '[Redis Passive] antirez effect: trust +1')
        }
        break

      // MongoDB: Enterprise Edition card does not lose community
      case 'mongodb':
        if (card.id === 'enterprise-edition' && (card.effect.community ?? 0) < 0) {
          this.applyEffect({ community: -(card.effect.community ?? 0) })
          this.log('buff', '[MongoDB Passive] Open-Core flywheel: enterprise edition does not lose community')
        }
        break

      // GitLab: open-governance and public-roadmap effects doubled
      case 'gitlab':
        if (card.id === 'open-governance' || card.id === 'public-roadmap') {
          this.applyEffect(card.effect)
          this.log('buff', '[GitLab Passive] Transparency culture: governance/roadmap card effects doubled')
        }
        break

      // Red Hat: Open Source cards grant revenue +1
      case 'redhat':
        if (card.category === 'Open Source') {
          this.applyEffect({ revenue: 1 })
          this.log('buff', '[Red Hat Passive] Upstream First: revenue +1')
        }
        break

      // Kubernetes: open-governance community and trust doubled
      case 'kubernetes':
        if (card.id === 'open-governance') {
          const bonus: Partial<Record<string, number>> = {}
          if (card.effect.community) bonus.community = card.effect.community
          if (card.effect.trust) bonus.trust = card.effect.trust
          this.applyEffect(bonus)
          this.log('buff', '[Kubernetes Passive] Foundation governance: community/trust doubled')
        }
        break

      // Elastic: 2nd+ card per round gets flat +1 to all stats
      case 'elastic':
        if (this.cardsPlayedThisRound >= 1) {
          this.applyEffect({ community: 1 })
          this.log('buff', '[Elastic Passive] Stack synergy: combo bonus community +1')
        }
        break
    }
  }

  // ── Role passive abilities ────────────────────────────────────────────────

  private applyRolePassives() {
    const archetype = this.config?.role.archetype
    if (!archetype) return

    switch (archetype) {
      case 'community':
        if (this.state.round % 3 === 0) {
          this.applyEffect({ community: 1 })
          this.log('buff', '[Role Passive] community ecosystem: community +1')
        }
        break

      case 'risk':
        if (this.state.stats.risk >= 7) {
          this.applyEffect({ risk: -1 })
          this.log('buff', '[Role Passive] risk barrier: high risk, auto reduce by 1')
        }
        break

      case 'people':
        if (this.state.round % 4 === 0) {
          this.applyEffect({ stability: 1 })
          this.log('buff', '[Role Passive] people and culture: stability +1')
        }
        break

      case 'engineering':
        if (this.state.round % 3 === 0) {
          this.applyEffect({ dev_speed: 1 })
          this.log('buff', '[Role Passive] engineering momentum: dev_speed +1')
        }
        break

      case 'support':
        if (this.state.round % 3 === 0) {
          this.applyEffect({ trust: 1 })
          this.log('buff', '[Role Passive] customer support: trust +1')
        }
        break

      case 'growth':
        if (this.state.round % 4 === 0) {
          this.applyEffect({ growth: 1 })
          this.log('buff', '[Role Passive] growth momentum: growth +1')
        }
        break
    }
  }

  // ── Event drawing with deduplication and condition filtering ──────────────

  private drawEvent(): GameEvent {
    // Force-triggered event (from plugin ecosystem countdown, etc.)
    if (this.state.pendingEventId) {
      const pending = GAME_EVENTS.find(e => e.id === this.state.pendingEventId)
      this.state.pendingEventId = null
      if (pending) {
        this.state.usedEventIds.push(pending.id)
        return pending
      }
    }

    // Build candidate pool: exclude last 5 drawn events
    const recentlyUsed = new Set(this.state.usedEventIds.slice(-5))
    const candidates = GAME_EVENTS.filter(e => {
      if (recentlyUsed.has(e.id)) return false
      if (e.triggerCondition) return this.evaluateTriggerCondition(e.triggerCondition)
      return true
    })

    const pool = candidates.length > 0 ? candidates : GAME_EVENTS
    const event = pool[Math.floor(Math.random() * pool.length)]

    // Keep a rolling window of last 20 used event IDs
    this.state.usedEventIds.push(event.id)
    if (this.state.usedEventIds.length > 20) {
      this.state.usedEventIds = this.state.usedEventIds.slice(-20)
    }

    return event
  }

  private evaluateTriggerCondition(condition: string): boolean {
    // "reputation + revenue >= 20"
    const sumMatch = condition.match(/(\w+)\s*\+\s*(\w+)\s*(>=|>|<=|<)\s*(\d+)/)
    if (sumMatch) {
      const [, s1, s2, op, valStr] = sumMatch
      const sum =
        (this.state.stats[s1 as StatId] ?? 0) +
        (this.state.stats[s2 as StatId] ?? 0)
      const threshold = parseInt(valStr)
      switch (op) {
        case '>=': return sum >= threshold
        case '>':  return sum > threshold
        case '<=': return sum <= threshold
        case '<':  return sum < threshold
      }
    }

    // Single stat condition
    return this.evaluateSingleCondition(condition)
  }

  // ── Low-level helpers ─────────────────────────────────────────────────────

  private drawHand() {
    for (let i = 0; i < 3; i++) {
      this.drawOneCard()
    }
  }

  private drawOneCard() {
    if (this.state.deck.length === 0) this.reshuffleDeck()
    if (this.state.deck.length > 0) {
      const card = this.state.deck.pop()!
      this.state.hand.push(card)
    }
  }

  private reshuffleDeck() {
    this.state.deck = [...this.state.discardPile]
    this.state.discardPile = []
    for (let i = this.state.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.state.deck[i], this.state.deck[j]] = [this.state.deck[j], this.state.deck[i]]
    }
    this.log('system', 'Deck reshuffled.')
  }

  private applyEffect(effect: StatEffect, multiplier = 1) {
    for (const [key, value] of Object.entries(effect)) {
      const statKey = key as StatId
      if (this.state.stats[statKey] !== undefined) {
        const scaled = multiplier !== 1 ? Math.round((value as number) * multiplier) : (value as number)
        this.state.stats[statKey] = this.clamp(
          this.state.stats[statKey] + scaled,
          0,
          MAX_STATS[statKey],
        )
      }
    }
  }

  private clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max)
  }

  private log(type: LogType, message: string) {
    this.state.history.push({
      type,
      round: this.state.round,
      message,
      timestamp: Date.now(),
    })
  }
}
