export type StatId =
  | 'cash'
  | 'revenue'
  | 'community'
  | 'growth'
  | 'reputation'
  | 'control'
  | 'dev_speed'
  | 'stability'
  | 'pressure'
  | 'trust'
  | 'risk'

export type StatEffect = Partial<Record<StatId, number>>

export type CardCategory = 'Open Source' | 'Monetization' | 'Growth' | 'Operations' | 'Finance'

export interface Card {
  id: string
  title: string
  category: CardCategory
  description: string
  effect: StatEffect
  cost?: StatEffect
  condition?: string
  unlocks?: string
  triggerEvent?: string
  risk?: string
  notes?: string
  core?: boolean
  archetypes?: string[]
  /** If true, this card is removed from the game after being played (not discarded). */
  oneshot?: boolean
}

export type GamePhase = 'early' | 'mid' | 'late' | 'any'

export type EventCategory = 'Community' | 'Competition' | 'Ecosystem' | 'Media' | 'Tech' | 'Market' | 'Regulation'

export interface EventOption {
  label: string
  effect: StatEffect
  description?: string
  unlocks?: string
}

export interface GameEvent {
  id: string
  title: string
  category: EventCategory
  description: string
  immediateEffect?: StatEffect
  options: [EventOption, EventOption, EventOption] | [EventOption, EventOption]
  prototype?: string
  duration?: number
  triggerCondition?: string
  /** Controls which game phase this event can appear in. Defaults to 'any'. */
  phase?: GamePhase
}

export type LogType = 'event' | 'action' | 'decision' | 'system' | 'buff' | 'victory'

export interface LogEntry {
  type: LogType
  round: number
  message: string
  timestamp: number
}

// ── Active effect / buff system ──────────────────────────────────────────────

export type ActiveEffectType =
  | 'stat_per_round'    // apply statEffects every round start
  | 'next_card_boost'   // additive multiplier for next card of given category (consumed on use)
  | 'event_trigger'     // schedule eventId after remainingRounds countdown
  | 'burn_rate_delta'   // permanent burnRate change (applied immediately at play time)

export interface ActiveEffect {
  id: string
  sourceCardId: string
  type: ActiveEffectType
  remainingRounds: number  // -1 = permanent; >0 = countdown
  label: string
  statEffects?: StatEffect
  category?: CardCategory
  multiplier?: number      // additive boost for next_card_boost (0.2 = +20%)
  eventId?: string
  burnRateDelta?: number
}

// ── Game state ───────────────────────────────────────────────────────────────

export interface GameState {
  stats: Record<StatId, number>
  round: number
  phase: 'event' | 'action' | 'resolution'
  activeEvent: GameEvent | null
  hand: Card[]
  deck: Card[]
  discardPile: Card[]
  actionPoints: number
  maxActionPoints: number
  history: LogEntry[]
  roleId: string
  templateId: string
  effectMultipliers: Record<string, number>

  // ── Extended fields ───────────────────────────────────────────────────────
  playedCardIds: string[]       // all card IDs ever played (condition tracking)
  activeEffects: ActiveEffect[] // live buffs and debuffs
  usedEventIds: string[]        // recently drawn event IDs (deduplication pool)
  pendingEventId: string | null // force-draw this event next round
  gameModeId: string            // selected game mode
  burnRate: number              // cash consumed per round (dynamic)
  victory: 'none' | 'win' | 'lose'
  victoryReason: string
}
