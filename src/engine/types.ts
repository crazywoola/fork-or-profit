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

export type FactionId = 'community' | 'investors' | 'enterprise' | 'regulators' | 'ecosystem'

export type GameStage = 'seed' | 'growth' | 'scale'

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
  setsFlags?: string[]
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
  setsFlags?: string[]
  clearsFlags?: string[]
  requiresFlagsAll?: string[]
  requiresFlagsAny?: string[]
  factionEffects?: Partial<Record<FactionId, number>>
  followupEventId?: string
  followupInRounds?: number
  consequenceHint?: string
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
  ongoingEffect?: StatEffect
  requiresFlagsAll?: string[]
  requiresFlagsAny?: string[]
  blocksFlags?: string[]
  weightTags?: string[]
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
  source?: 'card' | 'event' | 'room' | 'talent' | 'system'
  statEffects?: StatEffect
  category?: CardCategory
  multiplier?: number      // additive boost for next_card_boost (0.2 = +20%)
  eventId?: string
  burnRateDelta?: number
}

export interface RoomBonusState {
  roomId: string
  label: string
  summary: string
  categoryBoosts: Partial<Record<CardCategory, number>>
  immediateEffect?: StatEffect
  nextEventWeights?: Partial<Record<string, number>>
  synergyBoost?: StatEffect
  factionShift?: Partial<Record<FactionId, number>>
}

// ── Card effect preview (aggregated total impact) ────────────────────────────

export interface CardPreview {
  baseEffect: StatEffect
  bonusEffect: StatEffect
  templateBonus: StatEffect
  costEffect: StatEffect
  totalEffect: StatEffect
  multiplier: number
  synergyBonus: StatEffect | null
  synergyLabel: string | null
  roomBonus: StatEffect
  orgBonus: StatEffect
  bonusSources: string[]
}

// ── Round summary ────────────────────────────────────────────────────────────

export interface RoundSummary {
  round: number
  revenue: number
  burnRate: number
  netIncome: number
  statDeltas: StatEffect
  expiredEffects: string[]
  newEffects: string[]
  previousStats: Record<StatId, number>
  selectedRoomId: string | null
  pendingThreats: string[]
}

// ── Game state ───────────────────────────────────────────────────────────────

export interface GameState {
  stats: Record<StatId, number>
  round: number
  phase: 'event' | 'planning' | 'action' | 'resolution' | 'summary'
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

  // ── Round summary & tracking ──────────────────────────────────────────────
  roundSummary: RoundSummary | null
  cardsPlayedThisRound: string[] // card IDs played in current round (synergy tracking)
  previousRoundStats: Record<StatId, number> | null // stats at start of round (for trend arrows)
  gameStage: GameStage  // phase-specific mechanics
  worldFlags: string[]
  resolvedChains: string[]
  factionReputation: Record<FactionId, number>
  selectedRoomId: string | null
  roomBonus: RoomBonusState | null
  progressionSelections: string[]
  stageMilestones: GameStage[]
  pendingThreats: string[]
}
