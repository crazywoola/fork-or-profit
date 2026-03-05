const HAN_RE = /\p{Script=Han}/gu
const HAN_SINGLE_RE = /\p{Script=Han}/u

export function containsHan(text: string): boolean {
  return HAN_SINGLE_RE.test(text)
}

export function englishText(input: string | undefined | null, fallback = 'N/A'): string {
  if (!input) return fallback

  const normalized = input
    .replace(HAN_RE, '')
    .replace(/[「」【】]/g, ' ')
    .replace(/[（）]/g, ' ')
    .replace(/\s*\/\s*$/g, '')
    .replace(/^[\s/|,.-]+|[\s/|,.-]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!normalized) return fallback
  return normalized
}

export function titleFromId(id: string): string {
  return id
    .split(/[-_]/g)
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

const ROLE_NAME_BY_ID: Record<string, string> = {
  ceo: 'CEO',
  cto: 'CTO',
  cmo: 'CMO',
  'vp-sales': 'VP of Sales',
  'staff-engineer': 'Staff Engineer',
  pm: 'Product Manager',
  vc: 'VC Observer',
  devrel: 'Developer Relations',
  cfo: 'CFO',
  coo: 'COO',
  cpo: 'CPO',
  legal: 'Legal Counsel',
  security: 'Security Lead',
  ai: 'AI Lead',
  cs: 'Customer Success Lead',
  people: 'People Ops Lead',
  'growth-lead': 'Growth Lead',
  bd: 'Business Development Lead',
  ux: 'UX Lead',
  qa: 'QA Lead',
  sre: 'SRE Lead',
  support: 'Support Lead',
  localization: 'Localization Lead',
  oss: 'OSS Maintainer',
  field: 'Field Engineer',
  pr: 'PR Lead',
  'platform-pm': 'Platform PM',
  privacy: 'Privacy Officer',
}

const ROLE_TITLE_BY_ID: Record<string, string> = {
  ceo: 'Final Decision Maker',
  cto: 'Technical Strategy Owner',
  cmo: 'Brand and Growth Engine',
  'vp-sales': 'Revenue Hunter',
  'staff-engineer': 'Deep Technical Contributor',
  pm: 'Product Translator',
  vc: 'External Pressure Stakeholder',
  devrel: 'Community Bridge',
  cfo: 'Cash and Cost Gatekeeper',
  coo: 'Execution Efficiency Driver',
  cpo: 'Product Vision Guardian',
  legal: 'Compliance and Risk Counsel',
  security: 'Trust and Security Shield',
  ai: 'Intelligence Capability Driver',
  cs: 'Renewal and Reputation Guardian',
  people: 'Team Stability Driver',
  'growth-lead': 'Growth Experiment Specialist',
  bd: 'Ecosystem Partnership Driver',
  ux: 'Experience Quality Owner',
  qa: 'Quality Gatekeeper',
  sre: 'Reliability Orchestrator',
  support: 'Customer Issue Resolver',
  localization: 'Global Expansion Driver',
  oss: 'Core Repository Guardian',
  field: 'Enterprise Delivery Specialist',
  pr: 'Narrative and Media Operator',
  'platform-pm': 'Platform Strategy Architect',
  privacy: 'Privacy Trust Guardian',
}

export function roleNameFromId(id: string): string {
  return ROLE_NAME_BY_ID[id] ?? titleFromId(id)
}

export function roleTitleFromId(id: string): string {
  return ROLE_TITLE_BY_ID[id] ?? 'Strategic Role'
}
