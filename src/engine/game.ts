import { Card, CardCategory, GameEvent, GameState, LogType, StatEffect, StatId } from './types'
import { STRATEGY_CARDS } from '../data/cards'
import { GAME_EVENTS } from '../data/events'
import type { RoleProfile } from '../data/roles'
import type { CompanyTemplate } from '../data/company-templates'

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
  risk: 2
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
  risk: 10
}

export type GameConfig = {
  role: RoleProfile
  template: CompanyTemplate
}

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
  template: CompanyTemplate
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

export class GameEngine {
  state: GameState
  private config: GameConfig | null

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
    }
  }

  startRound() {
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
    const option = this.state.activeEvent.options[optionIndex]
    if (!option) return

    this.log('decision', `Chose: ${option.label}`)
    this.applyEffect(option.effect)

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
    const multiplier = this.state.effectMultipliers[card.category] ?? 1

    this.log('action', `Played card: ${card.title}` + (multiplier !== 1 ? ` (x${multiplier})` : ''))
    this.applyEffect(card.effect, multiplier)
    if (card.cost) this.applyEffect(card.cost)

    this.state.hand.splice(cardIndex, 1)
    this.state.discardPile.push(card)
    this.state.actionPoints -= 1
  }

  endTurn() {
    this.state.phase = 'resolution'

    const burnRate = 2
    const netIncome = this.state.stats.revenue - burnRate
    this.state.stats.cash = Math.max(0, this.state.stats.cash + netIncome)

    this.log('system', `End of Round ${this.state.round}. Net Income: ${netIncome}`)

    if (this.state.stats.cash <= 0) {
      this.log('system', 'GAME OVER: Bankrupt')
      return
    }

    if (this.state.stats.community <= 0) {
      this.log('system', 'GAME OVER: Community collapsed')
      return
    }

    this.state.round += 1
    this.state.actionPoints = this.state.maxActionPoints

    this.state.discardPile.push(...this.state.hand)
    this.state.hand = []

    this.startRound()
  }

  private drawEvent(): GameEvent {
    const index = Math.floor(Math.random() * GAME_EVENTS.length)
    return GAME_EVENTS[index]
  }

  private drawHand() {
    for (let i = 0; i < 3; i++) {
      if (this.state.deck.length === 0) {
        this.reshuffleDeck()
      }
      if (this.state.deck.length > 0) {
        const card = this.state.deck.pop()!
        this.state.hand.push(card)
      }
    }
  }

  private reshuffleDeck() {
    this.state.deck = [...this.state.discardPile]
    this.state.discardPile = []
    for (let i = this.state.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.state.deck[i], this.state.deck[j]] = [this.state.deck[j], this.state.deck[i]];
    }
    this.log('system', 'Deck reshuffled')
  }

  private applyEffect(effect: StatEffect, multiplier: number = 1) {
    for (const [key, value] of Object.entries(effect)) {
      const statKey = key as StatId
      if (this.state.stats[statKey] !== undefined) {
        const scaled = multiplier !== 1 ? Math.round(value * multiplier) : value
        this.state.stats[statKey] = this.clamp(
          this.state.stats[statKey] + scaled,
          0,
          MAX_STATS[statKey]
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
