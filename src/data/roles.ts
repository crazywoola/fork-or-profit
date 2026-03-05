export type RoleAction = {
  name: string
  effect: string
  cooldown: string
}

export type RoleArchetype = {
  id: string
  name: string
  scene: string
  environment: string
  tools: string[]
  actions: RoleAction[]
}

export type CardCategory = 'Open Source' | 'Monetization' | 'Growth' | 'Operations' | 'Finance'

export type RoleProfile = {
  id: string
  name: string
  title: string
  focus: string
  perks: string[]
  abilities: string[]
  cards: string[]
  archetype: RoleArchetype['id']
  accent: string
  statBonuses: Record<string, number>
  effectMultipliers: Partial<Record<CardCategory, number>>
}

export const roleArchetypes: RoleArchetype[] = [
  {
    id: 'executive',
    name: '战略指挥',
    scene: '战略作战室',
    environment: '董事会与经营仪表盘',
    tools: ['路线图白板', '董事会投票', '资源调度', '投资人沟通'],
    actions: [
      { name: '战略转向', effect: '切换路线与本回合节奏', cooldown: '2 / 局' },
      { name: '共识沟通', effect: '提升团队士气与信任', cooldown: '1 / 回合' },
      { name: '资源再分配', effect: '本回合全局效率 +10%', cooldown: '3 回合' }
    ]
  },
  {
    id: 'engineering',
    name: '技术推进',
    scene: '架构工坊',
    environment: '工程战情室',
    tools: ['技术雷达', '债务清单', 'CI/CD 管线', '性能监控'],
    actions: [
      { name: '架构重构', effect: '清理技术债务并提升稳定性', cooldown: '2 回合' },
      { name: '性能冲刺', effect: '开发速度与稳定性 +15%', cooldown: '3 回合' },
      { name: '技术布道', effect: '社区影响力 +10%', cooldown: '2 / 局' }
    ]
  },
  {
    id: 'product',
    name: '产品策略',
    scene: '产品战术台',
    environment: '用户研究室',
    tools: ['需求优先级', '原型迭代', '路线图', '用户访谈'],
    actions: [
      { name: '用户调研', effect: '锁定下一张事件卡', cooldown: '2 回合' },
      { name: 'MVP 快速验证', effect: '增长势头 +12%', cooldown: '2 / 局' },
      { name: '路线图发布', effect: '提升品牌或商业化', cooldown: '2 / 局' }
    ]
  },
  {
    id: 'growth',
    name: '市场增长',
    scene: '增长指挥台',
    environment: '市场情报室',
    tools: ['渠道漏斗', '活动排期', '品牌监测', '竞品雷达'],
    actions: [
      { name: '拉新战役', effect: '增长势头 +15%', cooldown: '2 / 局' },
      { name: '发布会节奏', effect: '品牌声誉 +12%', cooldown: '3 回合' },
      { name: '渠道联动', effect: '商业化指数 +10%', cooldown: '2 / 局' }
    ]
  },
  {
    id: 'revenue',
    name: '营收推进',
    scene: '营收作战室',
    environment: '客户战场',
    tools: ['合同管线', '客户健康度', '续费日历', '报价模板'],
    actions: [
      { name: '大客户突破', effect: '月度营收 +20K', cooldown: '50% 概率' },
      { name: '续费保卫战', effect: '免疫客户流失', cooldown: '2 / 局' },
      { name: '定价谈判', effect: '商业化指数 +8%', cooldown: '2 回合' }
    ]
  },
  {
    id: 'community',
    name: '社区生态',
    scene: '社区营地',
    environment: '开发者栈',
    tools: ['贡献者图谱', '治理议程', '活动日历', '社区公告'],
    actions: [
      { name: '社区大使', effect: '社区影响力 +10%', cooldown: '3 回合' },
      { name: '开源峰会', effect: '峰会事件加成 +50%', cooldown: '1 / 局' },
      { name: '治理提案', effect: '开源指数 +15%', cooldown: '2 / 局' }
    ]
  },
  {
    id: 'finance',
    name: '资金控制',
    scene: '资金控制室',
    environment: '财务驾驶舱',
    tools: ['现金流预测', '预算分配', '融资看板', '成本结构'],
    actions: [
      { name: '预算重分配', effect: '降低策略卡成本 50%', cooldown: '2 / 局' },
      { name: '追加投资', effect: '现金储备 +30%', cooldown: '1 / 局' },
      { name: '成本削减', effect: '现金储备 +10%', cooldown: '3 回合' }
    ]
  },
  {
    id: 'risk',
    name: '风险防线',
    scene: '合规与安全中心',
    environment: '风险响应室',
    tools: ['合规清单', '威胁模型', '隐私审计', '安全预案'],
    actions: [
      { name: '合规审查', effect: '免疫一次合规事件', cooldown: '1 / 回合' },
      { name: '安全补丁', effect: '清除安全事件影响', cooldown: '2 / 局' },
      { name: '隐私评估', effect: '品牌信任 +8%', cooldown: '2 / 局' }
    ]
  },
  {
    id: 'people',
    name: '组织与文化',
    scene: '人才指挥所',
    environment: '文化与绩效中枢',
    tools: ['招聘管线', '绩效节奏', '组织健康度', '士气监测'],
    actions: [
      { name: '招聘冲刺', effect: '本回合 +1 行动', cooldown: '3 回合' },
      { name: '文化共识', effect: '团队士气 +20%', cooldown: '1 / 局' },
      { name: '绩效复盘', effect: '行动效率 +8%', cooldown: '3 回合' }
    ]
  },
  {
    id: 'data',
    name: '数据智能',
    scene: '智能实验室',
    environment: '数据与模型',
    tools: ['实验平台', '特征仓库', '指标仪表盘', '模型监控'],
    actions: [
      { name: '模型迭代', effect: '商业化指数 +12%', cooldown: '2 回合' },
      { name: 'A/B 实验', effect: '增长势头 +10%', cooldown: '2 / 局' },
      { name: '数据飞轮', effect: '社区影响力 +5%', cooldown: '被动' }
    ]
  },
  {
    id: 'support',
    name: '客户支持',
    scene: '支持中枢',
    environment: '客服雷达',
    tools: ['工单系统', '知识库', 'SLA 追踪', '问题回溯'],
    actions: [
      { name: '极速响应', effect: '清除一次客户投诉影响', cooldown: '2 / 局' },
      { name: '知识库建设', effect: '负面事件 -10%', cooldown: '3 回合' },
      { name: '痛点洞察', effect: '抽取并预览事件卡', cooldown: '1 / 回合' }
    ]
  },
  {
    id: 'design',
    name: '体验设计',
    scene: '体验工坊',
    environment: '设计系统工作台',
    tools: ['体验走查', '可用性测试', '设计系统', '用户共创'],
    actions: [
      { name: '体验重构', effect: '品牌声誉 +5%', cooldown: '2 / 局' },
      { name: '设计系统', effect: '产品类策略卡 +10%', cooldown: '3 回合' },
      { name: '用户共创', effect: '社区影响力 +10%', cooldown: '1 / 局' }
    ]
  },
  {
    id: 'operations',
    name: '运营节奏',
    scene: '运营中枢',
    environment: '流程监控室',
    tools: ['OKR 看板', '流程流转', '交付节奏', '资源排期'],
    actions: [
      { name: '作战节奏', effect: '调整行动顺序', cooldown: '1 / 回合' },
      { name: '流程再造', effect: '负面事件 -30%', cooldown: '2 / 局' },
      { name: '交付加速', effect: '团队士气 +8%', cooldown: '2 回合' }
    ]
  }
]

export const roles: RoleProfile[] = [
  {
    id: 'ceo',
    name: 'CEO / 联合创始人',
    title: '最终决策者',
    focus: '公司方向与关键博弈',
    perks: ['现金储备 +10%', '品牌声誉 +10%'],
    abilities: ['战略转向（每局 2 次）', '董事会背书', '愿景演讲'],
    cards: ['融资 A 轮', '全员信', '战略合作 MOU'],
    archetype: 'executive',
    accent: '#ffb870',
    statBonuses: { cash: 2, reputation: 2 },
    effectMultipliers: { 'Finance': 1.25, 'Operations': 1.15 },
  },
  {
    id: 'cto',
    name: 'CTO / 技术负责人',
    title: '技术路线掌舵者',
    focus: '开源与架构策略',
    perks: ['技术债务 -15%', '开源指数 +10%'],
    abilities: ['架构重构', '开源贡献节', '技术布道'],
    cards: ['开源核心模块', '技术路演', '重构债务'],
    archetype: 'engineering',
    accent: '#7fc8ff',
    statBonuses: { dev_speed: 3, community: 2 },
    effectMultipliers: { 'Open Source': 1.3, 'Operations': 1.2 },
  },
  {
    id: 'cmo',
    name: 'CMO / 市场负责人',
    title: '品牌与增长引擎',
    focus: '市场叙事与传播',
    perks: ['品牌声誉 +15%', '商业化指数 +5%'],
    abilities: ['病毒式传播', '竞品分析报告', '开发者关系计划'],
    cards: ['发布会策划', '开发者关系计划', 'PR 危机公关'],
    archetype: 'growth',
    accent: '#ff8a9b',
    statBonuses: { reputation: 3, growth: 1 },
    effectMultipliers: { 'Growth': 1.3, 'Monetization': 1.1 },
  },
  {
    id: 'vp-sales',
    name: 'VP of Sales / 销售负责人',
    title: '营收猎手',
    focus: '合同与价格战',
    perks: ['月度营收 +$5K', '商业化指数 +10%'],
    abilities: ['大客户突破', '价格战应对', '渠道合作'],
    cards: ['企业销售', '企业销售', '渠道合作协议'],
    archetype: 'revenue',
    accent: '#ffb870',
    statBonuses: { revenue: 3, cash: 1 },
    effectMultipliers: { 'Monetization': 1.3, 'Finance': 1.15 },
  },
  {
    id: 'staff-engineer',
    name: '核心工程师 / Staff Engineer',
    title: '技术深度担当',
    focus: '社区贡献与质量',
    perks: ['技术债务 -10%', '开源指数 +15%'],
    abilities: ['深夜贡献', 'Hackathon 组织者', '代码审查文化'],
    cards: ['开源 RFC', '性能优化', '贡献者激励计划'],
    archetype: 'engineering',
    accent: '#7fc8ff',
    statBonuses: { community: 3, dev_speed: 2 },
    effectMultipliers: { 'Open Source': 1.35, 'Operations': 1.15 },
  },
  {
    id: 'pm',
    name: '产品经理 / PM',
    title: '需求翻译官',
    focus: '用户与商业平衡',
    perks: ['团队士气 +10%', '品牌声誉 +5%'],
    abilities: ['用户调研', '路线图发布', '功能优先级仲裁'],
    cards: ['用户故事地图', 'MVP 快速验证', '路线图发布'],
    archetype: 'product',
    accent: '#9bffb1',
    statBonuses: { reputation: 1, growth: 2 },
    effectMultipliers: { 'Growth': 1.2, 'Monetization': 1.15 },
  },
  {
    id: 'vc',
    name: '投资人 / VC Observer',
    title: '外部压力源',
    focus: '资金与否决权',
    perks: ['观察者角色', '否决权'],
    abilities: ['追加投资', '董事会施压', '退出威胁'],
    cards: ['投资备忘', '估值锚定', '董事会投票'],
    archetype: 'finance',
    accent: '#ffdf6f',
    statBonuses: { cash: 4, pressure: 1 },
    effectMultipliers: { 'Finance': 1.4, 'Operations': 1.1 },
  },
  {
    id: 'devrel',
    name: '社区运营 / DevRel',
    title: '开源社区桥梁',
    focus: '社区影响力放大',
    perks: ['社区影响力 +20%', '开源指数 +10%'],
    abilities: ['社区大使招募', '开源峰会演讲', '负面舆情处理'],
    cards: ['社区通讯', '开源大使计划', '线上 Meetup'],
    archetype: 'community',
    accent: '#7fd7ff',
    statBonuses: { community: 4, trust: 2 },
    effectMultipliers: { 'Open Source': 1.3, 'Growth': 1.2 },
  },
  {
    id: 'cfo',
    name: 'CFO / 财务负责人',
    title: '资金与成本守门人',
    focus: '现金流与预算',
    perks: ['现金储备 +15%', '商业化指数 +5%'],
    abilities: ['预算重分配', '现金流预测', '财务纪律'],
    cards: ['成本削减计划', '融资路演', '现金流预警'],
    archetype: 'finance',
    accent: '#ffd777',
    statBonuses: { cash: 3, revenue: 1 },
    effectMultipliers: { 'Finance': 1.35, 'Operations': 1.15 },
  },
  {
    id: 'coo',
    name: 'COO / 运营负责人',
    title: '组织效率加速器',
    focus: '流程与执行节奏',
    perks: ['团队士气 +10%', '月度营收 +$3K'],
    abilities: ['作战节奏', '流程再造', '执行强度'],
    cards: ['OKR 对齐', '运营看板', '交付加速'],
    archetype: 'operations',
    accent: '#d3ffb8',
    statBonuses: { revenue: 1, stability: 2 },
    effectMultipliers: { 'Operations': 1.3, 'Growth': 1.1 },
  },
  {
    id: 'cpo',
    name: 'CPO / 产品负责人',
    title: '产品愿景守护者',
    focus: '产品叙事与取舍',
    perks: ['品牌声誉 +8%', '商业化指数 +8%'],
    abilities: ['产品叙事', '价值取舍', '路线聚焦'],
    cards: ['产品定位升级', '需求拆解会', '定价实验'],
    archetype: 'product',
    accent: '#9bffb1',
    statBonuses: { reputation: 2, growth: 1 },
    effectMultipliers: { 'Growth': 1.2, 'Monetization': 1.2 },
  },
  {
    id: 'legal',
    name: '法务负责人 / Legal Counsel',
    title: '合规与风险防线',
    focus: '许可与合同策略',
    perks: ['品牌声誉 +5%', '技术债务 -5%'],
    abilities: ['合规审查', '授权策略', '风险提示'],
    cards: ['合同模板升级', '许可兼容性审查', '合规培训'],
    archetype: 'risk',
    accent: '#ff9f7a',
    statBonuses: { reputation: 1, stability: 1 },
    effectMultipliers: { 'Operations': 1.25, 'Finance': 1.15 },
  },
  {
    id: 'security',
    name: '安全负责人 / Security Lead',
    title: '系统信任护盾',
    focus: '漏洞与安全响应',
    perks: ['技术债务 -10%', '品牌声誉 +5%'],
    abilities: ['安全补丁', '漏洞赏金', '红队演练'],
    cards: ['安全审计', '应急响应', '可信发布'],
    archetype: 'risk',
    accent: '#ff9f7a',
    statBonuses: { stability: 2, reputation: 1 },
    effectMultipliers: { 'Operations': 1.3, 'Open Source': 1.1 },
  },
  {
    id: 'ai',
    name: '数据科学 / AI 负责人',
    title: '智能化推动者',
    focus: '数据飞轮与模型',
    perks: ['商业化指数 +8%', '技术债务 -5%'],
    abilities: ['模型迭代', '数据飞轮', '智能演示'],
    cards: ['A/B 实验', '数据标注', '智能功能上线'],
    archetype: 'data',
    accent: '#7df0ff',
    statBonuses: { dev_speed: 2, growth: 1 },
    effectMultipliers: { 'Monetization': 1.2, 'Operations': 1.15 },
  },
  {
    id: 'cs',
    name: '客户成功 / CS Lead',
    title: '续费与口碑守护者',
    focus: '客户生命周期',
    perks: ['月度营收 +$4K', '品牌声誉 +8%'],
    abilities: ['续费保卫战', '成功案例', '需求回流'],
    cards: ['关键客户回访', '客户成功计划', '续费激励'],
    archetype: 'revenue',
    accent: '#ffc48b',
    statBonuses: { revenue: 2, reputation: 2 },
    effectMultipliers: { 'Monetization': 1.25, 'Growth': 1.1 },
  },
  {
    id: 'people',
    name: '人力资源 / People Ops',
    title: '团队稳定驱动者',
    focus: '招聘与文化',
    perks: ['团队士气 +15%', '技术债务 -3%'],
    abilities: ['招聘冲刺', '文化共识', '绩效节奏'],
    cards: ['人才引进', '文化宣言', '绩效复盘'],
    archetype: 'people',
    accent: '#c7ff9b',
    statBonuses: { stability: 2, trust: 2 },
    effectMultipliers: { 'Operations': 1.25, 'Growth': 1.1 },
  },
  {
    id: 'growth-lead',
    name: '增长负责人 / Growth Lead',
    title: '增长实验专家',
    focus: '漏斗与留存',
    perks: ['商业化指数 +10%', '社区影响力 +5%'],
    abilities: ['增长实验', '留存曲线', '增长飞轮'],
    cards: ['漏斗优化', '增长黑客', '留存运营'],
    archetype: 'growth',
    accent: '#ff8a9b',
    statBonuses: { growth: 3, revenue: 1 },
    effectMultipliers: { 'Growth': 1.35, 'Monetization': 1.15 },
  },
  {
    id: 'bd',
    name: '合作伙伴 / BD 负责人',
    title: '生态协作开路者',
    focus: '合作与渠道',
    perks: ['商业化指数 +7%', '品牌声誉 +6%'],
    abilities: ['战略联盟', '生态联动', '渠道扩张'],
    cards: ['生态合作协议', '联合发布', '渠道试点'],
    archetype: 'revenue',
    accent: '#ffc48b',
    statBonuses: { revenue: 2, reputation: 1 },
    effectMultipliers: { 'Monetization': 1.2, 'Growth': 1.15 },
  },
  {
    id: 'ux',
    name: '设计负责人 / UX Lead',
    title: '体验质量把关',
    focus: '体验与共创',
    perks: ['品牌声誉 +12%', '团队士气 +5%'],
    abilities: ['体验重构', '设计系统', '用户共创'],
    cards: ['体验改版', '设计系统搭建', '用户共创营'],
    archetype: 'design',
    accent: '#bba6ff',
    statBonuses: { reputation: 3, community: 1 },
    effectMultipliers: { 'Growth': 1.2, 'Open Source': 1.15 },
  },
  {
    id: 'qa',
    name: 'QA / 测试负责人',
    title: '质量守门人',
    focus: '回归与发布稳定',
    perks: ['技术债务 -8%', '品牌声誉 +5%'],
    abilities: ['回归测试', '质量门禁', '缺陷洞察'],
    cards: ['自动化测试', '质量报告', '灰度发布'],
    archetype: 'engineering',
    accent: '#7fc8ff',
    statBonuses: { stability: 2, dev_speed: 1 },
    effectMultipliers: { 'Operations': 1.25, 'Open Source': 1.1 },
  },
  {
    id: 'sre',
    name: 'DevOps / SRE',
    title: '可靠性调度者',
    focus: '稳定性与成本',
    perks: ['技术债务 -12%', '现金储备 +5%'],
    abilities: ['扩容应急', '成本优化', '可靠性指标'],
    cards: ['可观测性升级', '容灾演练', '成本优化'],
    archetype: 'engineering',
    accent: '#7fc8ff',
    statBonuses: { stability: 3, cash: 1 },
    effectMultipliers: { 'Operations': 1.3, 'Finance': 1.1 },
  },
  {
    id: 'support',
    name: '技术支持 / Support Lead',
    title: '口碑修复者',
    focus: '客户问题解决',
    perks: ['品牌声誉 +8%', '社区影响力 +6%'],
    abilities: ['极速响应', '知识库建设', '痛点洞察'],
    cards: ['24x7 支持', 'FAQ 发布', '关键问题回溯'],
    archetype: 'support',
    accent: '#6fd6ff',
    statBonuses: { reputation: 2, community: 1 },
    effectMultipliers: { 'Operations': 1.2, 'Growth': 1.15 },
  },
  {
    id: 'localization',
    name: '国际化 / Localization Lead',
    title: '全球化推进者',
    focus: '区域市场落地',
    perks: ['品牌声誉 +6%', '商业化指数 +6%'],
    abilities: ['区域落地', '多语言发布', '本地伙伴'],
    cards: ['本地化发布', '区域市场调研', '国际合作伙伴'],
    archetype: 'product',
    accent: '#9bffb1',
    statBonuses: { reputation: 1, growth: 2 },
    effectMultipliers: { 'Growth': 1.25, 'Monetization': 1.1 },
  },
  {
    id: 'oss',
    name: '开源维护者 / OSS Maintainer',
    title: '核心仓库守护者',
    focus: '治理与贡献',
    perks: ['开源指数 +20%', '社区影响力 +10%'],
    abilities: ['维护节奏', '治理升级', '合并窗口'],
    cards: ['维护者计划', '治理提案', 'Release 候选'],
    archetype: 'community',
    accent: '#7fd7ff',
    statBonuses: { community: 5, trust: 2 },
    effectMultipliers: { 'Open Source': 1.4, 'Growth': 1.1 },
  },
  {
    id: 'field',
    name: '现场工程师 / Field Engineer',
    title: '关键客户救火队',
    focus: '交付与落地',
    perks: ['月度营收 +$3K', '品牌声誉 +5%'],
    abilities: ['现场救援', '落地模板', '需求回传'],
    cards: ['客户现场调优', '交付模板', '工程案例复盘'],
    archetype: 'revenue',
    accent: '#ffc48b',
    statBonuses: { revenue: 1, reputation: 1 },
    effectMultipliers: { 'Monetization': 1.2, 'Operations': 1.15 },
  },
  {
    id: 'pr',
    name: 'PR / 公关负责人',
    title: '舆论与叙事掌控',
    focus: '品牌与危机公关',
    perks: ['品牌声誉 +12%', '社区影响力 +5%'],
    abilities: ['危机公关', '媒体曝光', '叙事升级'],
    cards: ['媒体采访', '舆情监控', '品牌故事发布'],
    archetype: 'growth',
    accent: '#ff8a9b',
    statBonuses: { reputation: 3, community: 1 },
    effectMultipliers: { 'Growth': 1.25, 'Open Source': 1.1 },
  },
  {
    id: 'platform-pm',
    name: '平台产品经理 / Platform PM',
    title: '平台化架构师',
    focus: '生态与兼容策略',
    perks: ['开源指数 +8%', '商业化指数 +6%'],
    abilities: ['平台化路线', '生态 SDK', '兼容层'],
    cards: ['SDK 发布', '平台路线图', '兼容层设计'],
    archetype: 'product',
    accent: '#9bffb1',
    statBonuses: { community: 2, dev_speed: 1 },
    effectMultipliers: { 'Open Source': 1.2, 'Growth': 1.2 },
  },
  {
    id: 'privacy',
    name: '数据隐私官 / Privacy Officer',
    title: '隐私信任守护',
    focus: '隐私合规与用户信任',
    perks: ['品牌声誉 +7%', '技术债务 -4%'],
    abilities: ['隐私评估', '数据最小化', '合规优先级'],
    cards: ['隐私协议更新', '数据地图', '合规审计'],
    archetype: 'risk',
    accent: '#ff9f7a',
    statBonuses: { reputation: 2, trust: 1 },
    effectMultipliers: { 'Operations': 1.2, 'Finance': 1.1 },
  }
]
