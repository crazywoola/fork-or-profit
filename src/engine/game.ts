import { Card, GameEvent, GameState, LogType, StatEffect, StatId } from './types'
import { STRATEGY_CARDS } from '../data/cards'
import { GAME_EVENTS } from '../data/events'

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

export class GameEngine {
  state: GameState

  constructor() {
    this.state = this.getInitialState()
  }

  getInitialState(): GameState {
    return {
      stats: { ...INITIAL_STATS },
      round: 1,
      phase: 'event',
      activeEvent: null,
      hand: [],
      deck: [...STRATEGY_CARDS],
      discardPile: [],
      actionPoints: 3,
      maxActionPoints: 3,
      history: []
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

    this.log('action', `Played card: ${card.title}`)
    this.applyEffect(card.effect)
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

  private applyEffect(effect: StatEffect) {
    for (const [key, value] of Object.entries(effect)) {
      const statKey = key as StatId
      if (this.state.stats[statKey] !== undefined) {
        this.state.stats[statKey] = this.clamp(
          this.state.stats[statKey] + value,
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
