export type GameMode = {
  id: string
  name: string
  goal: string
}

export type Organization = {
  id: string
  name: string
  style: string
  maxActionPoints: number
  handSizeBonus: number
  cardCategoryMultipliers: Partial<Record<string, number>>
  specialRule: string
}

export type CompanyStat = {
  id: string
  label: string
  value: number
  max: number
  tone: 'warm' | 'cool' | 'danger' | 'neutral'
}

export const gameModes: GameMode[] = [
  {
    id: 'survival',
    name: 'Survival',
    goal: 'Keep cash and community above 0 through Round 12.'
  },
  {
    id: 'ipo',
    name: 'IPO',
    goal: 'Reach revenue >= 30 and reputation >= 15 by Round 20.'
  },
  {
    id: 'legend',
    name: 'OSS Legend',
    goal: 'Reach community >= 30 and growth >= 20 by Round 20.'
  },
  {
    id: 'acquisition',
    name: 'Acquisition Exit',
    goal: 'Trigger an acquisition event and satisfy reputation + revenue >= 25.'
  },
  {
    id: 'open-core',
    name: 'Open-Core',
    goal: 'Reach both community >= 15 and revenue >= 15 by Round 20.'
  }
]

export const organizations: Organization[] = [
  {
    id: 'flat',
    name: 'Flat Startup Team',
    style: 'Shared action pool and very fast pace. Best for OSS-first routes.',
    maxActionPoints: 3,
    handSizeBonus: 1,
    cardCategoryMultipliers: { 'Open Source': 1.15 },
    specialRule: '+1 card draw per round, Open Source cards +15%',
  },
  {
    id: 'functional',
    name: 'Functional Organization',
    style: 'Clear department boundaries with stronger monetization execution.',
    maxActionPoints: 3,
    handSizeBonus: 0,
    cardCategoryMultipliers: { 'Monetization': 1.2 },
    specialRule: 'Monetization cards +20%',
  },
  {
    id: 'matrix',
    name: 'Matrix Organization',
    style: 'Cross-functional coordination with higher resource contention.',
    maxActionPoints: 3,
    handSizeBonus: 0,
    cardCategoryMultipliers: {},
    specialRule: 'Playing 2 different category cards in same round: both +10%',
  },
  {
    id: 'squad',
    name: 'Squad / Guild Model',
    style: 'Parallel squads with both collaboration and internal competition.',
    maxActionPoints: 4,
    handSizeBonus: 0,
    cardCategoryMultipliers: { 'Growth': 1.1 },
    specialRule: '4 action points per round, Growth cards +10%',
  },
  {
    id: 'foundation',
    name: 'Open Foundation Model',
    style: 'TSC voting governance driven by community contributors.',
    maxActionPoints: 3,
    handSizeBonus: 0,
    cardCategoryMultipliers: { 'Open Source': 1.3, 'Monetization': 0.85 },
    specialRule: 'Open Source +30%, Monetization -15%, community auto +1/round',
  },
  {
    id: 'dual-track',
    name: 'Dual-Track Group',
    style: 'Community and enterprise tracks run in parallel, emphasizing balance.',
    maxActionPoints: 3,
    handSizeBonus: 1,
    cardCategoryMultipliers: { 'Open Source': 1.1, 'Monetization': 1.1 },
    specialRule: '+1 card draw, both Open Source and Monetization +10%',
  }
]

export const companyStats: CompanyStat[] = [
  { id: 'cash', label: 'Cash Reserve', value: 10, max: 50, tone: 'warm' },
  { id: 'revenue', label: 'Monthly Revenue', value: 0, max: 50, tone: 'warm' },
  { id: 'community', label: 'Community Influence', value: 5, max: 50, tone: 'cool' },
  { id: 'growth', label: 'Growth Momentum', value: 3, max: 50, tone: 'cool' },
  { id: 'reputation', label: 'Brand Reputation', value: 5, max: 50, tone: 'cool' },
  { id: 'control', label: 'Control', value: 8, max: 50, tone: 'neutral' },
  { id: 'dev_speed', label: 'Development Speed', value: 3, max: 50, tone: 'cool' },
  { id: 'stability', label: 'Product Stability', value: 5, max: 50, tone: 'cool' },
  { id: 'pressure', label: 'External Pressure', value: 0, max: 10, tone: 'danger' },
  { id: 'trust', label: 'Trust', value: 5, max: 50, tone: 'cool' },
  { id: 'morale', label: 'Team Morale', value: 7, max: 10, tone: 'cool' },
  { id: 'risk', label: 'Risk Exposure', value: 2, max: 10, tone: 'danger' }
]
