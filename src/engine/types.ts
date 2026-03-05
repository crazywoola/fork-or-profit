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
}

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
}

export type LogType = 'event' | 'action' | 'decision' | 'system'

export interface LogEntry {
  type: LogType
  round: number
  message: string
  timestamp: number
}

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
}
