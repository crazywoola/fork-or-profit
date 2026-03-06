import {
  ActiveEffect,
  Card,
  CardCategory,
  CardPreview,
  FactionId,
  GameEvent,
  GameStage,
  GameState,
  LogType,
  RoomBonusState,
  RoundSummary,
  StatEffect,
  StatId,
} from './types'
import { STRATEGY_CARDS } from '../data/cards'
import { GAME_EVENTS } from '../data/events'
import { organizations } from '../data/game'
import { formatEffectSummary, getEventOptionLabel, getTranslatedCardConditionForLog } from '../i18n/content'
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

const MAX_FACTION = 10
const NEUTRAL_FACTIONS: Record<FactionId, number> = {
  community: 5,
  investors: 5,
  enterprise: 5,
  regulators: 5,
  ecosystem: 5,
}

const CARD_IMMEDIATE_BONUS: Partial<Record<string, StatEffect>> = {
  'fully-open-source': { trust: 2 },
  'dual-license': { control: 2 },
  'dev-docs-push': { trust: 1 },
  'open-governance': { trust: 3 },
  'accept-community-prs': { stability: -1 },
  'usage-pricing': { risk: 1 },
  'consulting-services': { reputation: 1 },
  'enterprise-support': { trust: 1 },
  'paid-api-access': { growth: -1 },
  'license-enforcement': { reputation: -2 },
  'developer-evangelism': { reputation: 1 },
  'free-tier': { community: 2 },
  'global-conference': { community: 2 },
  'dev-tools-integration': { dev_speed: 1 },
  'sdk-release': { dev_speed: 1 },
  'hire-engineers': { stability: 1 },
  'hire-sales-team': { pressure: 1 },
  'reduce-burn': { community: -1 },
  'remote-company': { community: 1 },
  'build-internal-tools': { stability: 1 },
  'tech-debt-cleanup': { dev_speed: 1 },
  'security-audit': { risk: -2 },
  'legal-defense': { risk: -3 },
  crowdfunding: { trust: 2 },
  'government-grant': { risk: -1 },
  'stock-buyback': { pressure: -1, trust: 1 },
  'foundation-donation': { community: 1 },
  'partner-program': { reputation: 1 },
}

type ActiveEffectTemplate = Omit<ActiveEffect, 'id'>

const CARD_ACTIVE_EFFECTS: Partial<Record<string, ActiveEffectTemplate[]>> = {
  'contributor-program': [{
    sourceCardId: 'contributor-program',
    source: 'card',
    type: 'stat_per_round',
    remainingRounds: 3,
    label: 'Contributor Program: +1 community per round',
    statEffects: { community: 1 },
  }],
  'fully-open-source': [{
    sourceCardId: 'fully-open-source',
    source: 'card',
    type: 'next_card_boost',
    remainingRounds: 999,
    label: 'Fully Open Source: next Open Source card +20%',
    category: 'Open Source',
    multiplier: 0.2,
  }],
  'improve-ci-cd': [{
    sourceCardId: 'improve-ci-cd',
    source: 'card',
    type: 'next_card_boost',
    remainingRounds: 999,
    label: 'CI/CD Upgrade: next Operations card +15%',
    category: 'Operations',
    multiplier: 0.15,
  }],
  'hire-engineers': [{
    sourceCardId: 'hire-engineers',
    source: 'card',
    type: 'burn_rate_delta',
    remainingRounds: -1,
    label: 'Engineering Team Upkeep: burn rate +1',
    burnRateDelta: 1,
  }],
  'hire-sales-team': [{
    sourceCardId: 'hire-sales-team',
    source: 'card',
    type: 'burn_rate_delta',
    remainingRounds: -1,
    label: 'Sales Team Upkeep: burn rate +1',
    burnRateDelta: 1,
  }],
  'remote-company': [{
    sourceCardId: 'remote-company',
    source: 'card',
    type: 'burn_rate_delta',
    remainingRounds: -1,
    label: 'Remote Collaboration Savings: burn rate -1',
    burnRateDelta: -1,
  }],
  'launch-plugin-ecosystem': [{
    sourceCardId: 'launch-plugin-ecosystem',
    source: 'card',
    type: 'event_trigger',
    remainingRounds: 4,
    label: 'Plugin Ecosystem: trigger Ecosystem Explosion in 4 rounds',
    eventId: 'ecosystem-explosion',
  }],
  'open-core': [{
    sourceCardId: 'open-core',
    source: 'card',
    type: 'stat_per_round',
    remainingRounds: -1,
    label: 'Open Core Dual Track: +1 community per round',
    statEffects: { community: 1 },
  }],
  'automate-operations': [{
    sourceCardId: 'automate-operations',
    source: 'card',
    type: 'burn_rate_delta',
    remainingRounds: -1,
    label: 'Automation Savings: burn rate -1',
    burnRateDelta: -1,
  }],
  'cloud-cost-optimization': [{
    sourceCardId: 'cloud-cost-optimization',
    source: 'card',
    type: 'burn_rate_delta',
    remainingRounds: -1,
    label: 'Cloud Cost Savings: burn rate -1',
    burnRateDelta: -1,
  }],
}

const CARD_SYNERGIES: Array<{ cardA: string; cardB: string; bonus: StatEffect; label: string }> = [
  { cardA: 'developer-evangelism', cardB: 'hacker-news-launch', bonus: { growth: 3 }, label: 'PR Blitz: extra growth +3' },
  { cardA: 'hacker-news-launch', cardB: 'developer-evangelism', bonus: { growth: 3 }, label: 'PR Blitz: extra growth +3' },
  { cardA: 'open-core', cardB: 'enterprise-edition', bonus: { revenue: 2, community: 1 }, label: 'Dual Track Synergy: revenue +2, community +1' },
  { cardA: 'enterprise-edition', cardB: 'open-core', bonus: { revenue: 2, community: 1 }, label: 'Dual Track Synergy: revenue +2, community +1' },
  { cardA: 'sdk-release', cardB: 'platform-strategy', bonus: { growth: 2, community: 2 }, label: 'Platform Launch Synergy: growth +2, community +2' },
  { cardA: 'platform-strategy', cardB: 'sdk-release', bonus: { growth: 2, community: 2 }, label: 'Platform Launch Synergy: growth +2, community +2' },
  { cardA: 'hire-engineers', cardB: 'improve-ci-cd', bonus: { dev_speed: 2 }, label: 'Engineering Momentum: dev_speed +2' },
  { cardA: 'improve-ci-cd', cardB: 'hire-engineers', bonus: { dev_speed: 2 }, label: 'Engineering Momentum: dev_speed +2' },
  { cardA: 'security-audit', cardB: 'tech-debt-cleanup', bonus: { stability: 2, risk: -1 }, label: 'Clean Foundation: stability +2, risk -1' },
  { cardA: 'tech-debt-cleanup', cardB: 'security-audit', bonus: { stability: 2, risk: -1 }, label: 'Clean Foundation: stability +2, risk -1' },
  { cardA: 'free-tier', cardB: 'referral-program', bonus: { growth: 3 }, label: 'Viral Loop: growth +3' },
  { cardA: 'referral-program', cardB: 'free-tier', bonus: { growth: 3 }, label: 'Viral Loop: growth +3' },
  { cardA: 'community-events', cardB: 'contributor-program', bonus: { community: 2, trust: 1 }, label: 'Community Rally: community +2, trust +1' },
  { cardA: 'contributor-program', cardB: 'community-events', bonus: { community: 2, trust: 1 }, label: 'Community Rally: community +2, trust +1' },
  { cardA: 'consulting-services', cardB: 'enterprise-support', bonus: { revenue: 2, trust: 1 }, label: 'Full Service: revenue +2, trust +1' },
  { cardA: 'enterprise-support', cardB: 'consulting-services', bonus: { revenue: 2, trust: 1 }, label: 'Full Service: revenue +2, trust +1' },
]

const ROLE_CARD_LOADOUTS: Record<string, string[]> = {
  ceo: ['series-a', 'partner-program', 'strategic-investor'],
  cto: ['launch-plugin-ecosystem', 'sdk-release', 'tech-debt-cleanup'],
  cmo: ['developer-evangelism', 'product-hunt-launch', 'global-conference'],
  'vp-sales': ['enterprise-support', 'partner-program', 'hire-sales-team'],
  'staff-engineer': ['accept-community-prs', 'security-audit', 'contributor-program'],
  pm: ['public-roadmap', 'free-tier', 'platform-strategy'],
  vc: ['seed-round', 'series-a', 'strategic-investor'],
  devrel: ['community-events', 'developer-evangelism', 'public-roadmap'],
  cfo: ['reduce-burn', 'venture-debt', 'government-grant'],
  coo: ['build-internal-tools', 'automate-operations', 'cloud-cost-optimization'],
  cpo: ['platform-strategy', 'premium-features', 'product-hunt-launch'],
  legal: ['legal-defense', 'license-enforcement', 'government-grant'],
  security: ['security-audit', 'legal-defense', 'tech-debt-cleanup'],
  ai: ['sdk-release', 'usage-pricing', 'developer-evangelism'],
  cs: ['enterprise-support', 'community-events', 'partner-program'],
  people: ['hire-engineers', 'remote-company', 'contributor-program'],
  'growth-lead': ['free-tier', 'referral-program', 'hacker-news-launch'],
  bd: ['partner-program', 'marketplace-revenue', 'strategic-investor'],
  ux: ['dev-docs-push', 'public-roadmap', 'product-hunt-launch'],
  qa: ['improve-ci-cd', 'security-audit', 'tech-debt-cleanup'],
  sre: ['automate-operations', 'cloud-cost-optimization', 'security-audit'],
  support: ['enterprise-support', 'community-events', 'legal-defense'],
  localization: ['sdk-release', 'developer-evangelism', 'partner-program'],
  oss: ['open-governance', 'contributor-program', 'foundation-donation'],
  field: ['enterprise-support', 'consulting-services', 'partner-program'],
  pr: ['developer-evangelism', 'global-conference', 'public-roadmap'],
  'platform-pm': ['sdk-release', 'platform-strategy', 'launch-plugin-ecosystem'],
  privacy: ['security-audit', 'legal-defense', 'government-grant'],
}

const ROOM_BONUS_RULES: Record<string, Omit<RoomBonusState, 'roomId'>> = {
  hq: {
    label: 'War Room',
    summary: 'All strategy cards gain a modest edge and the next event pool skews toward leadership moments.',
    categoryBoosts: {
      'Open Source': 0.05,
      'Monetization': 0.05,
      'Growth': 0.05,
      'Operations': 0.05,
      'Finance': 0.05,
    },
    immediateEffect: { reputation: 1 },
    nextEventWeights: { 'major-conference-talk': 1.2, 'acquisition-offer': 1.15 },
    factionShift: { investors: 1 },
  },
  eng: {
    label: 'Architecture Workshop',
    summary: 'Operations and Open Source plays hit harder; tech crises ease slightly next round.',
    categoryBoosts: { 'Open Source': 0.15, Operations: 0.2 },
    immediateEffect: { stability: 1 },
    nextEventWeights: { 'major-security-vulnerability': 0.7, 'massive-outage': 0.75, 'kubernetes-adoption': 1.2 },
    factionShift: { ecosystem: 1 },
  },
  product: {
    label: 'Product Strategy Table',
    summary: 'Growth and Monetization options become cleaner and platform events are more likely to surface.',
    categoryBoosts: { Growth: 0.15, Monetization: 0.1 },
    immediateEffect: { growth: 1 },
    nextEventWeights: { 'developer-tool-integration': 1.2, 'platform-shift': 1.2, 'big-tech-competition': 1.15 },
    factionShift: { enterprise: 1 },
  },
  growth: {
    label: 'Launch Control',
    summary: 'Growth cards spike harder and media momentum is easier to convert into reputation.',
    categoryBoosts: { Growth: 0.2 },
    immediateEffect: { reputation: 1, growth: 1 },
    nextEventWeights: { 'viral-blog-post': 1.4, 'hacker-news-front-page': 1.3, 'global-dev-conference': 1.15 },
    factionShift: { enterprise: 1, community: 1 },
  },
  revenue: {
    label: 'Deal Desk',
    summary: 'Revenue lines accelerate, but the team leans further into enterprise expectations.',
    categoryBoosts: { Monetization: 0.2, Finance: 0.1 },
    immediateEffect: { revenue: 1 },
    nextEventWeights: { 'big-enterprise-contract': 1.4, 'cloud-partnership': 1.2, 'acquisition-offer': 1.15 },
    factionShift: { investors: 1, enterprise: 2 },
  },
  community: {
    label: 'Contributor Commons',
    summary: 'Open Source plays gain social leverage and community-driven branches become more likely.',
    categoryBoosts: { 'Open Source': 0.2, Growth: 0.05 },
    immediateEffect: { community: 1, trust: 1 },
    nextEventWeights: { 'github-stars-explosion': 1.25, 'developer-migration-wave': 1.2, 'open-source-fork': 1.1 },
    factionShift: { community: 2, ecosystem: 1 },
  },
  finance: {
    label: 'Treasury Office',
    summary: 'Finance and Operations cards become more efficient and runway pressure eases slightly.',
    categoryBoosts: { Finance: 0.2, Operations: 0.1 },
    immediateEffect: { cash: 2 },
    nextEventWeights: { 'vc-funding-winter': 0.75, 'government-regulation': 1.15, 'acquisition-offer': 1.1 },
    factionShift: { investors: 2, regulators: 1 },
  },
  platform: {
    label: 'Ecosystem Lab',
    summary: 'Platform synergies intensify and ecosystem events become much more likely.',
    categoryBoosts: { 'Open Source': 0.1, Growth: 0.1, Operations: 0.1 },
    immediateEffect: { dev_speed: 1, growth: 1 },
    nextEventWeights: { 'ecosystem-explosion': 1.6, 'industry-standardization': 1.25, 'developer-tool-integration': 1.25 },
    synergyBoost: { growth: 1, community: 1 },
    factionShift: { ecosystem: 2 },
  },
}

type TalentDefinition = {
  id: string
  label: string
  description: string
  immediateEffect?: StatEffect
  categoryBoosts?: Partial<Record<CardCategory, number>>
  roundStartEffect?: StatEffect
  roundEvery?: number
  burnRateDelta?: number
  eventWeights?: Partial<Record<string, number>>
  factionShift?: Partial<Record<FactionId, number>>
  roomFocus?: string
  profitableCashBonus?: number
  extraActionPointEvery?: number
  synergyBoost?: StatEffect
  techShield?: number
}

const TALENTS: Record<string, TalentDefinition> = {
  'executive-capital-discipline': {
    id: 'executive-capital-discipline',
    label: 'Capital Discipline',
    description: 'Trim burn and steady investor confidence.',
    immediateEffect: { cash: 3 },
    burnRateDelta: -1,
    factionShift: { investors: 1 },
  },
  'executive-boardroom-offensive': {
    id: 'executive-boardroom-offensive',
    label: 'Boardroom Offensive',
    description: 'Finance and Operations lines execute faster.',
    categoryBoosts: { Finance: 0.15, Operations: 0.1 },
    immediateEffect: { reputation: 1 },
  },
  'executive-vision-brand': {
    id: 'executive-vision-brand',
    label: 'Vision As Weapon',
    description: 'Every 2 rounds, convert clarity into reputation and trust.',
    roundStartEffect: { reputation: 1, trust: 1 },
    roundEvery: 2,
    factionShift: { community: 1 },
  },
  'executive-dealmaker-network': {
    id: 'executive-dealmaker-network',
    label: 'Dealmaker Network',
    description: 'Enterprise and acquisition events are easier to secure.',
    categoryBoosts: { Monetization: 0.1, Finance: 0.1 },
    eventWeights: { 'acquisition-offer': 1.35, 'big-enterprise-contract': 1.25, 'cloud-partnership': 1.2 },
    factionShift: { enterprise: 1, investors: 1 },
  },
  'engineering-architecture-guild': {
    id: 'engineering-architecture-guild',
    label: 'Architecture Guild',
    description: 'Operations lines become sharper and stability rises over time.',
    categoryBoosts: { Operations: 0.15, 'Open Source': 0.1 },
    roundStartEffect: { stability: 1 },
    roundEvery: 3,
  },
  'engineering-maintainer-culture': {
    id: 'engineering-maintainer-culture',
    label: 'Maintainer Culture',
    description: 'Open Source momentum compounds into trust and community.',
    categoryBoosts: { 'Open Source': 0.15 },
    roundStartEffect: { community: 1 },
    roundEvery: 2,
  },
  'engineering-release-train': {
    id: 'engineering-release-train',
    label: 'Release Train',
    description: 'Ship rhythm grants dev speed every 2 rounds.',
    roundStartEffect: { dev_speed: 1 },
    roundEvery: 2,
  },
  'engineering-platform-moat': {
    id: 'engineering-platform-moat',
    label: 'Platform Moat',
    description: 'Ecosystem and platform storylines get amplified.',
    categoryBoosts: { Growth: 0.1, 'Open Source': 0.1 },
    eventWeights: { 'ecosystem-explosion': 1.35, 'developer-tool-integration': 1.2, 'industry-standardization': 1.2 },
    roomFocus: 'platform',
  },
  'product-roadmap-discipline': {
    id: 'product-roadmap-discipline',
    label: 'Roadmap Discipline',
    description: 'Product direction sharpens Growth and Monetization cards.',
    categoryBoosts: { Growth: 0.1, Monetization: 0.1 },
    immediateEffect: { control: 1, reputation: 1 },
  },
  'product-discovery-loop': {
    id: 'product-discovery-loop',
    label: 'Discovery Loop',
    description: 'Customer learning compounds every 3 rounds.',
    roundStartEffect: { growth: 1, trust: 1 },
    roundEvery: 3,
    eventWeights: { 'developer-migration-wave': 1.15, 'competitor-shutdown': 1.15 },
  },
  'product-platform-expansion': {
    id: 'product-platform-expansion',
    label: 'Platform Expansion',
    description: 'Ecosystem routes accelerate and Product room visits pay off.',
    categoryBoosts: { Growth: 0.1, 'Open Source': 0.1 },
    roomFocus: 'product',
    eventWeights: { 'ecosystem-explosion': 1.25, 'industry-standardization': 1.2 },
  },
  'product-ux-compounding': {
    id: 'product-ux-compounding',
    label: 'UX Compounding',
    description: 'Every profitable round also grants a touch of community momentum.',
    profitableCashBonus: 1,
    categoryBoosts: { Growth: 0.1 },
    factionShift: { enterprise: 1 },
  },
  'growth-media-engine': {
    id: 'growth-media-engine',
    label: 'Media Engine',
    description: 'Growth plays hit harder and media events surge in weight.',
    categoryBoosts: { Growth: 0.15 },
    eventWeights: { 'viral-blog-post': 1.4, 'major-conference-talk': 1.2, 'hacker-news-front-page': 1.2 },
  },
  'growth-funnel-optimizer': {
    id: 'growth-funnel-optimizer',
    label: 'Funnel Optimizer',
    description: 'Growth actions convert better into enterprise traction.',
    categoryBoosts: { Growth: 0.1, Monetization: 0.1 },
    immediateEffect: { revenue: 1 },
  },
  'growth-brand-dominance': {
    id: 'growth-brand-dominance',
    label: 'Brand Dominance',
    description: 'Reputation surges every 2 rounds.',
    roundStartEffect: { reputation: 1 },
    roundEvery: 2,
  },
  'growth-viral-flywheel': {
    id: 'growth-viral-flywheel',
    label: 'Viral Flywheel',
    description: 'Extra action tempo appears every 4 rounds.',
    extraActionPointEvery: 4,
    eventWeights: { 'competitor-shutdown': 1.2, 'developer-tool-integration': 1.15 },
  },
  'revenue-deal-desk': {
    id: 'revenue-deal-desk',
    label: 'Deal Desk',
    description: 'Monetization turns sharper and enterprise trust rises.',
    categoryBoosts: { Monetization: 0.15, Finance: 0.1 },
    immediateEffect: { trust: 1 },
  },
  'revenue-customer-voice': {
    id: 'revenue-customer-voice',
    label: 'Voice Of Customer',
    description: 'Revenue routes gain community resilience.',
    categoryBoosts: { Monetization: 0.1, Growth: 0.05 },
    roundStartEffect: { trust: 1 },
    roundEvery: 3,
  },
  'revenue-land-expand': {
    id: 'revenue-land-expand',
    label: 'Land And Expand',
    description: 'Profitable rounds snowball harder.',
    profitableCashBonus: 2,
    eventWeights: { 'big-enterprise-contract': 1.3, 'cloud-partnership': 1.2 },
  },
  'revenue-channel-empire': {
    id: 'revenue-channel-empire',
    label: 'Channel Empire',
    description: 'Partner-heavy routes unlock bigger market pushes.',
    categoryBoosts: { Monetization: 0.1, Growth: 0.1 },
    eventWeights: { 'developer-tool-integration': 1.2, 'cloud-partnership': 1.2 },
    factionShift: { enterprise: 2 },
  },
  'community-ambassador-network': {
    id: 'community-ambassador-network',
    label: 'Ambassador Network',
    description: 'Community strength rises every 2 rounds.',
    roundStartEffect: { community: 1, trust: 1 },
    roundEvery: 2,
  },
  'community-governance-council': {
    id: 'community-governance-council',
    label: 'Governance Council',
    description: 'Open Source routes gain steadier influence.',
    categoryBoosts: { 'Open Source': 0.15 },
    immediateEffect: { trust: 2, control: -1 },
    factionShift: { community: 2, ecosystem: 1 },
  },
  'community-foundation-arc': {
    id: 'community-foundation-arc',
    label: 'Foundation Arc',
    description: 'Foundation and standards storylines become much more likely.',
    eventWeights: { 'foundation-formation': 1.5, 'industry-standardization': 1.25, 'ecosystem-explosion': 1.15 },
    roomFocus: 'community',
  },
  'community-fork-healer': {
    id: 'community-fork-healer',
    label: 'Fork Healer',
    description: 'Community crises land softer and recovery grows stronger.',
    techShield: 0.2,
    categoryBoosts: { 'Open Source': 0.1, Growth: 0.1 },
  },
  'finance-war-chest': {
    id: 'finance-war-chest',
    label: 'War Chest',
    description: 'Immediate liquidity and leaner burn.',
    immediateEffect: { cash: 4 },
    burnRateDelta: -1,
  },
  'finance-precision-funding': {
    id: 'finance-precision-funding',
    label: 'Precision Funding',
    description: 'Finance lines become more explosive.',
    categoryBoosts: { Finance: 0.15, Monetization: 0.05 },
    factionShift: { investors: 2 },
  },
  'finance-risk-hedge': {
    id: 'finance-risk-hedge',
    label: 'Risk Hedge',
    description: 'Every 2 rounds, trim risk exposure.',
    roundStartEffect: { risk: -1 },
    roundEvery: 2,
  },
  'finance-capital-machine': {
    id: 'finance-capital-machine',
    label: 'Capital Machine',
    description: 'Profitable rounds create additional treasury buffer.',
    profitableCashBonus: 2,
    categoryBoosts: { Finance: 0.1 },
  },
  'risk-compliance-shield': {
    id: 'risk-compliance-shield',
    label: 'Compliance Shield',
    description: 'Regulatory and legal pressure becomes easier to absorb.',
    roundStartEffect: { risk: -1 },
    roundEvery: 3,
    eventWeights: { 'government-regulation': 0.8, 'patent-lawsuit': 0.85, 'data-breach': 0.85 },
    factionShift: { regulators: 2 },
  },
  'risk-litigation-playbook': {
    id: 'risk-litigation-playbook',
    label: 'Litigation Playbook',
    description: 'Operations and Finance responses become sharper in crises.',
    categoryBoosts: { Operations: 0.1, Finance: 0.1 },
    immediateEffect: { stability: 1, reputation: 1 },
  },
  'risk-zero-trust': {
    id: 'risk-zero-trust',
    label: 'Zero Trust Program',
    description: 'Tech events and breach fallout weaken noticeably.',
    techShield: 0.3,
    categoryBoosts: { Operations: 0.1 },
  },
  'risk-public-trust': {
    id: 'risk-public-trust',
    label: 'Public Trust Protocol',
    description: 'Trust and reputation rise steadily through visible discipline.',
    roundStartEffect: { trust: 1, reputation: 1 },
    roundEvery: 3,
  },
  'people-talent-ladder': {
    id: 'people-talent-ladder',
    label: 'Talent Ladder',
    description: 'Action tempo spikes every 4 rounds and teams stabilize.',
    extraActionPointEvery: 4,
    roundStartEffect: { stability: 1 },
    roundEvery: 3,
  },
  'people-culture-covenant': {
    id: 'people-culture-covenant',
    label: 'Culture Covenant',
    description: 'Trust and community health improve steadily.',
    roundStartEffect: { trust: 1, community: 1 },
    roundEvery: 3,
  },
  'people-performance-loop': {
    id: 'people-performance-loop',
    label: 'Performance Loop',
    description: 'Operations and Growth cards benefit from stronger execution.',
    categoryBoosts: { Operations: 0.1, Growth: 0.1 },
    roomFocus: 'hq',
  },
  'people-founder-morale': {
    id: 'people-founder-morale',
    label: 'Founder Morale',
    description: 'Pressure climbs slower because the team bends instead of breaks.',
    roundStartEffect: { pressure: -1 },
    roundEvery: 4,
  },
  'support-incident-drill': {
    id: 'support-incident-drill',
    label: 'Incident Drill',
    description: 'Tech crises lose part of their sting.',
    techShield: 0.25,
    categoryBoosts: { Operations: 0.1 },
  },
  'support-voice-of-customer': {
    id: 'support-voice-of-customer',
    label: 'Voice Of Customer',
    description: 'Trust and enterprise alignment rise together.',
    roundStartEffect: { trust: 1 },
    roundEvery: 2,
    factionShift: { enterprise: 1 },
  },
  'support-service-flywheel': {
    id: 'support-service-flywheel',
    label: 'Service Flywheel',
    description: 'Monetization and Operations become more reliable.',
    categoryBoosts: { Monetization: 0.1, Operations: 0.1 },
    profitableCashBonus: 1,
  },
  'support-knowledge-network': {
    id: 'support-knowledge-network',
    label: 'Knowledge Network',
    description: 'Community help and docs multiply ecosystem value.',
    roundStartEffect: { community: 1 },
    roundEvery: 3,
    eventWeights: { 'developer-tool-integration': 1.15, 'developer-migration-wave': 1.15 },
  },
  'operations-process-forge': {
    id: 'operations-process-forge',
    label: 'Process Forge',
    description: 'Operations become faster and calmer.',
    categoryBoosts: { Operations: 0.15 },
    immediateEffect: { stability: 1, control: 1 },
  },
  'operations-resilience-loop': {
    id: 'operations-resilience-loop',
    label: 'Resilience Loop',
    description: 'Stability and cash discipline improve over time.',
    roundStartEffect: { stability: 1 },
    roundEvery: 2,
    profitableCashBonus: 1,
  },
  'operations-squad-rhythm': {
    id: 'operations-squad-rhythm',
    label: 'Squad Rhythm',
    description: 'Every 4 rounds, gain an extra action point from execution cadence.',
    extraActionPointEvery: 4,
    categoryBoosts: { Growth: 0.05, Operations: 0.1 },
  },
  'operations-delivery-aura': {
    id: 'operations-delivery-aura',
    label: 'Delivery Aura',
    description: 'Room visits outside HQ become more rewarding.',
    roomFocus: 'eng',
    categoryBoosts: { Operations: 0.1, Finance: 0.05 },
  },
}

const ARCHETYPE_TRACK: Record<string, string> = {
  executive: 'executive',
  engineering: 'engineering',
  product: 'product',
  growth: 'growth',
  revenue: 'revenue',
  community: 'community',
  finance: 'finance',
  risk: 'risk',
  people: 'people',
  support: 'support',
  operations: 'operations',
  data: 'engineering',
  design: 'growth',
}

const TALENT_TRACKS: Record<string, { growth: [string, string]; scale: [string, string] }> = {
  executive: {
    growth: ['executive-capital-discipline', 'executive-boardroom-offensive'],
    scale: ['executive-vision-brand', 'executive-dealmaker-network'],
  },
  engineering: {
    growth: ['engineering-architecture-guild', 'engineering-maintainer-culture'],
    scale: ['engineering-release-train', 'engineering-platform-moat'],
  },
  product: {
    growth: ['product-roadmap-discipline', 'product-discovery-loop'],
    scale: ['product-platform-expansion', 'product-ux-compounding'],
  },
  growth: {
    growth: ['growth-media-engine', 'growth-funnel-optimizer'],
    scale: ['growth-brand-dominance', 'growth-viral-flywheel'],
  },
  revenue: {
    growth: ['revenue-deal-desk', 'revenue-customer-voice'],
    scale: ['revenue-land-expand', 'revenue-channel-empire'],
  },
  community: {
    growth: ['community-ambassador-network', 'community-governance-council'],
    scale: ['community-foundation-arc', 'community-fork-healer'],
  },
  finance: {
    growth: ['finance-war-chest', 'finance-precision-funding'],
    scale: ['finance-risk-hedge', 'finance-capital-machine'],
  },
  risk: {
    growth: ['risk-compliance-shield', 'risk-litigation-playbook'],
    scale: ['risk-zero-trust', 'risk-public-trust'],
  },
  people: {
    growth: ['people-talent-ladder', 'people-culture-covenant'],
    scale: ['people-performance-loop', 'people-founder-morale'],
  },
  support: {
    growth: ['support-incident-drill', 'support-voice-of-customer'],
    scale: ['support-service-flywheel', 'support-knowledge-network'],
  },
  operations: {
    growth: ['operations-process-forge', 'operations-resilience-loop'],
    scale: ['operations-squad-rhythm', 'operations-delivery-aura'],
  },
}

const TEMPLATE_EVENT_BIASES: Record<string, Partial<Record<string, number>>> = {
  redis: { 'cloud-vendor-fork': 2, 'open-source-fork': 1.1 },
  mongodb: { 'licensing-controversy': 1.8 },
  elastic: { 'cloud-vendor-fork': 1.6, 'cloud-partnership': 1.1 },
  hashicorp: { 'licensing-controversy': 2.2, 'industry-standardization': 1.1 },
  gitlab: { 'big-tech-competition': 1.7, 'major-conference-talk': 1.15 },
  redhat: { 'big-enterprise-contract': 2, 'foundation-formation': 1.15 },
  docker: { 'industry-standardization': 1.8, 'developer-tool-integration': 1.1 },
  kubernetes: { 'ecosystem-explosion': 1.8, 'foundation-formation': 1.4, 'industry-standardization': 1.3 },
  dify: { 'ai-hype-cycle': 2, 'cloud-vendor-fork': 1.4, 'developer-tool-integration': 1.15 },
}

const CARD_WORLD_FLAGS: Partial<Record<string, string[]>> = {
  'launch-plugin-ecosystem': ['ecosystem_ready'],
  'platform-strategy': ['ecosystem_ready', 'platform_route'],
  'foundation-donation': ['foundation_path'],
  'open-core': ['open_core_route'],
  'hosted-saas': ['cloud_surface'],
  'dual-license': ['license_hardened'],
  'seed-round': ['funded_seed'],
  'series-a': ['funded_series_a'],
  'series-b': ['funded_series_b'],
  ipo: ['ipo_ready'],
  'strategic-investor': ['strategic_backer'],
}

const EVENT_OPTION_RULES: Record<string, Record<number, {
  flags?: string[]
  clearFlags?: string[]
  ongoingEffect?: StatEffect
  ongoingRounds?: number
  followupEventId?: string
  followupInRounds?: number
  factionEffects?: Partial<Record<FactionId, number>>
}>> = {
  'open-source-maintainer-burnout': {
    0: { ongoingEffect: { cash: -2 }, ongoingRounds: 2, flags: ['maintainer_supported'], factionEffects: { community: 2 } },
    1: { followupEventId: 'github-stars-explosion', followupInRounds: 2, flags: ['maintainer_recruitment'] },
  },
  'vc-funding-winter': {
    0: { ongoingEffect: { cash: 2, growth: -1 }, ongoingRounds: 3, flags: ['winter_cutbacks'] },
    1: { ongoingEffect: { revenue: 1 }, ongoingRounds: 3, flags: ['commercial_push'], factionEffects: { investors: 1 } },
    2: { flags: ['strategic_search'], followupEventId: 'cloud-partnership', followupInRounds: 2 },
  },
  'government-regulation': {
    1: { ongoingEffect: { risk: 1 }, ongoingRounds: 2, flags: ['regulator_tension'], factionEffects: { regulators: -1 } },
  },
  'viral-blog-post': {
    0: { ongoingEffect: { reputation: 1, growth: 1 }, ongoingRounds: 3, flags: ['media_tailwind'] },
  },
  'big-enterprise-contract': {
    0: { ongoingEffect: { revenue: 3, stability: -1 }, ongoingRounds: 4, flags: ['benchmark_customer'], factionEffects: { enterprise: 2, investors: 1 } },
    2: { flags: ['benchmark_customer'], factionEffects: { enterprise: 1 } },
  },
  'cloud-vendor-fork': {
    0: { flags: ['license_hardened'], followupEventId: 'licensing-controversy', followupInRounds: 1, factionEffects: { community: -1, investors: 1 } },
    2: { flags: ['community_moat'], factionEffects: { community: 2, ecosystem: 1 } },
  },
  'big-tech-competition': {
    2: { followupEventId: 'acquisition-offer', followupInRounds: 2, factionEffects: { investors: 1, enterprise: 1 } },
  },
}

export type GameConfig = {
  role: RoleProfile
  template: CompanyTemplate
  gameModeId: string
  organizationId: string
}

type MultiplierInfo = {
  multiplier: number
  consumedBoostIds: string[]
  roomBonus: number
  orgBonus: number
  talentBonus: number
  bonusSources: string[]
}

let effectIdCounter = 0

function makeEffectId(sourceCardId: string) {
  return `${sourceCardId}-${++effectIdCounter}-${Date.now()}`
}

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

function mergeEffects(...effects: Array<StatEffect | null | undefined>): StatEffect {
  const result: StatEffect = {}
  for (const effect of effects) {
    if (!effect) continue
    for (const [key, value] of Object.entries(effect)) {
      result[key as StatId] = (result[key as StatId] ?? 0) + (value as number)
    }
  }
  return result
}

function scaleEffect(effect: StatEffect, multiplier: number): StatEffect {
  const result: StatEffect = {}
  for (const [key, value] of Object.entries(effect)) {
    result[key as StatId] = Math.round((value as number) * multiplier)
  }
  return result
}

function buildDeck(role: RoleProfile): Card[] {
  const roleCardIds = new Set(ROLE_CARD_LOADOUTS[role.id] ?? [])
  const deck = STRATEGY_CARDS.filter(card => {
    if (card.core) return true
    if (card.archetypes?.includes(role.archetype)) return true
    if (roleCardIds.has(card.id)) return true
    return false
  })

  shuffle(deck)

  const revenueCardIds = new Set([
    'consulting-services',
    'open-core',
    'partner-program',
    'enterprise-support',
    'crowdfunding',
  ])
  const topSlice = deck.slice(-4)
  const hasRevenue = topSlice.some(card => revenueCardIds.has(card.id))
  if (!hasRevenue) {
    const idx = deck.findIndex(card => revenueCardIds.has(card.id))
    if (idx >= 0 && idx < deck.length - 4) {
      const last = deck.length - 1
      ;[deck[idx], deck[last]] = [deck[last], deck[idx]]
    }
  }

  return deck
}

function computeMultipliers(role: RoleProfile, template: CompanyTemplate, organizationId?: string): Record<string, number> {
  const categories: CardCategory[] = ['Open Source', 'Monetization', 'Growth', 'Operations', 'Finance']
  const org = organizations.find(item => item.id === organizationId)
  const result: Record<string, number> = {}
  for (const category of categories) {
    const rm = role.effectMultipliers[category] ?? 1
    const tm = template.effectMultipliers[category] ?? 1
    const om = org?.cardCategoryMultipliers[category] ?? 1
    result[category] = Math.round(rm * tm * om * 100) / 100
  }
  return result
}

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
        const statKey = key as StatId
        if (stats[statKey] !== undefined) {
          stats[statKey] = this.clamp(stats[statKey] + val, 0, MAX_STATS[statKey])
        }
      }
      for (const [key, val] of Object.entries(template.modifiers)) {
        const statKey = key as StatId
        if (stats[statKey] !== undefined && val !== undefined) {
          stats[statKey] = this.clamp(stats[statKey] + val, 0, MAX_STATS[statKey])
        }
      }
    }

    const org = this.config ? organizations.find(item => item.id === this.config!.organizationId) : null
    const maxActionPoints = org?.maxActionPoints ?? 3

    return {
      stats,
      round: 1,
      phase: 'event',
      activeEvent: null,
      hand: [],
      deck: this.config ? buildDeck(this.config.role) : [...STRATEGY_CARDS],
      discardPile: [],
      actionPoints: maxActionPoints,
      maxActionPoints,
      history: [],
      roleId: this.config?.role.id ?? '',
      templateId: this.config?.template.id ?? '',
      effectMultipliers: this.config
        ? computeMultipliers(this.config.role, this.config.template, this.config.organizationId)
        : { 'Open Source': 1, 'Monetization': 1, 'Growth': 1, 'Operations': 1, 'Finance': 1 },
      playedCardIds: [],
      activeEffects: [],
      usedEventIds: [],
      pendingEventId: null,
      gameModeId: this.config?.gameModeId ?? 'survival',
      burnRate: this.config?.role.archetype === 'finance' ? 1 : 2,
      victory: 'none',
      victoryReason: '',
      roundSummary: null,
      cardsPlayedThisRound: [],
      previousRoundStats: null,
      gameStage: 'seed',
      worldFlags: [],
      resolvedChains: [],
      factionReputation: { ...NEUTRAL_FACTIONS },
      selectedRoomId: null,
      roomBonus: null,
      progressionSelections: [],
      stageMilestones: ['seed'],
      pendingThreats: [],
    }
  }

  startRound() {
    this.cardsPlayedThisRound = 0
    this.state.cardsPlayedThisRound = []
    this.state.roundSummary = null
    this.state.roomBonus = null
    this.state.hand = []
    this.state.previousRoundStats = { ...this.state.stats }
    this.state.gameStage = this.getStageForRound(this.state.round)
    this.state.actionPoints = this.getCurrentMaxActionPoints()
    this.state.maxActionPoints = this.getCurrentMaxActionPoints()

    this.tickEffects()
    this.applyRolePassives()
    this.applyTalentRoundStartEffects()
    this.applyGameStageEffects()
    this.applyTemplateRoundStartPassives()

    const milestone = this.getPendingStageMilestone()
    if (milestone) {
      this.state.activeEvent = this.buildProgressionEvent(milestone)
      this.state.phase = 'event'
      this.refreshThreats()
      this.log('event', `Stage breakthrough: ${milestone}. Choose your company evolution.`)
      return
    }

    const event = this.drawEvent()
    this.state.activeEvent = event
    this.state.phase = 'event'
    this.log('event', `Round ${this.state.round} started. Event: ${event.title}`)

    if (event.immediateEffect) {
      this.applyImmediateEventImpact(event)
    }
    this.applyEventDuration(event)
    this.refreshThreats()
  }

  resolveEvent(optionIndex: number) {
    if (!this.state.activeEvent) return
    const event = this.state.activeEvent
    const option = event.options[optionIndex]
    if (!option) return

    if (event.id.startsWith('progression-')) {
      const talentId = option.unlocks
      if (talentId) this.applyProgressionChoice(talentId, event.id)
      this.state.activeEvent = null
      this.state.phase = 'planning'
      this.refreshThreats()
      return
    }

    const optionLabel = getEventOptionLabel(event.id, optionIndex, option.label)
    this.log('decision', `Selected: ${optionLabel}`)
    this.applyEffect(option.effect)
    this.applyEventOptionRandom(event.id, optionIndex)
    this.applyEventOptionConsequences(event, option, optionIndex)

    if (event.id === 'acquisition-offer' && optionIndex === 0) {
      this.state.playedCardIds.push('__acquisition_accepted')
      this.log('system', 'Acquisition accepted. Exit path triggered.')
    }

    this.state.activeEvent = null
    this.state.phase = 'planning'
    this.refreshThreats()
  }

  chooseRoom(roomId: string) {
    if (this.state.phase !== 'planning') return
    const bonusDef = ROOM_BONUS_RULES[roomId]
    if (!bonusDef) return

    this.state.selectedRoomId = roomId
    this.state.roomBonus = { roomId, ...bonusDef }
    if (bonusDef.immediateEffect) this.applyEffect(bonusDef.immediateEffect)
    if (bonusDef.factionShift) this.adjustFactions(bonusDef.factionShift)
    this.log('buff', `[Room Visit] ${bonusDef.label}: ${bonusDef.summary}`)

    if (this.config?.organizationId === 'matrix' && this.state.cardsPlayedThisRound.length === 0) {
      this.log('buff', '[Org Passive] Matrix teams are primed for cross-functional combo bonuses this round')
    }

    this.state.phase = 'action'
    this.drawHand()
    this.refreshThreats()
  }

  playCard(cardId: string) {
    if (this.state.phase !== 'action') return
    if (this.state.actionPoints <= 0) return

    const cardIndex = this.state.hand.findIndex(card => card.id === cardId)
    if (cardIndex === -1) return
    const card = this.state.hand[cardIndex]

    if (card.condition && !this.evaluateCondition(card.condition)) {
      this.log('system', `Cannot play [${card.title}]: condition unmet (${getTranslatedCardConditionForLog(card)})`)
      return
    }

    const multiplierInfo = this.getMultiplierInfo(card, true)
    const finalMultiplier = multiplierInfo.multiplier
    if (multiplierInfo.consumedBoostIds.length > 0) {
      this.state.activeEffects = this.state.activeEffects.filter(
        effect => !multiplierInfo.consumedBoostIds.includes(effect.id),
      )
    }

    const logSuffix = finalMultiplier !== 1
      ? ` (x${Math.round(finalMultiplier * 100) / 100})`
      : ''
    this.log('action', `Played strategy card: ${card.title}${logSuffix}`)

    this.applyEffect(card.effect, finalMultiplier)
    if (card.cost) this.applyEffect(card.cost)

    const immediateBonus = CARD_IMMEDIATE_BONUS[card.id]
    if (immediateBonus) this.applyEffect(immediateBonus)

    this.applyCardSpecialRandom(card.id)
    this.applyCardBuff(card)
    this.applyTemplateAbility(card)
    this.applyCardWorldRules(card)

    if (card.category === 'Monetization' && this.state.stats.trust >= 8) {
      const communityLoss = card.effect.community ?? 0
      if (communityLoss < 0) {
        const recovery = Math.ceil(Math.abs(communityLoss) / 2)
        this.applyEffect({ community: recovery })
        this.log('buff', `[Stat Bonus] High trust: community loss halved (+${recovery} recovery)`)
      }
    }

    this.checkAndApplySynergy(card.id)
    this.applyMatrixOrganizationBonus(card)
    this.adjustFactions(this.getFactionDeltaForCard(card))

    this.state.playedCardIds.push(card.id)
    this.state.cardsPlayedThisRound.push(card.id)
    this.cardsPlayedThisRound++

    this.state.hand.splice(cardIndex, 1)
    if (!card.oneshot) {
      this.state.discardPile.push(card)
    } else {
      this.log('system', `[${card.title}] is a one-time card and has been removed from the game.`)
    }
    this.state.actionPoints -= 1
    this.refreshThreats()
  }

  endTurn() {
    const previousStats = { ...this.state.stats }

    if (this.state.gameStage === 'scale') {
      this.state.stats.pressure = this.clamp(this.state.stats.pressure + 1, 0, MAX_STATS.pressure)
      this.log('system', '[Scale Stage] Investor pressure increases: pressure +1')
    }

    const effectiveBurn = this.getEffectiveBurnRate()
    const netIncome = this.state.stats.revenue - effectiveBurn
    this.state.stats.cash = this.clamp(this.state.stats.cash + netIncome, 0, MAX_STATS.cash)

    this.applyProfitTalents(netIncome)

    this.log('system', `Round ${this.state.round} ended. Net income: ${netIncome > 0 ? '+' : ''}${netIncome} (burn: ${effectiveBurn})`)

    const statDeltas: StatEffect = {}
    for (const key of Object.keys(this.state.stats) as StatId[]) {
      const delta = this.state.stats[key] - previousStats[key]
      if (delta !== 0) statDeltas[key] = delta
    }

    const expiredEffects = this.state.activeEffects
      .filter(effect => effect.remainingRounds === 1 && effect.type !== 'burn_rate_delta')
      .map(effect => effect.label)

    this.state.roundSummary = {
      round: this.state.round,
      revenue: this.state.stats.revenue,
      burnRate: effectiveBurn,
      netIncome,
      statDeltas,
      expiredEffects,
      newEffects: [],
      previousStats,
      selectedRoomId: this.state.selectedRoomId,
      pendingThreats: [...this.state.pendingThreats],
    }

    const verdict = this.checkVictory()
    if (verdict !== 'none') {
      this.state.victory = verdict
      this.state.phase = 'resolution'
      this.log(
        'victory',
        verdict === 'win'
          ? `Victory! ${this.state.victoryReason}`
          : `Game over. ${this.state.victoryReason}`,
      )
      return
    }

    this.state.phase = 'summary'
    this.refreshThreats()
  }

  advanceFromSummary() {
    this.state.round += 1
    this.state.discardPile.push(...this.state.hand)
    this.state.hand = []
    this.startRound()
  }

  canPlayCard(cardId: string): boolean {
    if (this.state.phase !== 'action') return false
    if (this.state.actionPoints <= 0) return false
    const card = this.state.hand.find(item => item.id === cardId)
    if (!card) return false
    if (card.condition) return this.evaluateCondition(card.condition)
    return true
  }

  private checkVictory(): 'none' | 'win' | 'lose' {
    const { stats, round, gameModeId, playedCardIds } = this.state
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

  private evaluateCondition(condition: string): boolean {
    if (!condition) return true
    const clean = condition
      .replace(/（[^）]*）/g, '')
      .replace(/\([^)]*\)/g, '')
      .trim()

    const playedMatches = [...clean.matchAll(/「([^」]+)」/g)].map(match => match[1])
    if (playedMatches.length > 0 && clean.includes('需先打出')) {
      const ids = playedMatches
        .map(title => STRATEGY_CARDS.find(card => card.title === title)?.id)
        .filter(Boolean) as string[]
      if (clean.includes('或')) {
        return ids.some(id => this.state.playedCardIds.includes(id))
      }
      return ids.every(id => this.state.playedCardIds.includes(id))
    }

    if (clean.includes('游戏开局')) return this.state.round <= 5

    if (clean.includes('仅在触发')) {
      return this.state.usedEventIds.some(id =>
        id === 'patent-lawsuit' || id === 'government-regulation' || id === 'licensing-controversy',
      )
    }

    if (clean.includes('且')) {
      return clean.split('且').every(part => this.evaluateSingleCondition(part.trim()))
    }
    if (clean.includes('或')) {
      return clean.split('或').some(part => this.evaluateSingleCondition(part.trim()))
    }

    return this.evaluateSingleCondition(clean)
  }

  private evaluateSingleCondition(condition: string): boolean {
    const completedMatch = condition.match(/已完成\s*(.+)/)
    if (completedMatch) {
      const title = completedMatch[1].trim()
      const card = STRATEGY_CARDS.find(item => item.title === title)
      return card ? this.state.playedCardIds.includes(card.id) : true
    }

    const flagMatch = condition.match(/flag:([\w-]+)/)
    if (flagMatch) {
      return this.state.worldFlags.includes(flagMatch[1])
    }

    const statMatch = condition.match(/(\w+)\s*(>=|<=|>|<|==)\s*(\d+)/)
    if (statMatch) {
      const [, statKey, op, valStr] = statMatch
      const statValue = this.state.stats[statKey as StatId] ?? 0
      const threshold = parseInt(valStr, 10)
      switch (op) {
        case '>=': return statValue >= threshold
        case '<=': return statValue <= threshold
        case '>': return statValue > threshold
        case '<': return statValue < threshold
        case '==': return statValue === threshold
      }
    }

    return true
  }

  private tickEffects() {
    const toRemove: string[] = []
    for (const effect of this.state.activeEffects) {
      if (effect.type === 'stat_per_round' && effect.statEffects) {
        this.applyEffect(effect.statEffects)
        this.log('buff', `[Ongoing Effect] ${effect.label}`)
      }

      if (effect.remainingRounds > 0 && effect.type !== 'burn_rate_delta') {
        effect.remainingRounds -= 1

        if (effect.type === 'event_trigger' && effect.remainingRounds <= 0) {
          this.state.pendingEventId = effect.eventId ?? null
          this.log('buff', `[Triggered Event] ${effect.label}`)
          toRemove.push(effect.id)
          continue
        }

        if (effect.remainingRounds <= 0 && effect.type !== 'next_card_boost') {
          toRemove.push(effect.id)
        }
      }
    }

    this.state.activeEffects = this.state.activeEffects.filter(effect => !toRemove.includes(effect.id))
  }

  private applyCardBuff(card: Card) {
    const templates = CARD_ACTIVE_EFFECTS[card.id]
    if (!templates) return
    for (const template of templates) {
      if (template.type === 'burn_rate_delta' && template.burnRateDelta !== undefined) {
        this.state.burnRate = Math.max(1, this.state.burnRate + template.burnRateDelta)
        this.log('buff', `[Cost Change] ${template.label} -> burn per round: ${this.state.burnRate}`)
        continue
      }
      const effect: ActiveEffect = { ...template, id: makeEffectId(card.id) }
      this.state.activeEffects.push(effect)
      this.log('buff', `[Effect Activated] ${template.label}`)
    }
  }

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

  private applyEventOptionRandom(eventId: string, optionIndex: number) {
    if (eventId === 'patent-lawsuit' && optionIndex === 0) {
      if (Math.random() < 0.5) {
        this.applyEffect({ reputation: 4 })
        this.log('system', 'Patent lawsuit: won the case! Reputation +4.')
      } else {
        this.applyEffect({ cash: -6 })
        this.log('system', 'Patent lawsuit: lost the case. Cash -6.')
      }
    }
  }

  private applyTemplateAbility(card: Card) {
    const templateId = this.config?.template.id
    if (!templateId) return

    switch (templateId) {
      case 'redis':
        if (card.category === 'Open Source') {
          this.applyEffect({ trust: 1 })
          this.log('buff', '[Redis Passive] antirez effect: trust +1')
        }
        break
      case 'mongodb':
        if (card.id === 'enterprise-edition' && (card.effect.community ?? 0) < 0) {
          this.applyEffect({ community: -(card.effect.community ?? 0) })
          this.log('buff', '[MongoDB Passive] Open-Core flywheel: enterprise edition does not lose community')
        }
        break
      case 'gitlab':
        if (card.id === 'open-governance' || card.id === 'public-roadmap') {
          this.applyEffect(card.effect)
          this.log('buff', '[GitLab Passive] Transparency culture: governance/roadmap card effects doubled')
        }
        break
      case 'redhat':
        if (card.category === 'Open Source') {
          this.applyEffect({ revenue: 1 })
          this.log('buff', '[Red Hat Passive] Upstream First: revenue +1')
        }
        break
      case 'kubernetes':
        if (card.id === 'open-governance') {
          const bonus: StatEffect = {}
          if (card.effect.community) bonus.community = card.effect.community
          if (card.effect.trust) bonus.trust = card.effect.trust
          this.applyEffect(bonus)
          this.log('buff', '[Kubernetes Passive] Foundation governance: community/trust doubled')
        }
        break
      case 'elastic':
        if (this.cardsPlayedThisRound >= 1) {
          this.applyEffect({ community: 1 })
          this.log('buff', '[Elastic Passive] Stack synergy: combo bonus community +1')
        }
        break
      case 'hashicorp':
        if (card.category === 'Monetization' && (!card.condition || this.evaluateCondition(card.condition))) {
          this.applyEffect(scaleEffect(card.effect, 0.25))
          this.log('buff', '[HashiCorp Passive] Toolchain lock-in: conditional monetization gains +25%')
        }
        break
    }
  }

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

    if (this.config?.organizationId === 'foundation') {
      this.applyEffect({ community: 1 })
      this.log('buff', '[Org Passive] Foundation governance: community +1')
    }
  }

  private applyTemplateRoundStartPassives() {
    if (
      this.config?.template.id === 'dify' &&
      this.state.round % 3 === 0 &&
      this.state.round > 1
    ) {
      this.state.actionPoints = Math.min(this.state.actionPoints + 1, this.state.maxActionPoints + 1)
      this.log('buff', 'Dify Fast-Track: +1 extra action point')
    }

    if (this.state.stats.dev_speed >= 6) {
      this.log('buff', '[Stat Bonus] High dev speed: +1 card draw this round')
    }
  }

  private applyImmediateEventImpact(event: GameEvent) {
    if (!event.immediateEffect) return
    const techShield = this.getTechShield()
    if (
      techShield > 0 &&
      event.category === 'Tech' &&
      this.hasNegativeEffect(event.immediateEffect)
    ) {
      const reduced = this.reduceNegativeEffects(event.immediateEffect, techShield)
      this.applyEffect(reduced)
      this.log('buff', `[Defense] Tech crisis damage reduced by ${Math.round(techShield * 100)}%`)
      return
    }

    if (
      this.state.stats.stability >= 8 &&
      event.category === 'Tech' &&
      this.hasNegativeEffect(event.immediateEffect)
    ) {
      const reduced = this.reduceNegativeEffects(event.immediateEffect, 0.3)
      this.applyEffect(reduced)
      this.log('buff', '[Stat Bonus] High stability: tech event damage reduced by 30%')
      return
    }

    this.applyEffect(event.immediateEffect)
  }

  private applyEventDuration(event: GameEvent) {
    if (!event.duration || event.duration <= 1) return
    const ongoing = event.ongoingEffect ?? this.deriveOngoingEffect(event.immediateEffect)
    if (!ongoing || Object.keys(ongoing).length === 0) return
    this.state.activeEffects.push({
      id: makeEffectId(`event-${event.id}`),
      sourceCardId: `event-${event.id}`,
      source: 'event',
      type: 'stat_per_round',
      remainingRounds: event.duration - 1,
      label: `${event.title}: lingering pressure`,
      statEffects: ongoing,
    })
    this.log('buff', `[World State] ${event.title} will continue to influence future rounds`)
  }

  private applyEventOptionConsequences(event: GameEvent, option: GameEvent['options'][number], optionIndex: number) {
    if (option.unlocks) {
      this.scheduleEvent(option.unlocks, 1, `${event.title} follow-up`)
      this.pushResolvedChain(option.unlocks)
    }

    if (option.setsFlags) this.addFlags(option.setsFlags)
    if (option.clearsFlags) this.removeFlags(option.clearsFlags)
    if (option.followupEventId) {
      this.scheduleEvent(option.followupEventId, option.followupInRounds ?? 1, `${event.title} follow-up`)
      this.pushResolvedChain(option.followupEventId)
    }
    if (option.factionEffects) this.adjustFactions(option.factionEffects)

    const rule = EVENT_OPTION_RULES[event.id]?.[optionIndex]
    if (rule?.flags) this.addFlags(rule.flags)
    if (rule?.clearFlags) this.removeFlags(rule.clearFlags)
    if (rule?.factionEffects) this.adjustFactions(rule.factionEffects)
    if (rule?.ongoingEffect && rule.ongoingRounds) {
      const optionLabel = getEventOptionLabel(event.id, optionIndex, option.label)
      this.state.activeEffects.push({
        id: makeEffectId(`event-option-${event.id}-${optionIndex}`),
        sourceCardId: `event-option-${event.id}-${optionIndex}`,
        source: 'event',
        type: 'stat_per_round',
        remainingRounds: rule.ongoingRounds,
        label: `${event.title}: ${optionLabel}`,
        statEffects: rule.ongoingEffect,
      })
      this.log('buff', `[Chain] ${optionLabel} will keep shaping future rounds`)
    }
    if (rule?.followupEventId) {
      const optionLabel = getEventOptionLabel(event.id, optionIndex, option.label)
      this.scheduleEvent(rule.followupEventId, rule.followupInRounds ?? 1, `${optionLabel} consequence`)
      this.pushResolvedChain(rule.followupEventId)
    }

    this.adjustFactions(this.getFactionDeltaForEventOption(event, option))
  }

  private drawEvent(): GameEvent {
    if (this.state.pendingEventId) {
      const pending = GAME_EVENTS.find(event => event.id === this.state.pendingEventId)
      this.state.pendingEventId = null
      if (pending) {
        this.recordUsedEvent(pending.id)
        return pending
      }
    }

    const recentlyUsed = new Set(this.state.usedEventIds.slice(-5))
    const round = this.state.round
    const weighted: Array<{ event: GameEvent; weight: number }> = []

    for (const event of GAME_EVENTS) {
      if (recentlyUsed.has(event.id)) continue
      if (!this.isEventAvailable(event, round)) continue
      const weight = this.getEventWeight(event)
      if (weight <= 0) continue
      weighted.push({ event, weight })
    }

    const pool = weighted.length > 0
      ? weighted
      : GAME_EVENTS.map(event => ({ event, weight: 1 }))

    const total = pool.reduce((sum, item) => sum + item.weight, 0)
    let roll = Math.random() * total
    for (const item of pool) {
      roll -= item.weight
      if (roll <= 0) {
        this.recordUsedEvent(item.event.id)
        return item.event
      }
    }

    const fallback = pool[pool.length - 1].event
    this.recordUsedEvent(fallback.id)
    return fallback
  }

  private isEventAvailable(event: GameEvent, round: number): boolean {
    const phase = event.phase ?? 'any'
    if (phase === 'early' && round > 5) return false
    if (phase === 'mid' && round < 3) return false
    if (phase === 'late' && round < 7) return false

    if (event.requiresFlagsAll && !event.requiresFlagsAll.every(flag => this.state.worldFlags.includes(flag))) {
      return false
    }
    if (event.requiresFlagsAny && !event.requiresFlagsAny.some(flag => this.state.worldFlags.includes(flag))) {
      return false
    }
    if (event.blocksFlags && event.blocksFlags.some(flag => this.state.worldFlags.includes(flag))) {
      return false
    }

    if (!this.evaluateSpecialEventAvailability(event.id)) return false
    if (event.triggerCondition && !this.evaluateTriggerCondition(event.triggerCondition)) return false
    return true
  }

  private evaluateSpecialEventAvailability(eventId: string): boolean {
    switch (eventId) {
      case 'ecosystem-explosion':
        return this.hasAnyFlag(['ecosystem_ready', 'platform_route'])
          || this.hasPlayedAny(['launch-plugin-ecosystem', 'platform-strategy'])
      case 'foundation-formation':
        return this.hasAnyFlag(['foundation_path', 'community_foundation'])
      default:
        return true
    }
  }

  private getEventWeight(event: GameEvent): number {
    let weight = 1

    const templateBias = TEMPLATE_EVENT_BIASES[this.config?.template.id ?? '']
    if (templateBias?.[event.id]) weight *= templateBias[event.id] as number

    if (this.state.roomBonus?.nextEventWeights?.[event.id]) {
      weight *= this.state.roomBonus.nextEventWeights[event.id] as number
    } else if (this.state.selectedRoomId) {
      const roomBias = ROOM_BONUS_RULES[this.state.selectedRoomId]?.nextEventWeights?.[event.id]
      if (roomBias) weight *= roomBias as number
    }

    for (const talentId of this.state.progressionSelections) {
      const bias = TALENTS[talentId]?.eventWeights?.[event.id]
      if (bias) weight *= bias
    }

    if (this.state.worldFlags.includes('cloud_surface') && event.id === 'cloud-vendor-fork') weight *= 1.5
    if (this.state.worldFlags.includes('license_hardened') && event.id === 'licensing-controversy') weight *= 1.6
    if (this.state.worldFlags.includes('benchmark_customer') && event.id === 'big-enterprise-contract') weight *= 1.35
    if (this.state.worldFlags.includes('media_tailwind') && (event.id === 'viral-blog-post' || event.id === 'major-conference-talk')) weight *= 1.2
    if (this.config?.template.id === 'hashicorp' && event.id === 'licensing-controversy' && this.state.round >= 8) weight *= 1.7
    if (this.config?.template.id === 'gitlab' && event.id === 'big-tech-competition' && this.state.round <= 6) weight *= 1.3
    if (this.config?.template.id === 'kubernetes' && event.id === 'ecosystem-explosion' && this.state.round <= 8) weight *= 1.2

    return weight
  }

  private evaluateTriggerCondition(condition: string): boolean {
    const normalized = condition.trim()

    if (normalized === 'Launch Plugin Ecosystem or Platform Strategy') {
      return this.hasPlayedAny(['launch-plugin-ecosystem', 'platform-strategy'])
        || this.hasAnyFlag(['ecosystem_ready', 'platform_route'])
    }

    const sumMatch = normalized.match(/(\w+)\s*\+\s*(\w+)\s*(>=|>|<=|<)\s*(\d+)/)
    if (sumMatch) {
      const [, s1, s2, op, valStr] = sumMatch
      const sum = (this.state.stats[s1 as StatId] ?? 0) + (this.state.stats[s2 as StatId] ?? 0)
      const threshold = parseInt(valStr, 10)
      let passes = false
      switch (op) {
        case '>=': passes = sum >= threshold; break
        case '>': passes = sum > threshold; break
        case '<=': passes = sum <= threshold; break
        case '<': passes = sum < threshold; break
      }
      if (passes && this.state.gameModeId === 'acquisition') {
        return Math.random() < this.getAcquisitionProbability()
      }
      return passes
    }

    return this.evaluateSingleCondition(normalized)
  }

  private drawHand() {
    const baseCards = this.state.gameStage === 'seed' ? 4 : 3
    const extraDraw = this.state.stats.dev_speed >= 6 ? 1 : 0
    const org = this.config ? organizations.find(item => item.id === this.config!.organizationId) : null
    const orgBonus = org?.handSizeBonus ?? 0
    const total = baseCards + extraDraw + orgBonus
    for (let i = 0; i < total; i++) this.drawOneCard()
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
    shuffle(this.state.deck)
    this.log('system', 'Deck reshuffled.')
  }

  private applyEffect(effect: StatEffect, multiplier = 1) {
    for (const [key, value] of Object.entries(effect)) {
      const statKey = key as StatId
      if (this.state.stats[statKey] === undefined) continue
      const scaled = multiplier !== 1 ? Math.round((value as number) * multiplier) : (value as number)
      this.state.stats[statKey] = this.clamp(this.state.stats[statKey] + scaled, 0, MAX_STATS[statKey])
    }
  }

  private adjustFactions(effect: Partial<Record<FactionId, number>>) {
    for (const [key, value] of Object.entries(effect)) {
      const faction = key as FactionId
      this.state.factionReputation[faction] = this.clamp(
        this.state.factionReputation[faction] + (value as number),
        0,
        MAX_FACTION,
      )
    }
  }

  private addFlags(flags: string[]) {
    for (const flag of flags) {
      if (!this.state.worldFlags.includes(flag)) {
        this.state.worldFlags.push(flag)
      }
    }
  }

  private removeFlags(flags: string[]) {
    this.state.worldFlags = this.state.worldFlags.filter(flag => !flags.includes(flag))
  }

  private scheduleEvent(eventId: string, rounds: number, label: string) {
    this.state.activeEffects.push({
      id: makeEffectId(`event-${eventId}`),
      sourceCardId: `event-${eventId}`,
      source: 'event',
      type: 'event_trigger',
      remainingRounds: rounds,
      label,
      eventId,
    })
    this.log('buff', `[Future Consequence] ${label}`)
  }

  private pushResolvedChain(chainId: string) {
    if (!this.state.resolvedChains.includes(chainId)) this.state.resolvedChains.push(chainId)
  }

  private log(type: LogType, message: string) {
    this.state.history.push({
      type,
      round: this.state.round,
      message,
      timestamp: Date.now(),
    })
  }

  previewCardEffect(cardId: string): CardPreview | null {
    const card = this.state.hand.find(item => item.id === cardId)
    if (!card) return null

    const multiplierInfo = this.getMultiplierInfo(card, false)
    const baseEffect = scaleEffect(card.effect, multiplierInfo.multiplier)
    const bonusEffect = { ...(CARD_IMMEDIATE_BONUS[card.id] ?? {}) }
    const templateBonus = this.getTemplateBonus(card)
    const roomBonus = this.getRoomDerivedBonus(card)
    const orgBonus = this.getOrganizationPreviewBonus(card)

    if (card.category === 'Monetization' && this.state.stats.trust >= 8) {
      const communityLoss = card.effect.community ?? 0
      if (communityLoss < 0) {
        templateBonus.community = (templateBonus.community ?? 0) + Math.ceil(Math.abs(communityLoss) / 2)
      }
    }

    const costEffect = card.cost ? { ...card.cost } : {}
    const synergy = this.getSynergyPreview(card.id)
    const totalEffect = mergeEffects(baseEffect, bonusEffect, templateBonus, roomBonus, orgBonus, costEffect, synergy?.bonus ?? null)

    return {
      baseEffect,
      bonusEffect,
      templateBonus,
      costEffect,
      totalEffect,
      multiplier: multiplierInfo.multiplier,
      synergyBonus: synergy?.bonus ?? null,
      synergyLabel: synergy?.label ?? null,
      roomBonus,
      orgBonus,
      bonusSources: multiplierInfo.bonusSources,
    }
  }

  private getTemplateBonus(card: Card): StatEffect {
    const templateId = this.config?.template.id
    if (!templateId) return {}
    const bonus: StatEffect = {}
    switch (templateId) {
      case 'redis':
        if (card.category === 'Open Source') bonus.trust = 1
        break
      case 'mongodb':
        if (card.id === 'enterprise-edition' && (card.effect.community ?? 0) < 0) {
          bonus.community = -(card.effect.community ?? 0)
        }
        break
      case 'gitlab':
        if (card.id === 'open-governance' || card.id === 'public-roadmap') {
          return { ...card.effect }
        }
        break
      case 'redhat':
        if (card.category === 'Open Source') bonus.revenue = 1
        break
      case 'kubernetes':
        if (card.id === 'open-governance') {
          if (card.effect.community) bonus.community = card.effect.community
          if (card.effect.trust) bonus.trust = card.effect.trust
        }
        break
      case 'elastic':
        if (this.cardsPlayedThisRound >= 1) bonus.community = 1
        break
      case 'hashicorp':
        if (card.category === 'Monetization' && (!card.condition || this.evaluateCondition(card.condition))) {
          return scaleEffect(card.effect, 0.25)
        }
        break
    }
    return bonus
  }

  private getRoomDerivedBonus(card: Card): StatEffect {
    const bonus: StatEffect = {}
    const room = this.state.roomBonus
    if (!room) return bonus
    if (room.roomId === 'community' && card.category === 'Open Source') {
      bonus.trust = 1
    }
    if (room.roomId === 'product' && card.category === 'Growth') {
      bonus.control = 1
    }
    if (room.roomId === 'revenue' && card.category === 'Monetization') {
      bonus.reputation = 1
    }
    if (room.roomId === 'platform' && (card.id === 'sdk-release' || card.id === 'platform-strategy')) {
      bonus.growth = 1
      bonus.community = 1
    }
    if (room.roomId === 'finance' && card.category === 'Finance') {
      bonus.cash = 1
    }
    return bonus
  }

  private getOrganizationPreviewBonus(card: Card): StatEffect {
    const bonus: StatEffect = {}
    if (this.config?.organizationId === 'matrix' && this.hasDifferentCategoryPlayed(card.category)) {
      const prev = this.getLastPlayedCard()
      if (prev) {
        for (const [key, value] of Object.entries(prev.effect)) {
          bonus[key as StatId] = Math.round((value as number) * 0.1)
        }
      }
    }
    return bonus
  }

  private getSynergyPreview(cardId: string) {
    const played = this.state.cardsPlayedThisRound
    if (played.length === 0) return null
    const lastPlayed = played[played.length - 1]
    const synergy = CARD_SYNERGIES.find(item => item.cardA === lastPlayed && item.cardB === cardId)
    if (!synergy) return null
    let bonus = synergy.bonus
    if (this.state.roomBonus?.synergyBoost) {
      bonus = mergeEffects(bonus, this.state.roomBonus.synergyBoost)
    }
    for (const talentId of this.state.progressionSelections) {
      const talent = TALENTS[talentId]
      if (talent?.synergyBoost) {
        bonus = mergeEffects(bonus, talent.synergyBoost)
      }
    }
    return { label: synergy.label, bonus }
  }

  private checkAndApplySynergy(cardId: string) {
    const synergy = this.getSynergyPreview(cardId)
    if (!synergy) return
    this.applyEffect(synergy.bonus)
    this.log('buff', `[Synergy!] ${synergy.label}`)
  }

  private getMultiplierInfo(card: Card, consumeBoosts: boolean): MultiplierInfo {
    let activeBonus = 0
    const consumedBoostIds: string[] = []
    for (const effect of this.state.activeEffects) {
      if (effect.type === 'next_card_boost' && effect.category === card.category) {
        activeBonus += effect.multiplier ?? 0
        if (consumeBoosts) consumedBoostIds.push(effect.id)
      }
    }

    const baseMultiplier = this.state.effectMultipliers[card.category] ?? 1
    const roomBonus = this.state.roomBonus?.categoryBoosts[card.category] ?? 0
    const orgBonus = this.getOrganizationCardBonus(card)
    const talentBonus = this.getTalentCategoryBonus(card)

    const bonusSources: string[] = []
    if (activeBonus) bonusSources.push('Stored buff')
    if (roomBonus) bonusSources.push(this.state.roomBonus?.label ?? 'Room bonus')
    if (orgBonus) bonusSources.push('Organization rule')
    if (talentBonus) bonusSources.push('Progression talent')
    if (card.category === 'Growth' && this.config?.template.id === 'docker') bonusSources.push('Docker passive')
    if (card.category === 'Monetization' && this.config?.template.id === 'hashicorp' && (!card.condition || this.evaluateCondition(card.condition))) {
      bonusSources.push('HashiCorp passive')
    }

    const isDockerGrowth = this.config?.template.id === 'docker' && card.category === 'Growth'
    const multiplier = isDockerGrowth
      ? 2 + activeBonus + roomBonus + orgBonus + talentBonus
      : baseMultiplier + activeBonus + roomBonus + orgBonus + talentBonus

    return {
      multiplier: Math.round(multiplier * 100) / 100,
      consumedBoostIds,
      roomBonus,
      orgBonus,
      talentBonus,
      bonusSources,
    }
  }

  private getOrganizationCardBonus(card: Card): number {
    const organizationId = this.config?.organizationId
    if (organizationId === 'matrix' && this.hasDifferentCategoryPlayed(card.category)) return 0.1
    return 0
  }

  private getTalentCategoryBonus(card: Card): number {
    let total = 0
    for (const talentId of this.state.progressionSelections) {
      const talent = TALENTS[talentId]
      if (!talent) continue
      total += talent.categoryBoosts?.[card.category] ?? 0
      if (talent.roomFocus && talent.roomFocus === this.state.selectedRoomId) total += 0.05
    }
    return total
  }

  private applyMatrixOrganizationBonus(card: Card) {
    if (this.config?.organizationId !== 'matrix') return
    if (!this.hasDifferentCategoryPlayed(card.category)) return
    const prevCard = this.getLastPlayedCard()
    if (!prevCard) return
    const retroBonus = scaleEffect(prevCard.effect, 0.1)
    this.applyEffect(retroBonus)
    this.log('buff', '[Org Passive] Matrix cross-functional bonus: both strategies gain +10% impact')
  }

  private getLastPlayedCard(): Card | null {
    const lastId = this.state.cardsPlayedThisRound[this.state.cardsPlayedThisRound.length - 1]
    return STRATEGY_CARDS.find(card => card.id === lastId) ?? null
  }

  private hasDifferentCategoryPlayed(category: CardCategory): boolean {
    return this.state.cardsPlayedThisRound.some(cardId => {
      const played = STRATEGY_CARDS.find(card => card.id === cardId)
      return played && played.category !== category
    })
  }

  private getStageForRound(round: number): GameStage {
    if (round <= 5) return 'seed'
    if (round <= 12) return 'growth'
    return 'scale'
  }

  private getPendingStageMilestone(): GameStage | null {
    const stage = this.state.gameStage
    if (stage === 'seed') return null
    if (this.state.stageMilestones.includes(stage)) return null
    this.state.stageMilestones.push(stage)
    return stage
  }

  private buildProgressionEvent(stage: Exclude<GameStage, 'seed'>): GameEvent {
    const role = this.config?.role
    const track = ARCHETYPE_TRACK[role?.archetype ?? 'executive'] ?? 'executive'
    const trackOptions = TALENT_TRACKS[track]?.[stage] ?? TALENT_TRACKS.executive[stage]
    const [aId, bId] = trackOptions
    const optionA = TALENTS[aId]
    const optionB = TALENTS[bId]

    return {
      id: `progression-${stage}-${role?.id ?? 'company'}`,
      title: stage === 'growth' ? 'Growth Breakthrough' : 'Scale Breakthrough',
      category: 'Ecosystem',
      description: stage === 'growth'
        ? 'The company is entering a new phase. Choose which discipline becomes your backbone.'
        : 'Scale changes the rules of the game. Decide what kind of power your company wants to wield.',
      options: [
        {
          label: optionA.label,
          effect: optionA.immediateEffect ?? {},
          description: optionA.description,
          unlocks: optionA.id,
          consequenceHint: 'Permanent progression choice',
        },
        {
          label: optionB.label,
          effect: optionB.immediateEffect ?? {},
          description: optionB.description,
          unlocks: optionB.id,
          consequenceHint: 'Permanent progression choice',
        },
      ],
      prototype: 'progression',
      phase: 'any',
    }
  }

  private applyProgressionChoice(talentId: string, sourceEventId: string) {
    const talent = TALENTS[talentId]
    if (!talent || this.state.progressionSelections.includes(talentId)) return
    this.state.progressionSelections.push(talentId)
    if (talent.immediateEffect) this.applyEffect(talent.immediateEffect)
    if (talent.burnRateDelta) {
      this.state.burnRate = Math.max(1, this.state.burnRate + talent.burnRateDelta)
    }
    if (talent.factionShift) this.adjustFactions(talent.factionShift)
    this.addFlags([`talent:${talentId}`])
    this.log('buff', `[Progression] ${talent.label} unlocked`)
    this.pushResolvedChain(sourceEventId)
  }

  private applyTalentRoundStartEffects() {
    for (const talentId of this.state.progressionSelections) {
      const talent = TALENTS[talentId]
      if (!talent) continue
      if (talent.roundStartEffect && talent.roundEvery && this.state.round % talent.roundEvery === 0) {
        this.applyEffect(talent.roundStartEffect)
        this.log('buff', `[Talent] ${talent.label}: ${this.formatEffect(talent.roundStartEffect)}`)
      }
      if (talent.extraActionPointEvery && this.state.round % talent.extraActionPointEvery === 0) {
        this.state.actionPoints += 1
        this.state.maxActionPoints += 1
        this.log('buff', `[Talent] ${talent.label}: +1 action point this round`)
      }
    }
  }

  private applyProfitTalents(netIncome: number) {
    if (netIncome <= 0) return
    for (const talentId of this.state.progressionSelections) {
      const bonus = TALENTS[talentId]?.profitableCashBonus
      if (bonus) {
        this.applyEffect({ cash: bonus })
        this.log('buff', `[Talent] ${TALENTS[talentId].label}: profitable round grants cash +${bonus}`)
      }
    }
  }

  private getTechShield(): number {
    let shield = 0
    for (const talentId of this.state.progressionSelections) {
      shield = Math.max(shield, TALENTS[talentId]?.techShield ?? 0)
    }
    return shield
  }

  private hasNegativeEffect(effect: StatEffect): boolean {
    return Object.values(effect).some(value => (value as number) < 0)
  }

  private reduceNegativeEffects(effect: StatEffect, reduction: number): StatEffect {
    const result: StatEffect = {}
    for (const [key, value] of Object.entries(effect)) {
      const current = value as number
      result[key as StatId] = current < 0 ? Math.round(current * (1 - reduction)) : current
    }
    return result
  }

  private deriveOngoingEffect(effect?: StatEffect): StatEffect | null {
    if (!effect) return null
    const result: StatEffect = {}
    for (const [key, value] of Object.entries(effect)) {
      const current = value as number
      if (Math.abs(current) < 2) continue
      result[key as StatId] = current > 0 ? 1 : -1
    }
    return Object.keys(result).length > 0 ? result : null
  }

  private applyGameStageEffects() {
    if (this.state.gameStage === 'seed' && this.state.round <= 2) {
      this.log('buff', '[Seed Stage] Grace period: burn is halved this round')
    }
    if (this.state.gameStage === 'growth' && this.state.round === 6) {
      this.log('buff', '[Growth Stage] New progression routes and room play now define your build')
    }
    if (this.state.gameStage === 'scale' && this.state.round === 13) {
      this.log('buff', '[Scale Stage] Late-game pressure intensifies and advanced powers are online')
    }
  }

  private getCurrentMaxActionPoints(): number {
    const org = this.config ? organizations.find(item => item.id === this.config!.organizationId) : null
    let base = org?.maxActionPoints ?? 3
    if (this.state?.gameStage === 'scale') base = Math.max(base, 4)
    return base
  }

  private getEffectiveBurnRate(): number {
    if (this.state.gameStage === 'seed' && this.state.round <= 2) {
      return Math.max(1, Math.ceil(this.state.burnRate / 2))
    }
    return this.state.burnRate
  }

  private getFactionDeltaForCard(card: Card): Partial<Record<FactionId, number>> {
    const delta: Partial<Record<FactionId, number>> = {}
    switch (card.category) {
      case 'Open Source':
        delta.community = 1
        delta.ecosystem = 1
        break
      case 'Monetization':
        delta.enterprise = 1
        delta.investors = 1
        if ((card.effect.community ?? 0) < 0) delta.community = -1
        break
      case 'Growth':
        delta.community = (card.effect.community ?? 0) > 0 ? 1 : 0
        delta.enterprise = 1
        break
      case 'Operations':
        delta.regulators = (card.effect.risk ?? 0) < 0 ? 1 : 0
        break
      case 'Finance':
        delta.investors = 2
        break
    }
    return delta
  }

  private getFactionDeltaForEventOption(event: GameEvent, option: GameEvent['options'][number]): Partial<Record<FactionId, number>> {
    const delta: Partial<Record<FactionId, number>> = {}
    if ((option.effect.community ?? 0) > 0 || (option.effect.trust ?? 0) > 0) delta.community = 1
    if ((option.effect.revenue ?? 0) > 0) delta.enterprise = 1
    if ((option.effect.cash ?? 0) > 0 || (option.effect.control ?? 0) < 0) delta.investors = 1
    if ((option.effect.risk ?? 0) < 0 && event.category === 'Regulation') delta.regulators = 1
    if (event.category === 'Ecosystem') delta.ecosystem = 1
    return delta
  }

  private applyCardWorldRules(card: Card) {
    this.addFlags([...(card.setsFlags ?? []), ...(CARD_WORLD_FLAGS[card.id] ?? [])])

    switch (card.id) {
      case 'foundation-donation':
        this.scheduleEvent('foundation-formation', 3, 'Foundation donation matures into a governance crossroads')
        this.pushResolvedChain('foundation-formation')
        break
      case 'hosted-saas':
        this.scheduleEvent('cloud-vendor-fork', 3, 'Cloud exposure raises the odds of a hostile fork')
        this.pushResolvedChain('cloud-vendor-fork')
        break
      case 'dual-license':
        this.scheduleEvent('licensing-controversy', 2, 'License hardening sparks a community reaction')
        this.pushResolvedChain('licensing-controversy')
        break
      case 'platform-strategy':
        this.scheduleEvent('ecosystem-explosion', 3, 'Platform strategy awakens ecosystem momentum')
        this.pushResolvedChain('ecosystem-explosion')
        break
    }
  }

  private recordUsedEvent(eventId: string) {
    this.state.usedEventIds.push(eventId)
    if (this.state.usedEventIds.length > 20) {
      this.state.usedEventIds = this.state.usedEventIds.slice(-20)
    }
  }

  private hasAnyFlag(flags: string[]): boolean {
    return flags.some(flag => this.state.worldFlags.includes(flag))
  }

  private hasPlayedAny(cardIds: string[]): boolean {
    return cardIds.some(id => this.state.playedCardIds.includes(id))
  }

  private refreshThreats() {
    const threats: string[] = []
    if (this.state.stats.cash <= 4) threats.push('Cash collapse risk')
    if (this.state.stats.community <= 3) threats.push('Community fracture risk')
    if (this.state.stats.risk >= 7) threats.push('Risk exposure critical')
    if (this.state.stats.pressure >= 7) threats.push('Investor pressure nearing failure')

    for (const effect of this.state.activeEffects) {
      if (effect.type === 'event_trigger' && effect.remainingRounds > 0) {
        threats.push(`${effect.label} in ${effect.remainingRounds}r`)
      }
    }

    if (this.hasAnyFlag(['license_hardened']) && !this.state.usedEventIds.includes('licensing-controversy')) {
      threats.push('Licensing controversy is brewing')
    }
    if (this.hasAnyFlag(['ecosystem_ready']) && !this.state.usedEventIds.includes('ecosystem-explosion')) {
      threats.push('Ecosystem payoff is approaching')
    }
    if (this.hasAnyFlag(['foundation_path']) && !this.state.usedEventIds.includes('foundation-formation')) {
      threats.push('Governance crossroads ahead')
    }

    this.state.pendingThreats = threats.slice(0, 5)
  }

  private clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max)
  }

  private formatEffect(effect: StatEffect): string {
    return formatEffectSummary(effect)
  }

  getAcquisitionProbability(): number {
    const { round, stats } = this.state
    if (stats.reputation + stats.revenue < 20) return 0
    const base = 0.2
    const roundBonus = Math.max(0, (round - 10) * 0.04)
    return Math.min(base + roundBonus, 0.6)
  }

  getRunwayRounds(): number {
    const net = this.state.stats.revenue - this.getEffectiveBurnRate()
    if (net >= 0) return 999
    return Math.max(0, Math.ceil(this.state.stats.cash / Math.abs(net)))
  }
}
