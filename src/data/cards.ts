import { Card } from '../engine/types'

export const STRATEGY_CARDS: Card[] = [
  // --- Type 1: Open Source Strategy ---
  {
    id: 'open-core',
    title: 'Open Core',
    category: 'Open Source',
    description: '核心产品开源，高级功能收费。最经典的开源商业化路径。',
    effect: { community: 3, revenue: 3, control: 1 },
    notes: '解锁「双轨模式」状态',
    condition: 'community >= 5'
  },
  {
    id: 'fully-open-source',
    title: 'Fully Open Source',
    category: 'Open Source',
    description: '将所有代码完全开放，社区优先，放弃短期收入。',
    effect: { community: 6, growth: 4, revenue: -2, control: -3 },
    notes: 'trust +2，下一张开源卡效果 +20%'
  },
  {
    id: 'dual-license',
    title: 'Dual License',
    category: 'Open Source',
    description: '向商业用户收取许可证费，个人用户免费使用。',
    effect: { revenue: 4, community: -2 },
    notes: 'control +2，但触发「Licensing Controversy」事件概率 +25%'
  },
  {
    id: 'contributor-program',
    title: 'Contributor Program',
    category: 'Open Source',
    description: '建立结构化的社区贡献者激励机制（Swag、荣誉、奖金）。',
    effect: { community: 5, growth: 2, cash: -1 },
    notes: '3 回合内每回合 community +1'
  },
  {
    id: 'dev-docs-push',
    title: 'Developer Documentation Push',
    category: 'Open Source',
    description: '全力重写开发者文档，降低上手门槛。',
    effect: { community: 3, growth: 2 },
    notes: 'trust +1，新贡献者加入速度加快'
  },
  {
    id: 'open-governance',
    title: 'Open Governance',
    category: 'Open Source',
    description: '成立技术指导委员会（TSC），社区参与产品决策。',
    effect: { community: 4, control: -2 },
    notes: 'trust +3，Fork 分叉风险 -50%'
  },
  {
    id: 'accept-community-prs',
    title: 'Accept Community PRs',
    category: 'Open Source',
    description: '开放代码仓库接受外部 PR，加速产品迭代。',
    effect: { community: 3, dev_speed: 1 },
    notes: 'stability -1（外部代码质量参差不齐）'
  },
  {
    id: 'launch-plugin-ecosystem',
    title: 'Launch Plugin Ecosystem',
    category: 'Open Source',
    description: '发布插件/扩展 API，让社区围绕核心产品构建生态。',
    effect: { community: 5, growth: 3 },
    notes: '4 回合后触发「Ecosystem Explosion」正面事件'
  },
  {
    id: 'foundation-donation',
    title: 'Foundation Donation',
    category: 'Open Source',
    description: '向 Linux Foundation / Apache 等基金会捐赠或申请加入。',
    effect: { reputation: 3, cash: -2 },
    notes: 'community +1，解锁「Foundation Formation」事件链'
  },
  {
    id: 'public-roadmap',
    title: 'Public Roadmap',
    category: 'Open Source',
    description: '将产品路线图完全公开，接受社区监督。',
    effect: { community: 2, trust: 2 },
    notes: '竞争对手获取你的路线信息（竞品跟进事件概率 +15%）'
  },

  // --- Type 2: Monetization ---
  {
    id: 'enterprise-edition',
    title: 'Enterprise Edition',
    category: 'Monetization',
    description: '推出企业版，包含 SSO、审计日志、SLA 保障等企业功能。',
    effect: { revenue: 6, community: -2 },
    condition: 'community >= 8'
  },
  {
    id: 'hosted-saas',
    title: 'Hosted SaaS',
    category: 'Monetization',
    description: '将开源产品包装成云托管 SaaS 服务，按使用量或订阅收费。',
    effect: { revenue: 7, growth: 3, cash: -3 },
    notes: '解锁「Cloud Vendor Fork」风险'
  },
  {
    id: 'premium-features',
    title: 'Premium Features',
    category: 'Monetization',
    description: '将部分受欢迎的功能锁定在付费层。',
    effect: { revenue: 5, community: -2 },
    risk: '触发「社区要求功能回归免费」事件概率 +30%'
  },
  {
    id: 'usage-pricing',
    title: 'Usage Pricing',
    category: 'Monetization',
    description: '按实际使用量计费（API 调用次数、数据量等）。',
    effect: { revenue: 4, growth: -1 },
    notes: 'risk +1（用量激增导致收入波动）'
  },
  {
    id: 'consulting-services',
    title: 'Consulting Services',
    category: 'Monetization',
    description: '提供专业咨询、实施、培训服务，利用社区信任变现。',
    effect: { revenue: 3, community: 1 },
    notes: 'reputation +1，不损失控制力的温和商业化'
  },
  {
    id: 'marketplace-revenue',
    title: 'Marketplace Revenue',
    category: 'Monetization',
    description: '构建应用市场，对第三方插件/集成抽取收益分成。',
    effect: { revenue: 4, community: 2 },
    condition: '需先打出「Launch Plugin Ecosystem」'
  },
  {
    id: 'enterprise-support',
    title: 'Enterprise Support',
    category: 'Monetization',
    description: '推出付费技术支持套餐（SLA、专属工程师、优先修复）。',
    effect: { revenue: 5, reputation: 1 },
    notes: 'trust +1，企业客户黏性提升'
  },
  {
    id: 'paid-api-access',
    title: 'Paid API Access',
    category: 'Monetization',
    description: '将核心 API 设置访问限额，超量付费。',
    effect: { revenue: 4, community: -1 },
    notes: 'growth -1（部分开发者转向替代方案）'
  },
  {
    id: 'license-enforcement',
    title: 'License Enforcement',
    category: 'Monetization',
    description: '主动追查违规商业使用，发律师函或诉讼。',
    effect: { revenue: 3, community: -3, control: 2 },
    risk: 'reputation -2，开源社区舆论强烈反弹'
  },
  {
    id: 'partner-program',
    title: 'Partner Program',
    category: 'Monetization',
    description: '建立合作伙伴/经销商网络，扩展销售覆盖范围。',
    effect: { revenue: 3, growth: 2, cash: -1 },
    notes: '合作伙伴管理成本'
  },

  // --- Type 3: Growth ---
  {
    id: 'developer-evangelism',
    title: 'Developer Evangelism',
    category: 'Growth',
    description: '派遣开发者布道师参加各大技术会议和社区活动。',
    effect: { community: 4, growth: 3 },
    notes: 'reputation +1，下一个会议类事件效果 +30%'
  },
  {
    id: 'hacker-news-launch',
    title: 'Hacker News Launch',
    category: 'Growth',
    description: '在 Hacker News 上发布「Show HN」帖，争取首页曝光。',
    effect: { growth: 5, community: 3 },
    risk: '60% 正面，40% 触发争议性评论（reputation -1）'
  },
  {
    id: 'product-hunt-launch',
    title: 'Product Hunt Launch',
    category: 'Growth',
    description: '在 Product Hunt 上正式发布，争取当日 #1 产品。',
    effect: { growth: 4 },
    notes: 'reputation +2 若获得 Top 3，成功则额外抽 1 张策略卡'
  },
  {
    id: 'free-tier',
    title: 'Free Tier',
    category: 'Growth',
    description: '提供永久免费层，降低用户采用门槛。',
    effect: { growth: 6, revenue: -2 },
    notes: 'community +2，长期转化率提升但短期现金流压力'
  },
  {
    id: 'community-events',
    title: 'Community Events',
    category: 'Growth',
    description: '举办线上/线下 Meetup、Hackathon、用户大会。',
    effect: { community: 4, cash: -1 },
    notes: 'trust +1，每 3 回合可重复使用'
  },
  {
    id: 'global-conference',
    title: 'Global Conference',
    category: 'Growth',
    description: '举办年度全球开发者大会（类似 KubeCon、re:Invent）。',
    effect: { reputation: 4, growth: 2, cash: -2 },
    notes: 'community +2，触发正面媒体报道'
  },
  {
    id: 'referral-program',
    title: 'Referral Program',
    category: 'Growth',
    description: '推出用户邀请奖励计划，通过口碑裂变增长。',
    effect: { growth: 4 },
    notes: 'revenue +1（长期转化），cash -1，效果随 community 大小等比扩大'
  },
  {
    id: 'dev-tools-integration',
    title: 'Developer Tools Integration',
    category: 'Growth',
    description: '与主流开发工具（VS Code、GitHub、Slack）深度集成。',
    effect: { growth: 3, community: 2 },
    notes: 'dev_speed +1，降低用户切换成本'
  },
  {
    id: 'sdk-release',
    title: 'SDK Release',
    category: 'Growth',
    description: '发布主流语言 SDK（Python、Go、TypeScript 等）。',
    effect: { growth: 3, community: 2 },
    notes: 'dev_speed +1，每新增一种语言 SDK 额外 growth +1'
  },
  {
    id: 'platform-strategy',
    title: 'Platform Strategy',
    category: 'Growth',
    description: '从工具转型为平台，允许第三方在上面构建业务。',
    effect: { growth: 5, community: 3 },
    condition: '需先打出「SDK Release」或「Launch Plugin Ecosystem」',
    notes: '解锁「Ecosystem Explosion」事件'
  },

  // --- Type 4: Operations ---
  {
    id: 'hire-engineers',
    title: 'Hire Engineers',
    category: 'Operations',
    description: '扩充工程团队，加速产品开发。',
    effect: { dev_speed: 3, cash: -3 },
    notes: 'stability +1（更多人手维护稳定性）'
  },
  {
    id: 'hire-sales-team',
    title: 'Hire Sales Team',
    category: 'Operations',
    description: '组建销售团队，主动开拓企业客户。',
    effect: { revenue: 4, cash: -3 },
    notes: 'pressure +1（投资人期待更高增长回报）'
  },
  {
    id: 'reduce-burn',
    title: 'Reduce Burn',
    category: 'Operations',
    description: '主动削减开支，延长现金跑道。',
    effect: { cash: 4, growth: -2 },
    notes: 'community -1（可能暂停部分社区活动）'
  },
  {
    id: 'remote-company',
    title: 'Remote Company',
    category: 'Operations',
    description: '转型为全远程公司，节省办公室成本并扩大招聘范围。',
    effect: { dev_speed: 2, cash: 1 },
    notes: 'community +1（可以雇佣更多开源社区成员）'
  },
  {
    id: 'build-internal-tools',
    title: 'Build Internal Tools',
    category: 'Operations',
    description: '投资内部工具链和工程效率平台。',
    effect: { dev_speed: 2 },
    notes: 'stability +1，长期减少技术债务积累'
  },
  {
    id: 'tech-debt-cleanup',
    title: 'Tech Debt Cleanup',
    category: 'Operations',
    description: '专注偿还技术债务，停止新功能开发一个 Sprint。',
    effect: { stability: 4, growth: -1 },
    notes: 'dev_speed +1（清理后速度提升）'
  },
  {
    id: 'improve-ci-cd',
    title: 'Improve CI/CD',
    category: 'Operations',
    description: '完善持续集成/持续交付流水线，加快发布节奏。',
    effect: { dev_speed: 2, stability: 1 },
    notes: '下一张技术类卡效果 +15%'
  },
  {
    id: 'security-audit',
    title: 'Security Audit',
    category: 'Operations',
    description: '委托第三方安全审计，主动发现并修复漏洞。',
    effect: { reputation: 2, cash: -2 },
    notes: 'risk -2，下一次安全漏洞事件负面效果减半'
  },
  {
    id: 'legal-defense',
    title: 'Legal Defense',
    category: 'Operations',
    description: '应对专利诉讼或许可证纠纷，支付法务费用。',
    effect: { reputation: 1, cash: -3 },
    condition: '仅在触发相关法律事件后可打出',
    notes: 'risk -3'
  },
  {
    id: 'acquire-startup',
    title: 'Acquire Startup',
    category: 'Operations',
    description: '收购一家互补的初创公司，快速获取技术或团队。',
    effect: { growth: 3, cash: -5 },
    notes: 'community +1（若被收购方是开源项目），pressure +1'
  },

  // --- Type 5: Finance ---
  {
    id: 'seed-round',
    title: 'Seed Round',
    category: 'Finance',
    description: '完成种子轮融资，获得初始运营资金。',
    effect: { cash: 6, control: -1 },
    condition: '游戏开局可用，后期 VC 不感兴趣',
    notes: '解锁「Series A」卡'
  },
  {
    id: 'series-a',
    title: 'Series A',
    category: 'Finance',
    description: 'A 轮融资，引入机构投资人。',
    effect: { cash: 10, control: -2, pressure: 2 },
    condition: 'revenue >= 5 或 community >= 10',
    notes: '投资人角色（若存在）获得否决权 ×2'
  },
  {
    id: 'series-b',
    title: 'Series B',
    category: 'Finance',
    description: 'B 轮融资，规模化扩张资金。',
    effect: { cash: 15, control: -3, pressure: 3 },
    condition: 'revenue >= 15 且 reputation >= 8',
    notes: '解锁「IPO」胜利路径'
  },
  {
    id: 'strategic-investor',
    title: 'Strategic Investor',
    category: 'Finance',
    description: '引入战略投资人（云厂商、大企业）。',
    effect: { cash: 6, growth: 2, control: -2 },
    risk: 'community -1（社区担心公司独立性），战略方可能带来资源但也带来利益冲突'
  },
  {
    id: 'ipo',
    title: 'IPO',
    category: 'Finance',
    description: '公司上市，最终胜利路径之一。',
    effect: { cash: 20, pressure: 4 },
    condition: 'revenue >= 25 且 reputation >= 12 且已完成 Series B',
    notes: '触发「IPO 模式」胜利检查'
  },
  {
    id: 'token-launch',
    title: 'Token Launch',
    category: 'Finance',
    description: '发行加密代币（适用于 Web3 领域）。',
    effect: { cash: 10, reputation: -2 },
    risk: 'risk +3，监管事件触发概率 +40%',
    notes: 'community +3（加密社区涌入）'
  },
  {
    id: 'crowdfunding',
    title: 'Crowdfunding',
    category: 'Finance',
    description: '通过 Kickstarter / Open Collective 向社区众筹。',
    effect: { cash: 5, community: 2 },
    notes: 'trust +2，无稀释股权'
  },
  {
    id: 'government-grant',
    title: 'Government Grant',
    category: 'Finance',
    description: '申请政府科研经费或产业扶持资金。',
    effect: { cash: 4, reputation: 2 },
    notes: 'risk -1，但申请周期长（需等待 2 回合才到账）'
  },
  {
    id: 'venture-debt',
    title: 'Venture Debt',
    category: 'Finance',
    description: '通过风险债务融资，不稀释股权但增加财务风险。',
    effect: { cash: 6, risk: 2 },
    condition: 'revenue >= 8（有还款能力证明）'
  },
  {
    id: 'stock-buyback',
    title: 'Stock Buyback',
    category: 'Finance',
    description: '回购员工/早期投资人股份，提升每股价值。',
    effect: { reputation: 2, cash: -4 },
    notes: 'pressure -1（减轻部分投资人压力），trust +1（员工感受到公司诚意）'
  }
]
