import type { EventOption, GameEvent, GameStage, GameState, StatEffect, StatId } from '../engine/types'
import { getCurrentLocale, type Locale } from './index'
import { roleNameFromId, roleTitleFromId, titleFromId } from '../utils/english'

type StatLabelVariant = 'lower' | 'title' | 'upper'

type CardCopy = {
  description?: string
  condition?: string
}

type EventOptionCopy = {
  label: string
  description: string
}

type EventCopy = {
  description?: string
  options?: EventOptionCopy[]
}

type RoleCopy = {
  focus: string
  perks: readonly string[]
}

type TemplateCopy = {
  summary: string
}

const STAT_LABELS: Record<string, Record<StatLabelVariant, string>> = {
  cash: { lower: 'cash', title: 'Cash', upper: 'CASH' },
  revenue: { lower: 'revenue', title: 'Revenue', upper: 'REVENUE' },
  community: { lower: 'community', title: 'Community', upper: 'COMMUNITY' },
  growth: { lower: 'growth', title: 'Growth', upper: 'GROWTH' },
  reputation: { lower: 'reputation', title: 'Reputation', upper: 'REPUTATION' },
  control: { lower: 'control', title: 'Control', upper: 'CONTROL' },
  dev_speed: { lower: 'dev speed', title: 'Development Speed', upper: 'DEV SPEED' },
  stability: { lower: 'stability', title: 'Stability', upper: 'STABILITY' },
  pressure: { lower: 'pressure', title: 'Pressure', upper: 'PRESSURE' },
  trust: { lower: 'trust', title: 'Trust', upper: 'TRUST' },
  morale: { lower: 'morale', title: 'Team Morale', upper: 'MORALE' },
  risk: { lower: 'risk', title: 'Risk', upper: 'RISK' },
}

const PHASE_LABELS: Record<string, string> = {
  event: 'EVENT',
  planning: 'PLAN',
  action: 'ACTION',
  resolution: 'RESOLVE',
}

const STAGE_LABELS: Record<GameStage, string> = {
  seed: 'SEED',
  growth: 'GROWTH',
  scale: 'SCALE',
}

const ARCHETYPE_LABELS: Record<string, string> = {
  executive: 'Executive',
  engineering: 'Engineering',
  product: 'Product',
  growth: 'Growth',
  revenue: 'Revenue',
  community: 'Community',
  finance: 'Finance',
  risk: 'Risk',
  people: 'People Ops',
  data: 'Data / AI',
  support: 'Support',
  design: 'Design',
  operations: 'Operations',
}

const FACTION_LABELS: Record<string, string> = {
  community: 'Community',
  investors: 'Investors',
  enterprise: 'Enterprise',
  regulators: 'Regulators',
  ecosystem: 'Ecosystem',
}

const MODE_NAMES: Record<string, string> = {
  survival: 'Survival',
  ipo: 'IPO',
  legend: 'OSS Legend',
  acquisition: 'Acquisition Exit',
  'open-core': 'Open Core',
}

const MODE_GOALS: Record<string, string> = {
  survival: 'Keep both cash and community above 0 through Round 12.',
  ipo: 'Reach revenue >= 30 and reputation >= 15 by Round 20.',
  legend: 'Reach community >= 30 and growth >= 20 by Round 20.',
  acquisition: 'Trigger an acquisition and satisfy exit conditions.',
  'open-core': 'Reach community >= 15 and revenue >= 15 by Round 20.',
}

const ROUTE_TRANSLATIONS: Record<string, string> = {
  '并购退出': 'Acquisition Exit',
  'IPO / 并购退出': 'IPO / Acquisition Exit',
  '传奇开源': 'OSS Legend',
}

const CARD_COPY_EN: Record<string, CardCopy> = {
  'open-core': {
    description: 'Open-source the core product while charging for advanced features. The classic OSS commercialization path.',
  },
  'fully-open-source': {
    description: 'Open the entire codebase, put community first, and give up short-term revenue.',
  },
  'dual-license': {
    description: 'Charge commercial users a license fee while keeping personal use free.',
  },
  'contributor-program': {
    description: 'Build a structured contributor incentive program with swag, recognition, and bonuses.',
  },
  'dev-docs-push': {
    description: 'Rewrite the developer docs to make onboarding dramatically easier.',
  },
  'open-governance': {
    description: 'Form a technical steering committee (TSC) and let the community influence product decisions.',
  },
  'accept-community-prs': {
    description: 'Open the repo to external pull requests and accelerate product iteration.',
  },
  'launch-plugin-ecosystem': {
    description: 'Release plugin and extension APIs so the community can build an ecosystem around the core product.',
  },
  'foundation-donation': {
    description: 'Donate to or join a foundation such as Linux Foundation or Apache.',
  },
  'public-roadmap': {
    description: 'Make the roadmap fully public and invite community oversight.',
  },
  'enterprise-edition': {
    description: 'Launch an enterprise edition with SSO, audit logs, SLAs, and other enterprise features.',
  },
  'hosted-saas': {
    description: 'Package the open-source product as a hosted SaaS and charge by usage or subscription.',
  },
  'premium-features': {
    description: 'Put some popular capabilities behind the paid tier.',
  },
  'usage-pricing': {
    description: 'Charge based on actual usage such as API calls or data volume.',
  },
  'consulting-services': {
    description: 'Monetize community trust through consulting, implementation, and training services.',
  },
  'marketplace-revenue': {
    description: 'Build a marketplace and take a revenue share from third-party plugins and integrations.',
    condition: 'Requires Launch Plugin Ecosystem.',
  },
  'enterprise-support': {
    description: 'Offer paid support plans with SLAs, dedicated engineers, and priority fixes.',
  },
  'paid-api-access': {
    description: 'Gate core API access behind limits and charge for overages.',
  },
  'license-enforcement': {
    description: 'Proactively pursue unlicensed commercial usage through legal notices or lawsuits.',
  },
  'partner-program': {
    description: 'Build a partner and reseller network to extend sales coverage.',
  },
  'developer-evangelism': {
    description: 'Send developer evangelists to major technical conferences and community events.',
  },
  'hacker-news-launch': {
    description: 'Post a Show HN launch on Hacker News and push for front-page exposure.',
  },
  'product-hunt-launch': {
    description: 'Launch on Product Hunt and aim for the #1 product of the day.',
  },
  'free-tier': {
    description: 'Offer a permanent free tier to reduce adoption friction.',
  },
  'community-events': {
    description: 'Run meetups, hackathons, and user conferences online and offline.',
  },
  'global-conference': {
    description: 'Host an annual global developer conference similar to KubeCon or re:Invent.',
  },
  'referral-program': {
    description: 'Launch a referral program to drive word-of-mouth growth.',
  },
  'dev-tools-integration': {
    description: 'Deeply integrate with mainstream developer tools like VS Code, GitHub, and Slack.',
  },
  'sdk-release': {
    description: 'Ship SDKs for major languages such as Python, Go, and TypeScript.',
  },
  'platform-strategy': {
    description: 'Evolve from a tool into a platform that third parties can build on.',
    condition: 'Requires SDK Release or Launch Plugin Ecosystem.',
  },
  'hire-engineers': {
    description: 'Expand the engineering team to ship product faster.',
  },
  'hire-sales-team': {
    description: 'Build a sales team to actively pursue enterprise customers.',
  },
  'reduce-burn': {
    description: 'Cut spending proactively and extend runway.',
  },
  'remote-company': {
    description: 'Go fully remote to save office costs and widen the hiring pool.',
  },
  'build-internal-tools': {
    description: 'Invest in internal tooling and engineering productivity infrastructure.',
  },
  'tech-debt-cleanup': {
    description: 'Pause new feature work for a sprint and focus on paying down technical debt.',
  },
  'improve-ci-cd': {
    description: 'Strengthen CI/CD pipelines and speed up release cadence.',
  },
  'security-audit': {
    description: 'Commission a third-party security audit to find and fix vulnerabilities early.',
  },
  'legal-defense': {
    description: 'Pay legal fees to respond to patent suits or licensing disputes.',
    condition: 'Can only be played after a relevant legal event has been triggered.',
  },
  'acquire-startup': {
    description: 'Acquire a complementary startup to gain technology or talent quickly.',
  },
  'seed-round': {
    description: 'Close a seed round and secure initial operating capital.',
    condition: 'Only available at the start of the game; later-stage VCs lose interest.',
  },
  'series-a': {
    description: 'Raise a Series A and bring in institutional investors.',
    condition: 'revenue >= 5 or community >= 10',
  },
  'series-b': {
    description: 'Raise a Series B to finance expansion at scale.',
    condition: 'Series A completed and revenue >= 15 and reputation >= 8',
  },
  'strategic-investor': {
    description: 'Bring in a strategic investor such as a cloud vendor or large enterprise.',
  },
  'ipo': {
    description: 'Take the company public as one of the final win conditions.',
    condition: 'revenue >= 25 and reputation >= 12 and Series B completed',
  },
  'token-launch': {
    description: 'Issue a crypto token, best suited to Web3 businesses.',
  },
  'crowdfunding': {
    description: 'Raise money from the community through Kickstarter or Open Collective.',
  },
  'government-grant': {
    description: 'Apply for government R&D funding or industrial support grants.',
  },
  'venture-debt': {
    description: 'Raise venture debt without diluting equity, at the cost of higher financial risk.',
    condition: 'revenue >= 8 (demonstrated repayment capacity)',
  },
  'stock-buyback': {
    description: 'Buy back shares from employees or early investors to increase share value.',
  },
}

const EVENT_COPY_EN: Record<string, EventCopy> = {
  'github-stars-explosion': {
    description: 'Your repository was recommended overnight by a famous developer, and stars are surging.',
    options: [
      { label: 'Publish a follow-up blog post', description: 'Ride the traffic wave with fresh content.' },
      { label: 'Quickly clear the issue backlog', description: 'Show strong responsiveness to the community.' },
      { label: 'Launch sponsorship channels', description: 'Monetize the momentum, but some users may dislike it.' },
    ],
  },
  'hacker-news-front-page': {
    description: 'Your article or product hit the Hacker News front page and stayed visible for hours.',
    options: [
      { label: 'Reply personally to every technical comment', description: 'Show deep technical credibility, but spend a lot of team energy.' },
      { label: 'Answer only constructive criticism and admit shortcomings publicly', description: 'Transparency wins developer goodwill.' },
      { label: 'Publish a detailed roadmap in response to feature requests', description: 'The community gets energized, but commitments add delivery pressure.' },
    ],
  },
  'cloud-vendor-fork': {
    description: 'A major cloud vendor forked your OSS project and launched a hosted service without upstream contribution.',
    options: [
      { label: 'Re-license under BSL/SSPL', description: 'Community split; may trigger Licensing Controversy.' },
      { label: 'Negotiate with the cloud vendor', description: 'Trade control for commercial upside.' },
      { label: 'Double down on a community moat', description: 'Sacrifice short-term business to win community support.' },
    ],
  },
  'major-security-vulnerability': {
    description: 'Security researchers disclosed a critical vulnerability in your product with a high CVSS score.',
    options: [
      { label: '72-hour hotfix + public post-mortem', description: 'Transparency helps rebuild trust.' },
      { label: 'Quiet patch with low-profile response', description: 'Extra penalty if media exposure happens.' },
      { label: 'Free upgrades for all impacted customers', description: 'Protect long-term customer retention.' },
    ],
  },
  'open-source-maintainer-burnout': {
    description: 'A core maintainer publicly announced burnout and can no longer carry the project alone.',
    options: [
      { label: 'Hire the maintainer full-time', description: 'Stable leadership with ongoing payroll cost.' },
      { label: 'Openly recruit community successors', description: 'Takes two rounds before impact appears.' },
      { label: 'Enter maintenance mode', description: 'Safer operations but slower product evolution.' },
    ],
  },
  'vc-funding-winter': {
    description: 'Market conditions worsened: fundraising slowed, valuation multiples compressed, and runway pressure increased.',
    options: [
      { label: 'Lay off 10-15% to extend runway', description: 'Improves runway but hurts morale and reputation.' },
      { label: 'Accelerate monetization', description: 'Reduce dependency on fundraising in a down market.' },
      { label: 'Seek strategic investors (non-VC)', description: 'Strategic Investor card gets a cost reduction.' },
    ],
  },
  'big-tech-competition': {
    description: 'A big tech company launched a free, overlapping product deeply integrated into its ecosystem.',
    options: [
      { label: 'Focus on a differentiated niche', description: 'Narrower scope but deeper competitive edge.' },
      { label: 'Invest heavily in OSS community', description: 'Independents can often out-community big tech.' },
      { label: 'Proactively engage big tech', description: 'Raises chance of an Acquisition Offer event.' },
    ],
  },
  'developer-migration-wave': {
    description: 'A legacy competitor stopped maintenance, and users are migrating in large numbers.',
    options: [
      { label: 'Stand up a migration support task force', description: 'Absorb the community deeply, but tie up engineering bandwidth.' },
      { label: 'Ship a compatibility layer to reduce migration friction', description: 'Capture users quickly, at the cost of new technical debt.' },
      { label: 'Stay the course and avoid special-case adaptation', description: 'You attract only the users who truly buy into your direction.' },
    ],
  },
  'major-conference-talk': {
    description: 'Your team delivered a keynote at a top conference with major industry visibility.',
    options: [
      { label: 'Ship a major feature with the talk', description: 'Maximize launch momentum from conference exposure.' },
      { label: 'Announce a new OSS module', description: 'Reinforce your open-source identity.' },
      { label: 'Announce the enterprise plan', description: 'Convert attention into monetization.' },
    ],
  },
  'licensing-controversy': {
    description: 'You announced a license change from permissive OSS to source-available terms, triggering community backlash.',
    options: [
      { label: 'Keep the license change and justify it', description: 'More control and revenue, but larger community loss.' },
      { label: 'Roll back the license change', description: 'Recover trust but lose control.' },
      { label: 'Compromise with forward-only licensing', description: 'Keep legacy versions permissive.' },
    ],
  },
  'docker-boom': {
    description: 'Container adoption is exploding, and your product is highly compatible with the Docker ecosystem.',
    options: [
      { label: 'Release official Docker image + docs', description: 'Ride ecosystem momentum with better onboarding.' },
      { label: 'Co-market with Docker', description: 'Brand upside with marketing cost.' },
      { label: 'Launch container-focused enterprise features', description: 'Monetize the container user influx.' },
    ],
  },
  'kubernetes-adoption': {
    description: 'Kubernetes became the industry default, and your early integration now gives you strong momentum.',
    options: [
      { label: 'Apply as a CNCF project', description: 'Strong community upside with review delay.' },
      { label: 'Ship Helm Chart / Operator', description: 'Lower deployment friction for teams.' },
      { label: 'Launch K8s-focused enterprise edition', description: 'Capture enterprise Kubernetes budgets.' },
    ],
  },
  'ai-hype-cycle': {
    description: 'The AI wave is dominating the market, and everyone is asking where your AI capabilities are.',
    options: [
      { label: 'Fast-track LLM integration and launch', description: 'Growth spike at the cost of product quality risk.' },
      { label: 'Launch later with higher quality', description: 'Short-term lag but stronger long-term trust.' },
      { label: 'Open-source your AI models/tools', description: 'Community-first AI strategy.' },
    ],
  },
  'developer-strike': {
    description: 'Core contributors announced a coordinated pause in contributions until policy changes are made.',
    options: [
      { label: 'Talk with maintainers and meet demands', description: 'Recover trust, possibly at business cost.' },
      { label: 'Reject demands and push forward', description: 'More control, but deeper community damage.' },
      { label: 'Introduce TSC governance', description: 'Share control to stabilize community trust.' },
    ],
  },
  'government-regulation': {
    description: 'New regulations require stricter data localization, security review, or compliance processes.',
    options: [
      { label: 'Fully comply and get certified', description: 'Higher short-term cost, strong long-term upside.' },
      { label: 'Wait and adjust gradually', description: 'Saves near-term cash but compounds risk.' },
      { label: 'Use OSS transparency for compliance', description: 'Lower compliance burden in OSS model.' },
    ],
  },
  'patent-lawsuit': {
    description: 'A patent troll or competitor filed a software patent lawsuit demanding major damages.',
    options: [
      { label: 'Fight in court and countersue', description: 'High risk with potentially high payoff.' },
      { label: 'Settle out of court', description: 'Expensive but predictable closure.' },
      { label: 'Join a patent protection alliance (OIN)', description: 'Smaller upfront cost, durable risk reduction.' },
    ],
  },
  'viral-blog-post': {
    description: 'A well-known technical blogger published a deep positive review of your product that went viral.',
    options: [
      { label: 'Partner with blogger for follow-up content', description: 'Sustained exposure over multiple rounds.' },
      { label: 'Launch free trial while traffic is hot', description: 'Short-term user surge with weaker immediate revenue.' },
      { label: 'Hold steady', description: 'Preserve current gains with no extra upside.' },
    ],
  },
  'massive-outage': {
    description: 'A major production outage disrupted core services for hours and affected paying customers.',
    options: [
      { label: 'Full public post-mortem + compensation', description: 'Expensive, but best for rebuilding trust.' },
      { label: 'Rapid fix with minimal statement', description: 'Cheaper now, but credibility weakens.' },
      { label: 'Open-source the root-cause fix', description: 'Turn incident response into community goodwill.' },
    ],
  },
  'data-breach': {
    description: 'Attackers compromised your database, and a large user data leak is now public.',
    options: [
      { label: 'Disclose within 72 hours and notify users', description: 'Transparency helps reduce regulatory penalties.' },
      { label: 'Delay disclosure until after internal fixes', description: 'Higher penalty risk if discovered.' },
      { label: 'Hire top-tier security firm and go public', description: 'Costly, but improves credibility.' },
    ],
  },
  'open-source-fork': {
    description: 'Key community members launched a high-profile fork with support from influential developers.',
    options: [
      { label: 'Embrace the fork and merge good contributions', description: 'Convert conflict into collaboration.' },
      { label: 'Validate legitimacy via community vote', description: 'Costs one action, may stabilize support.' },
      { label: 'Block with legal actions (IP/trademark)', description: 'Regain control with PR fallout.' },
    ],
  },
  'acquisition-offer': {
    description: 'An M&A team from a major company sent a formal acquisition offer at a premium valuation.',
    options: [
      { label: 'Accept acquisition', description: 'Triggers acquisition-exit victory check.' },
      { label: 'Reject and remain independent', description: 'Boosts morale and long-term identity.' },
      { label: 'Use offer as financing leverage', description: 'Improve terms on your next financing move.' },
    ],
  },
  'big-enterprise-contract': {
    description: 'A Fortune 500 customer signed a multi-year enterprise contract with high annual value.',
    options: [
      { label: 'Accept and deliver deep customization', description: 'Highest revenue with product stability trade-off.' },
      { label: 'Accept with limited customization', description: 'Strong revenue while preserving product direction.' },
      { label: 'Publicize the contract case study', description: 'Unlock flagship-customer credibility.' },
    ],
  },
  'competitor-shutdown': {
    description: 'Your main competitor shut down or was absorbed, and users are urgently looking for alternatives.',
    options: [
      { label: 'Ship emergency migration tooling', description: 'Fast user capture with engineering strain.' },
      { label: 'Publish competitive comparison campaign', description: 'Marketing-led user acquisition.' },
      { label: 'Offer limited-time free incentives', description: 'Trade short-term revenue for rapid growth.' },
    ],
  },
  'industry-standardization': {
    description: 'A standards body is considering your technology as part of an official industry baseline.',
    options: [
      { label: 'Lead standard-setting with resource commitment', description: 'Shape ecosystem rules at higher cost.' },
      { label: 'Participate actively without leading', description: 'Moderate upside with low overhead.' },
      { label: 'Observe and wait', description: 'Lower near-term cost, strategic opportunity loss.' },
    ],
  },
  'foundation-formation': {
    description: 'Community and enterprise members proposed forming an independent foundation to govern the project.',
    options: [
      { label: 'Approve independent foundation formation', description: 'Big trust gain with less direct control.' },
      { label: 'Reject and keep company control', description: 'More control, higher community backlash risk.' },
      { label: 'Form foundation with reserved key seats', description: 'Balanced governance compromise.' },
    ],
  },
  'cloud-partnership': {
    description: 'A major cloud provider invited your product into their marketplace with co-selling support.',
    options: [
      { label: 'Deep cloud partnership integration', description: 'Strong revenue upside with platform dependency.' },
      { label: 'Limited partnership, stay independent', description: 'Moderate upside while preserving autonomy.' },
      { label: 'Reject due to lock-in concerns', description: 'Preserve control, miss short-term revenue.' },
    ],
  },
  'developer-tool-integration': {
    description: 'A major developer platform announced first-party integration or recommendation of your tooling.',
    options: [
      { label: 'Optimize integration UX + release plugin', description: 'Higher adoption with added engineering load.' },
      { label: 'Run a co-launch marketing campaign', description: 'Expand reach quickly.' },
      { label: 'Use momentum as negotiation leverage', description: 'Stronger bargaining power in financing talks.' },
    ],
  },
  'global-dev-conference': {
    description: 'You launched your first global developer conference with large-scale community attendance.',
    options: [
      { label: 'Announce major OSS milestone on stage', description: 'Strengthen community trust and momentum.' },
      { label: 'Launch new enterprise features at conference', description: 'Convert attention into monetization.' },
      { label: 'Announce Open-Core strategic transition', description: 'Balance community and business growth.' },
    ],
  },
  'ecosystem-explosion': {
    description: 'Plugins, integrations, and tutorials around your product are growing rapidly into a flywheel.',
    options: [
      { label: 'Build a paid plugin marketplace', description: 'Monetize ecosystem with some developer pushback.' },
      { label: 'Keep ecosystem fully open and free', description: 'Maximize adoption and monetize indirectly later.' },
    ],
  },
  'platform-shift': {
    description: 'The industry is shifting platforms, and you must choose between full rewrite, gradual migration, or legacy focus.',
    options: [
      { label: 'Fully bet on new platform and rewrite core', description: 'Short-term pain with large long-term upside.' },
      { label: 'Migrate gradually with compatibility', description: 'Steady transition with moderate upside.' },
      { label: 'Stay on current path for conservative users', description: 'Protect renewals while losing new demand.' },
    ],
  },
}

const ROLE_COPY_EN: Record<string, RoleCopy> = {
  ceo: { focus: 'Company direction and high-stakes trade-offs', perks: ['Cash reserve +10%', 'Brand reputation +10%'] },
  cto: { focus: 'Open-source and architecture strategy', perks: ['Technical debt -15%', 'Open-source index +10%'] },
  cmo: { focus: 'Market narrative and distribution', perks: ['Brand reputation +15%', 'Monetization index +5%'] },
  'vp-sales': { focus: 'Deals and pricing battles', perks: ['Monthly revenue +$5K', 'Monetization index +10%'] },
  'staff-engineer': { focus: 'Community contribution and quality', perks: ['Technical debt -10%', 'Open-source index +15%'] },
  pm: { focus: 'Balancing user needs and business', perks: ['Team morale +10%', 'Brand reputation +5%'] },
  vc: { focus: 'Capital and veto power', perks: ['Observer seat', 'Veto power'] },
  devrel: { focus: 'Amplifying community reach', perks: ['Community influence +20%', 'Open-source index +10%'] },
  cfo: { focus: 'Cash flow and budgeting', perks: ['Cash reserve +15%', 'Monetization index +5%'] },
  coo: { focus: 'Process design and execution cadence', perks: ['Team morale +10%', 'Monthly revenue +$3K'] },
  cpo: { focus: 'Product narrative and trade-offs', perks: ['Brand reputation +8%', 'Monetization index +8%'] },
  legal: { focus: 'Licensing and contract strategy', perks: ['Brand reputation +5%', 'Technical debt -5%'] },
  security: { focus: 'Vulnerabilities and security response', perks: ['Technical debt -10%', 'Brand reputation +5%'] },
  ai: { focus: 'Data flywheels and models', perks: ['Monetization index +8%', 'Technical debt -5%'] },
  cs: { focus: 'Customer lifecycle', perks: ['Monthly revenue +$4K', 'Brand reputation +8%'] },
  people: { focus: 'Hiring and culture', perks: ['Team morale +15%', 'Technical debt -3%'] },
  'growth-lead': { focus: 'Funnels and retention', perks: ['Monetization index +10%', 'Community influence +5%'] },
  bd: { focus: 'Partnerships and channels', perks: ['Monetization index +7%', 'Brand reputation +6%'] },
  ux: { focus: 'Experience and co-creation', perks: ['Brand reputation +12%', 'Team morale +5%'] },
  qa: { focus: 'Regression coverage and release stability', perks: ['Technical debt -8%', 'Brand reputation +5%'] },
  sre: { focus: 'Reliability and cost', perks: ['Technical debt -12%', 'Cash reserve +5%'] },
  support: { focus: 'Customer issue resolution', perks: ['Brand reputation +8%', 'Community influence +6%'] },
  localization: { focus: 'Regional market execution', perks: ['Brand reputation +6%', 'Monetization index +6%'] },
  oss: { focus: 'Governance and contributions', perks: ['Open-source index +20%', 'Community influence +10%'] },
  field: { focus: 'Delivery and rollout', perks: ['Monthly revenue +$3K', 'Brand reputation +5%'] },
  pr: { focus: 'Brand and crisis communications', perks: ['Brand reputation +12%', 'Community influence +5%'] },
  'platform-pm': { focus: 'Ecosystem and compatibility strategy', perks: ['Open-source index +8%', 'Monetization index +6%'] },
  privacy: { focus: 'Privacy compliance and user trust', perks: ['Brand reputation +7%', 'Technical debt -4%'] },
}

const TEMPLATE_COPY_EN: Record<string, TemplateCopy> = {
  redis: { summary: 'A single-maintainer project with explosive community pull but weak monetization.' },
  mongodb: { summary: 'Open-Core monetization is mature, lifting both growth and revenue.' },
  elastic: { summary: 'Multi-product synergy drives growth, but cloud-vendor competition is a major risk.' },
  hashicorp: { summary: 'A strong DevOps tooling ecosystem with built-in licensing controversy risk.' },
  gitlab: { summary: 'Radical transparency creates high trust and steady commercialization.' },
  redhat: { summary: 'Enterprise subscriptions are steady and high quality, but growth is slower.' },
  docker: { summary: 'Community and growth explode, but revenue and control remain fragile.' },
  kubernetes: { summary: 'Foundation governance delivers massive trust and community growth, but weak control.' },
  dify: { summary: 'AI-native growth is fast, with both community breakout and intense competitive pressure.' },
}

function pick(locale: Locale, translated: string | undefined, fallback: string | undefined): string {
  if (locale === 'en') return translated ?? fallback ?? ''
  return fallback ?? translated ?? ''
}

export function getStatLabel(statId: string, variant: StatLabelVariant = 'title', locale = getCurrentLocale()): string {
  const labels = STAT_LABELS[statId]
  if (!labels) return variant === 'upper' ? statId.toUpperCase() : variant === 'lower' ? statId : titleFromId(statId)
  if (locale === 'en') return labels[variant]
  return labels[variant]
}

export function formatEffect(effect: Record<string, number>, locale = getCurrentLocale()): string {
  return Object.entries(effect)
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `${getStatLabel(key, 'lower', locale)}: ${value > 0 ? '+' : ''}${value}`)
    .join(', ')
}

export function getPhaseLabel(phase: GameState['phase'], locale = getCurrentLocale()): string {
  return pick(locale, PHASE_LABELS[phase], phase.toUpperCase())
}

export function getStageLabel(stage: GameStage, locale = getCurrentLocale()): string {
  return pick(locale, STAGE_LABELS[stage], stage.toUpperCase())
}

export function getGameStageLabel(stage: GameStage, locale = getCurrentLocale()): string {
  return getStageLabel(stage, locale)
}

export function getArchetypeLabel(archetype: string, locale = getCurrentLocale()): string {
  return pick(locale, ARCHETYPE_LABELS[archetype], titleFromId(archetype))
}

export function getFactionLabel(faction: string, locale = getCurrentLocale()): string {
  return pick(locale, FACTION_LABELS[faction], titleFromId(faction))
}

export function getModeName(modeId: string, fallback = titleFromId(modeId), locale = getCurrentLocale()): string {
  return pick(locale, MODE_NAMES[modeId], fallback)
}

export function getModeGoal(modeId: string, fallback = '', locale = getCurrentLocale()): string {
  return pick(locale, MODE_GOALS[modeId], fallback)
}

export function getCardDescription(cardId: string, fallback = '', locale = getCurrentLocale()): string {
  return pick(locale, CARD_COPY_EN[cardId]?.description, fallback)
}

export function getCardCondition(cardId: string, fallback = '', locale = getCurrentLocale()): string {
  return pick(locale, CARD_COPY_EN[cardId]?.condition, fallback)
}

export function getEventDescription(eventId: string, fallback = '', locale = getCurrentLocale()): string {
  return pick(locale, EVENT_COPY_EN[eventId]?.description, fallback)
}

export function getEventOptionLabel(
  eventId: string,
  optionIndex: number,
  fallback = '',
  locale = getCurrentLocale(),
): string {
  return pick(locale, EVENT_COPY_EN[eventId]?.options?.[optionIndex]?.label, fallback)
}

export function getEventOptionDescription(
  eventId: string,
  optionIndex: number,
  fallback = '',
  locale = getCurrentLocale(),
): string {
  return pick(locale, EVENT_COPY_EN[eventId]?.options?.[optionIndex]?.description, fallback)
}

export function getRoleName(roleId: string, fallback = '', locale = getCurrentLocale()): string {
  if (locale === 'en') return roleNameFromId(roleId)
  return fallback || roleNameFromId(roleId)
}

export function getRoleTitle(roleId: string, fallback = '', locale = getCurrentLocale()): string {
  if (locale === 'en') return roleTitleFromId(roleId)
  return fallback || roleTitleFromId(roleId)
}

export function getRoleFocus(roleId: string, fallback = '', locale = getCurrentLocale()): string {
  return pick(locale, ROLE_COPY_EN[roleId]?.focus, fallback)
}

export function getRolePerk(roleId: string, index: number, fallback = '', locale = getCurrentLocale()): string {
  return pick(locale, ROLE_COPY_EN[roleId]?.perks[index], fallback)
}

export function getTemplateSummary(templateId: string, fallback = '', locale = getCurrentLocale()): string {
  return pick(locale, TEMPLATE_COPY_EN[templateId]?.summary, fallback)
}

export function getTemplateRecommendedRoute(route: string, locale = getCurrentLocale()): string {
  return pick(locale, ROUTE_TRANSLATIONS[route], route)
}

export function getActiveEffectLabel(label: string, locale = getCurrentLocale()): string {
  if (locale === 'en') return label
  return label
}

export function getHistoryMessage(message: string, locale = getCurrentLocale()): string {
  if (locale === 'en') return message
  return message
}

export function getProgressionChoiceLabel(choiceId: string, locale = getCurrentLocale()): string {
  if (locale === 'en') return titleFromId(choiceId)
  return titleFromId(choiceId)
}

export function getEventOptionLabelFromOption(
  event: Pick<GameEvent, 'id'>,
  option: Pick<EventOption, 'label'>,
  index: number,
  locale = getCurrentLocale(),
): string {
  return getEventOptionLabel(event.id, index, option.label, locale)
}

export function getTranslatedCardConditionForLog(card: { id: string; condition?: string }, locale = getCurrentLocale()): string {
  return getCardCondition(card.id, card.condition ?? '', locale)
}

export function getTranslatedEventDescriptionForLog(event: { id: string; description: string }, locale = getCurrentLocale()): string {
  return getEventDescription(event.id, event.description, locale)
}

export function formatEffectSummary(effect: StatEffect, locale = getCurrentLocale()): string {
  return formatEffect(effect as Record<string, number>, locale)
}
