export type CompanyStatId =
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

export type CompanyTemplate = {
  id: string
  name: string
  phase: string
  summary: string
  ability: string
  eventBias: string
  recommendedRoute: string
  modifiers: Partial<Record<CompanyStatId, number>>
}

export type CompanyProfile = {
  id: string
  name: string
  templateId: string
  templateName: string
  phase: string
  summary: string
  ability: string
  eventBias: string
  recommendedRoute: string
  modifiers: Partial<Record<CompanyStatId, number>>
  source: 'template' | 'template-random' | 'custom'
}

const namePrefixes = ['Aurora', 'Nimbus', 'Vertex', 'Pulse', 'Atlas', 'Nova', 'Cobalt', 'Lattice']
const nameSuffixes = ['Labs', 'Works', 'Cloud', 'Systems', 'Studio', 'Forge', 'Core', 'Dynamics']

export const companyTemplates: CompanyTemplate[] = [
  {
    id: 'redis',
    name: 'Redis Archetype',
    phase: '2009-2019',
    summary: '单人项目爆发社区影响力，商业化能力偏弱。',
    ability: 'antirez 效应：开源策略卡额外 trust +1。',
    eventBias: 'Cloud Vendor Fork 事件概率显著上升。',
    recommendedRoute: 'Open-Core',
    modifiers: {
      community: 5,
      growth: 4,
      revenue: 2,
      control: -2,
      stability: 3
    }
  },
  {
    id: 'mongodb',
    name: 'MongoDB Archetype',
    phase: '2013-2017',
    summary: 'Open-Core 商业化路径成熟，增长与营收同时拉升。',
    ability: 'Open-Core 飞轮：企业版卡不损失 community。',
    eventBias: 'Licensing Controversy 事件更易出现。',
    recommendedRoute: 'IPO',
    modifiers: {
      growth: 5,
      revenue: 4,
      community: 2,
      pressure: 2,
      reputation: 2
    }
  },
  {
    id: 'elastic',
    name: 'Elastic Archetype',
    phase: '2014-2021',
    summary: '多产品协同驱动增长，云厂商竞争风险较高。',
    ability: 'Stack 协同：同回合双卡较小效果额外 +2。',
    eventBias: 'Cloud Vendor Fork 事件概率提升。',
    recommendedRoute: 'Open-Core / IPO',
    modifiers: {
      community: 4,
      growth: 4,
      revenue: 3,
      stability: 2,
      risk: 1
    }
  },
  {
    id: 'hashicorp',
    name: 'HashiCorp Archetype',
    phase: '2015-2023',
    summary: 'DevOps 工具链生态强，许可证争议风险固定触发。',
    ability: '工具链锁定：商业化卡在条件达成后效果 +25%。',
    eventBias: 'Licensing Controversy 在中后期必然触发。',
    recommendedRoute: 'IPO / 并购退出',
    modifiers: {
      community: 5,
      growth: 4,
      reputation: 3,
      control: 2,
      dev_speed: 2
    }
  },
  {
    id: 'gitlab',
    name: 'GitLab Archetype',
    phase: '2016-2021',
    summary: '透明开源文化带来高信任与稳定商业化。',
    ability: '全透明文化：治理与路线图相关卡效果翻倍。',
    eventBias: 'Big Tech Competition 在早期固定触发。',
    recommendedRoute: 'IPO',
    modifiers: {
      community: 4,
      trust: 4,
      revenue: 3,
      growth: 3,
      control: -1
    }
  },
  {
    id: 'redhat',
    name: 'Red Hat Archetype',
    phase: '2005-2019',
    summary: '企业级订阅模式稳健，增长偏慢但质量高。',
    ability: 'Upstream First：社区治理卡额外 revenue +1。',
    eventBias: 'Big Enterprise Contract 事件概率加倍。',
    recommendedRoute: '并购退出',
    modifiers: {
      revenue: 6,
      reputation: 5,
      stability: 4,
      community: 3,
      growth: -1,
      pressure: 1
    }
  },
  {
    id: 'docker',
    name: 'Docker Archetype',
    phase: '2013-2017',
    summary: '社区和增长爆发，但营收与控制力存在硬伤。',
    ability: '病毒式增长：发布类策略卡效果翻倍。',
    eventBias: 'Industry Standardization 中期高概率触发。',
    recommendedRoute: '并购退出',
    modifiers: {
      community: 6,
      growth: 6,
      revenue: -2,
      pressure: 3,
      control: -2
    }
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes / CNCF Archetype',
    phase: '2015-2020',
    summary: '基金会治理带来高信任与社区爆发，但控制力弱。',
    ability: '基金会治理：治理卡使 community 与 trust 双倍增益。',
    eventBias: 'Ecosystem Explosion 开局提前触发。',
    recommendedRoute: '传奇开源',
    modifiers: {
      community: 7,
      trust: 5,
      control: -4,
      reputation: 5
    }
  },
  {
    id: 'dify',
    name: 'Dify / Langgenius Archetype',
    phase: '2023-2026',
    summary: 'AI-Native 高速增长，社区爆发与竞争压力并存。',
    ability: 'Fast-Track：每 3 回合可额外打出 1 张策略卡。',
    eventBias: 'AI 赛道竞争与云厂商入场风险提高。',
    recommendedRoute: 'Open-Core / IPO',
    modifiers: {
      cash: 3,
      community: 6,
      growth: 5,
      reputation: 4,
      dev_speed: 3,
      trust: 3,
      pressure: 2,
      risk: 2
    }
  }
]

function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function makeRandomName(templateName: string): string {
  const token = templateName.split(' ')[0]
  return `${randomItem(namePrefixes)} ${token} ${randomItem(nameSuffixes)}`
}

export function randomCompanyTemplate(): CompanyTemplate {
  return randomItem(companyTemplates)
}

export function createCompanyProfile(
  template: CompanyTemplate,
  options: { randomName?: boolean; customName?: string } = {}
): CompanyProfile {
  const customName = options.customName?.trim()
  const name = customName || (options.randomName ? makeRandomName(template.name) : template.name)
  return {
    id: `${template.id}-${Date.now().toString(36)}-${Math.floor(Math.random() * 10000).toString(36)}`,
    name,
    templateId: template.id,
    templateName: template.name,
    phase: template.phase,
    summary: template.summary,
    ability: template.ability,
    eventBias: template.eventBias,
    recommendedRoute: template.recommendedRoute,
    modifiers: template.modifiers,
    source: customName ? 'custom' : options.randomName ? 'template-random' : 'template'
  }
}

export function formatModifiers(modifiers: Partial<Record<CompanyStatId, number>>): string[] {
  return Object.entries(modifiers).map(([key, value]) => {
    const sign = value && value > 0 ? '+' : ''
    return `${key} ${sign}${value}`
  })
}
