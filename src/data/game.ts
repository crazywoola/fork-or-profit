export type GameMode = {
  id: string
  name: string
  goal: string
}

export type Organization = {
  id: string
  name: string
  style: string
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
    name: '生存模式',
    goal: '12 回合内保持 cash 与 community 为正'
  },
  {
    id: 'ipo',
    name: 'IPO 模式',
    goal: '20 回合达成 revenue ≥ 30、reputation ≥ 15'
  },
  {
    id: 'legend',
    name: '传奇开源',
    goal: '20 回合内 community ≥ 30 且 growth ≥ 20'
  },
  {
    id: 'acquisition',
    name: '并购退出',
    goal: '触发收购事件并满足 reputation + revenue ≥ 25'
  },
  {
    id: 'open-core',
    name: 'Open-Core',
    goal: '20 回合内 community 与 revenue 同时 ≥ 15'
  }
]

export const organizations: Organization[] = [
  {
    id: 'flat',
    name: '扁平化创业团队',
    style: '共享行动池，节奏极快，适合开源路线'
  },
  {
    id: 'functional',
    name: '功能型组织',
    style: '部门分工明确，商业化卡牌加成'
  },
  {
    id: 'matrix',
    name: '矩阵式组织',
    style: '双维度协同，资源争夺更明显'
  },
  {
    id: 'squad',
    name: '公会制 / 小队制',
    style: '双队并行，小队竞争与协作'
  },
  {
    id: 'foundation',
    name: '开源基金会模型',
    style: 'TSC 投票机制，开源社区驱动'
  },
  {
    id: 'dual-track',
    name: '双轨集团',
    style: '社区与企业牌堆并行，强调平衡'
  }
]

export const companyStats: CompanyStat[] = [
  { id: 'cash', label: '现金储备', value: 10, max: 30, tone: 'warm' },
  { id: 'revenue', label: '月度营收', value: 0, max: 30, tone: 'warm' },
  { id: 'community', label: '社区影响力', value: 5, max: 30, tone: 'cool' },
  { id: 'growth', label: '增长势头', value: 3, max: 30, tone: 'cool' },
  { id: 'reputation', label: '品牌声誉', value: 5, max: 30, tone: 'cool' },
  { id: 'control', label: '控制力', value: 8, max: 30, tone: 'neutral' },
  { id: 'dev_speed', label: '开发速度', value: 3, max: 30, tone: 'cool' },
  { id: 'stability', label: '产品稳定性', value: 5, max: 30, tone: 'cool' },
  { id: 'pressure', label: '外部压力', value: 0, max: 10, tone: 'danger' },
  { id: 'trust', label: '信任度', value: 5, max: 30, tone: 'cool' },
  { id: 'risk', label: '风险暴露', value: 2, max: 10, tone: 'danger' }
]
