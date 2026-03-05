import { GameEvent } from '../engine/types'

export const GAME_EVENTS: GameEvent[] = [
  // --- Community Events ---
  {
    id: 'github-stars-explosion',
    title: 'GitHub Stars Explosion',
    category: 'Community',
    description: '你们的仓库在一夜之间被某个知名开发者推荐，Star 数暴涨。',
    immediateEffect: { community: 6, growth: 5 },
    options: [
      {
        label: '趁热打铁发 Blog',
        effect: { reputation: 2, community: 2 },
        description: '趁流量高峰输出内容'
      },
      {
        label: '快速修复积压 Issues',
        effect: { trust: 3, stability: 1 },
        description: '展示响应力'
      },
      {
        label: '推出赞助渠道',
        effect: { revenue: 2, community: -1 },
        description: '趁热变现，部分用户反感'
      }
    ],
    prototype: 'curl, bat, ripgrep 等工具的爆红时刻'
  },
  {
    id: 'hacker-news-front-page',
    title: 'Hacker News Front Page',
    category: 'Media',
    description: '你们的文章或产品登上 HN 首页，停留 4 小时。',
    immediateEffect: { growth: 5, community: 3 },
    options: [
      {
        label: '积极互动（好评）',
        effect: { reputation: 2, trust: 1 },
        description: '60% 概率'
      },
      {
        label: '引发争议（批评）',
        effect: { reputation: -1, community: 1 },
        description: '40% 概率，争议带来热度'
      }
    ],
    prototype: '几乎每个开发者工具的重要里程碑'
  },
  {
    id: 'cloud-vendor-fork',
    title: 'Cloud Vendor Fork',
    category: 'Competition',
    description: '一家主要云厂商宣布将你的开源项目 fork 并作为托管服务提供，自己不回馈上游。',
    immediateEffect: { control: -5, revenue: -3, community: 2 },
    duration: 3,
    options: [
      {
        label: '更换许可证（BSL/SSPL）',
        effect: { control: 4, community: -4 },
        description: '社区分裂，触发「Licensing Controversy」',
        unlocks: 'licensing-controversy'
      },
      {
        label: '与云厂商谈判合作',
        effect: { revenue: 3, control: -2 },
        description: '妥协但有收益'
      },
      {
        label: '全力建设社区护城河',
        effect: { community: 5, growth: 3 },
        description: '输了商业，赢了社区'
      }
    ],
    prototype: 'AWS ElastiCache vs Redis, AWS OpenSearch vs Elasticsearch'
  },
  {
    id: 'major-security-vulnerability',
    title: 'Major Security Vulnerability',
    category: 'Tech',
    description: '安全研究人员在你们产品中发现高危漏洞，已公开 CVE 编号，CVSS 评分 9.8。',
    immediateEffect: { reputation: -6, growth: -2, risk: 3 },
    duration: 2,
    options: [
      {
        label: '72 小时紧急修复 + 公开 Post-Mortem',
        effect: { reputation: 3, trust: 2 },
        description: '诚实挽回信任'
      },
      {
        label: '静默修复，低调处理',
        effect: { reputation: -4 },
        description: '无额外损失，但若被媒体发现额外惩罚'
      },
      {
        label: '免费升级所有受影响客户',
        effect: { cash: -2, revenue: 2 },
        description: '长期客户留存'
      }
    ],
    prototype: 'Log4Shell (Log4j), OpenSSL Heartbleed'
  },
  {
    id: 'open-source-maintainer-burnout',
    title: 'Open Source Maintainer Burnout',
    category: 'Community',
    description: '核心维护者公开发文：「我已经精疲力竭，无法再独自撑起这个项目」。',
    immediateEffect: { community: -5, dev_speed: -2 },
    duration: 2,
    options: [
      {
        label: '雇佣维护者全职投入',
        effect: { cash: -2, community: 3, dev_speed: 2 },
        description: '每回合 cash -2'
      },
      {
        label: '公开招募社区接替者',
        effect: { community: 2 },
        description: '需等待 2 回合才有效果'
      },
      {
        label: '宣布进入维护模式',
        effect: { stability: 2, growth: -3, community: -2 },
        description: '低迭代'
      }
    ],
    prototype: 'core-js 维护者危机, Babel 疲惫公告'
  },
  {
    id: 'vc-funding-winter',
    title: 'VC Funding Winter',
    category: 'Market',
    description: '宏观环境恶化，一级市场进入寒冬，估值倍数大幅压缩，融资周期延长至 18 个月。',
    immediateEffect: { cash: 0 }, // Effect is on cards
    duration: 4,
    options: [
      {
        label: '裁员 10-15%，延长跑道',
        effect: { cash: 3, community: -2, reputation: -2 },
        description: '每回合 cash +3'
      },
      {
        label: '加速商业化',
        effect: { revenue: 2 }, // Placeholder for "commercial cards +20%"
        description: '减少对融资依赖'
      },
      {
        label: '寻找战略投资人（非 VC）',
        effect: { cash: 1 }, // Placeholder for cost reduction
        description: '打出「Strategic Investor」卡时费用 -1'
      }
    ],
    prototype: '2022-2023 年科技寒冬'
  },
  {
    id: 'big-tech-competition',
    title: 'Big Tech Competition',
    category: 'Competition',
    description: 'Google/Microsoft/Amazon 发布一款与你的产品高度重叠的免费工具，并深度集成自家生态。',
    immediateEffect: { growth: -4, reputation: -1 },
    duration: 3,
    options: [
      {
        label: '聚焦细分市场，打差异化',
        effect: { community: 3, growth: -1 },
        description: '进一步收窄，但更深'
      },
      {
        label: '加速开源社区建设',
        effect: { community: 4 },
        description: '大厂通常社区运营不如独立项目'
      },
      {
        label: '主动与大厂接触',
        effect: { pressure: 1 },
        description: '可能触发「Acquisition Offer」事件'
      }
    ],
    prototype: 'Docker vs containerd, Algolia vs Elasticsearch'
  },
  {
    id: 'developer-migration-wave',
    title: 'Developer Migration Wave',
    category: 'Community',
    description: '行业内另一个老牌项目宣布停止维护，其用户开始大规模迁移。',
    immediateEffect: { community: 4, growth: 3 },
    options: [
      {
        label: '发布迁移指南，主动接收用户',
        effect: { community: 3, growth: 2, dev_speed: -1 },
        description: '支持成本增加'
      },
      {
        label: '提供一键迁移工具',
        effect: { cash: -1, growth: 4, trust: 2 },
        description: '降低迁移门槛'
      },
      {
        label: '什么都不做',
        effect: { community: 2, growth: 1 },
        description: '获得部分自然迁移'
      }
    ],
    prototype: 'CentOS -> AlmaLinux/Rocky Linux'
  },
  {
    id: 'major-conference-talk',
    title: 'Major Conference Talk',
    category: 'Media',
    description: '你们团队在 KubeCon / PyCon / JSConf 等顶级会议发表主题演讲，现场 3000 人。',
    immediateEffect: { reputation: 4, growth: 2 },
    options: [
      {
        label: '同步发布重大新功能',
        effect: { community: 3, growth: 2 },
        description: '借势发布'
      },
      {
        label: '宣布开源新模块',
        effect: { community: 4, revenue: -1 },
        description: '强化开源形象'
      },
      {
        label: '宣布企业版计划',
        effect: { revenue: 3, community: -1 },
        description: '商业化变现'
      }
    ],
    prototype: 'Solomon Hykes 在 PyCon 首次 demo Docker'
  },
  {
    id: 'licensing-controversy',
    title: 'Licensing Controversy',
    category: 'Community',
    description: '你们宣布将许可证从 MIT/Apache 更换为商业源码许可证（BSL/SSPL），社区哗然。',
    immediateEffect: { community: -4, trust: -3 },
    duration: 3,
    options: [
      {
        label: '坚持变更，解释商业理由',
        effect: { control: 3, community: -3, revenue: 2 },
        description: '进一步流失社区，但增加收入'
      },
      {
        label: '回滚许可证',
        effect: { community: 4, trust: 3, control: -4 },
        description: '放弃控制，挽回社区'
      },
      {
        label: '折中：只对新版本变更',
        effect: { community: -1, control: 2 },
        description: '旧版本维持原协议'
      }
    ],
    prototype: 'HashiCorp BSL 变更, Redis SSPL 事件'
  },
  {
    id: 'docker-boom',
    title: 'Docker Boom',
    category: 'Ecosystem',
    description: '容器化技术爆发，你们的产品恰好与 Docker/容器生态高度兼容，用户大量涌入。',
    immediateEffect: { growth: 5, community: 3 },
    duration: 2,
    options: [
      {
        label: '发布官方 Docker 镜像 + 集成文档',
        effect: { community: 2, growth: 2 },
        description: '顺势而为'
      },
      {
        label: '联合 Docker 联合营销',
        effect: { reputation: 3, cash: -1 },
        description: '借力打力'
      },
      {
        label: '乘势推出容器专属企业功能',
        effect: { revenue: 4, community: -1 },
        description: '变现流量'
      }
    ],
    prototype: '2014-2016 年容器生态大爆发'
  },
  {
    id: 'kubernetes-adoption',
    title: 'Kubernetes Adoption',
    category: 'Ecosystem',
    description: 'Kubernetes 成为行业标准，你们提前完成 K8s 集成，成为默认推荐方案。',
    immediateEffect: { growth: 4, reputation: 3 },
    duration: 2,
    options: [
      {
        label: '申请成为 CNCF 项目',
        effect: { community: 5, cash: -1 },
        description: '需 2 回合审批'
      },
      {
        label: '推出 Helm Chart / Operator',
        effect: { community: 3, growth: 2 },
        description: '降低部署门槛'
      },
      {
        label: '针对 K8s 推出专属企业版',
        effect: { revenue: 5, community: -2 },
        description: '收割 K8s 红利'
      }
    ],
    prototype: 'Prometheus, Grafana, Linkerd 的 CNCF 之路'
  },
  {
    id: 'ai-hype-cycle',
    title: 'AI Hype Cycle',
    category: 'Market',
    description: '生成式 AI 浪潮席卷全行业，投资人和用户都在问「你们的 AI 功能在哪里」。',
    immediateEffect: { pressure: 2 },
    duration: 3,
    options: [
      {
        label: '快速集成 LLM API，发布 AI 功能',
        effect: { growth: 4, stability: -2, reputation: 2 },
        description: '赶工质量差'
      },
      {
        label: '深思熟虑再推出，不跟风',
        effect: { trust: 3, growth: -1 },
        description: '短期落后，后续 AI 卡效果 +30%'
      },
      {
        label: '开源你们的 AI 模型/工具',
        effect: { community: 5, revenue: -1 },
        description: '拥抱开源 AI'
      }
    ],
    prototype: '2023 年几乎所有公司的 AI 转型压力'
  },
  {
    id: 'developer-strike',
    title: 'Developer Strike',
    category: 'Community',
    description: '核心社区开发者联合声明：在公司做出某项政策调整前，停止向项目贡献代码。',
    immediateEffect: { community: -4, dev_speed: -3 },
    options: [
      {
        label: '与开发者对话，满足诉求',
        effect: { community: 5, trust: 3 },
        description: '可能需要放弃一张已打出的商业化卡'
      },
      {
        label: '拒绝，自行推进',
        effect: { control: 2, community: -3, dev_speed: -2 },
        description: '继续恶化'
      },
      {
        label: '引入社区治理（TSC）',
        effect: { community: 3, control: -2, trust: 2 },
        description: '分享权力'
      }
    ],
    prototype: 'Python 社区 GvR 退休后的治理危机'
  },
  {
    id: 'government-regulation',
    title: 'Government Regulation',
    category: 'Regulation',
    description: '主要市场政府出台新法规，要求数据本地化或安全审查。',
    immediateEffect: { risk: 2, cash: -2 },
    options: [
      {
        label: '立即合规，获得认证',
        effect: { cash: -3, reputation: 3, trust: 2 },
        description: '长期收益'
      },
      {
        label: '观望，边做边改',
        effect: { risk: 2 },
        description: '节省当期开支，每回合 risk +2'
      },
      {
        label: '以开源透明度应对监管',
        effect: { community: 2 },
        description: '合规成本减半（仅开源项目可选）'
      }
    ],
    prototype: 'GDPR 执行, TikTok 数据本地化要求'
  },
  {
    id: 'patent-lawsuit',
    title: 'Patent Lawsuit',
    category: 'Regulation',
    description: '一家专利流氓公司或竞争对手起诉你们侵犯了 3 项软件专利，索赔 $1000 万。',
    immediateEffect: { reputation: -3, risk: 4, cash: -2 },
    duration: 3,
    options: [
      {
        label: '应诉并反诉',
        effect: { cash: -4 }, // 50% chance rep+4, 50% chance cash-6
        description: '高风险高回报'
      },
      {
        label: '庭外和解',
        effect: { cash: -5, risk: -3 },
        description: '花钱消灾'
      },
      {
        label: '加入开源专利保护组织（OIN）',
        effect: { cash: -1, risk: -2, community: 2 },
        description: '长期受益'
      }
    ],
    prototype: 'Oracle vs Google (Java 专利)'
  },
  {
    id: 'viral-blog-post',
    title: 'Viral Blog Post',
    category: 'Media',
    description: '一位知名技术博主发表了关于你们产品的深度好评文章，全网转发。',
    immediateEffect: { growth: 4, reputation: 3 },
    options: [
      {
        label: '与博主合作，持续输出内容',
        effect: { cash: -1, reputation: 2, growth: 2 },
        description: '持续 3 回合'
      },
      {
        label: '趁热打铁开启免费试用活动',
        effect: { growth: 3, revenue: -1 },
        description: '短期冲量'
      },
      {
        label: '什么都不做',
        effect: {},
        description: '效果维持，无额外收益'
      }
    ],
    prototype: 'Jeff Dean 文章带火某个开源工具'
  },
  {
    id: 'massive-outage',
    title: 'Massive Outage',
    category: 'Tech',
    description: '生产环境发生重大宕机，核心服务中断超过 6 小时，影响所有付费客户。',
    immediateEffect: { reputation: -5, revenue: -2, trust: -3 },
    duration: 2,
    options: [
      {
        label: '全面公开 Post-Mortem + 补偿',
        effect: { reputation: 3, trust: 3, cash: -2 },
        description: '诚恳道歉'
      },
      {
        label: '加急修复，最小化声明',
        effect: { reputation: -1 },
        description: '省钱但失信'
      },
      {
        label: '将事故根本原因开源',
        effect: { community: 3, reputation: 1 },
        description: '如：开源监控系统'
      }
    ],
    prototype: 'AWS us-east-1 宕机, Cloudflare 大规模中断'
  },
  {
    id: 'data-breach',
    title: 'Data Breach',
    category: 'Tech',
    description: '黑客攻破你们的数据库，200 万用户数据泄露，已在暗网售卖。',
    immediateEffect: { reputation: -6, trust: -4, risk: 5 },
    duration: 3,
    options: [
      {
        label: '72 小时内主动披露 + 通知用户',
        effect: { reputation: 2, trust: 2 },
        description: '合规减轻处罚'
      },
      {
        label: '延迟披露，先修复再公告',
        effect: { risk: 3 },
        description: '被监管发现加倍惩罚概率 +40%'
      },
      {
        label: '聘请顶级安全公司公开处理',
        effect: { cash: -4, reputation: 3, risk: -3 },
        description: '花钱买专业'
      }
    ],
    prototype: 'Uber 数据泄露事件'
  },
  {
    id: 'open-source-fork',
    title: 'Open Source Fork',
    category: 'Community',
    description: '社区核心成员正式宣布 Fork 你的项目，并获得多个知名开发者背书。',
    immediateEffect: { community: -5, control: -4 },
    options: [
      {
        label: '拥抱分叉，合并优秀贡献',
        effect: { community: 4, trust: 3 },
        description: '化敌为友'
      },
      {
        label: '通过社区投票证明正当性',
        effect: { community: 2 },
        description: '需消耗 1 回合行动'
      },
      {
        label: '法律手段阻止（商标/版权）',
        effect: { control: 3, community: -5, reputation: -3 },
        description: '公关灾难'
      }
    ],
    prototype: 'OpenOffice -> LibreOffice, io.js -> Node.js'
  },
  {
    id: 'acquisition-offer',
    title: 'Acquisition Offer',
    category: 'Market',
    description: '一家头部科技公司的 M&A 团队发来正式收购意向，估值为当前市场价的 3 倍。',
    triggerCondition: 'reputation + revenue >= 20',
    options: [
      {
        label: '接受收购',
        effect: {},
        description: '触发「并购退出」胜利检查'
      },
      {
        label: '拒绝并保持独立',
        effect: { community: 3, reputation: 2, pressure: -1 },
        description: '员工振奋'
      },
      {
        label: '借邀约谈判融资',
        effect: { cash: 3 },
        description: '用收购要约作筹码'
      }
    ],
    prototype: 'GitHub 被 Microsoft 收购'
  },
  {
    id: 'big-enterprise-contract',
    title: 'Big Enterprise Contract',
    category: 'Market',
    description: '一家 Fortune 500 公司签署 3 年期大合同，年均合同价值 $500K。',
    immediateEffect: { revenue: 8, reputation: 3, cash: 4 },
    duration: 6,
    options: [
      {
        label: '接受合同并满足定制需求',
        effect: { revenue: 8, stability: -2 },
        description: '每回合 revenue +8，但 stability -2'
      },
      {
        label: '接受合同但拒绝深度定制',
        effect: { revenue: 6, community: 1 },
        description: '保持产品纯粹性'
      },
      {
        label: '将合同案例公开（客户同意）',
        effect: { reputation: 4 },
        description: '解锁「标杆客户」状态'
      }
    ],
    prototype: '各大开源公司的第一个企业大客户'
  },
  {
    id: 'competitor-shutdown',
    title: 'Competitor Shutdown',
    category: 'Competition',
    description: '你的主要竞争对手宣布关闭产品或被收购整合，大量用户急需替代方案。',
    immediateEffect: { growth: 5, community: 3 },
    options: [
      {
        label: '紧急发布迁移工具',
        effect: { growth: 4, community: 2, dev_speed: -1 },
        description: '突击开发'
      },
      {
        label: '发布对比文章，吸引用户',
        effect: { reputation: 3, growth: 3 },
        description: '营销攻势'
      },
      {
        label: '提供限时免费优惠',
        effect: { growth: 5, revenue: -1 },
        description: '短期牺牲换用户量'
      }
    ],
    prototype: 'Parse 关闭后 Firebase 的爆发'
  },
  {
    id: 'industry-standardization',
    title: 'Industry Standardization',
    category: 'Ecosystem',
    description: '一个行业标准委员会（CNCF/OpenSSF/W3C）将你们的技术纳为官方标准基础。',
    immediateEffect: { reputation: 4, community: 3 },
    options: [
      {
        label: '主导标准制定，投入资源',
        effect: { cash: -2, community: 4, control: 2 },
        description: '定义行业规则'
      },
      {
        label: '积极参与但不主导',
        effect: { community: 2 },
        description: '无额外成本'
      },
      {
        label: '旁观等待',
        effect: {},
        description: '短期无影响，但错过标准塑造窗口'
      }
    ],
    prototype: 'Prometheus 成为 CNCF 毕业项目'
  },
  {
    id: 'foundation-formation',
    title: 'Foundation Formation',
    category: 'Ecosystem',
    description: '社区和企业成员联合建议成立独立基金会管理项目，将控制权从公司转向中立机构。',
    options: [
      {
        label: '同意成立基金会',
        effect: { community: 5, trust: 4, control: -4 },
        description: '放弃部分控制'
      },
      {
        label: '拒绝，保持公司控制',
        effect: { control: 2, community: -3, trust: -2 },
        description: '可能引发社区不满'
      },
      {
        label: '成立基金会但保留关键席位',
        effect: { community: 3, trust: 2, control: -2 },
        description: '折中方案'
      }
    ],
    prototype: 'Node.js Foundation'
  },
  {
    id: 'cloud-partnership',
    title: 'Cloud Partnership',
    category: 'Ecosystem',
    description: 'AWS/GCP/Azure 主动提出将你们的产品列入其 Marketplace，并提供联合销售支持。',
    immediateEffect: { revenue: 4, growth: 3 },
    duration: 3,
    options: [
      {
        label: '全面合作，深度集成',
        effect: { revenue: 6, control: -2, community: -1 },
        description: '平台依赖'
      },
      {
        label: '有限合作，保持独立',
        effect: { revenue: 3 },
        description: '维持自主性'
      },
      {
        label: '拒绝，担心被平台锁定',
        effect: { community: 2, control: 2 },
        description: '错过短期营收'
      }
    ],
    prototype: 'HashiCorp 与 AWS Marketplace'
  },
  {
    id: 'developer-tool-integration',
    title: 'Developer Tool Integration',
    category: 'Ecosystem',
    description: 'GitHub/VS Code/JetBrains 官方宣布内置或推荐你们的工具。',
    immediateEffect: { growth: 5, community: 3, reputation: 2 },
    options: [
      {
        label: '优化集成体验，发布专属插件',
        effect: { growth: 3, community: 2, dev_speed: -1 },
        description: '投入开发资源'
      },
      {
        label: '联合发布营销',
        effect: { reputation: 3, growth: 2 },
        description: '扩大影响力'
      },
      {
        label: '以此为筹码谈判',
        effect: { cash: 2 },
        description: '打出融资卡时额外 cash +2'
      }
    ],
    prototype: 'ESLint 被 VS Code 默认集成'
  },
  {
    id: 'global-dev-conference',
    title: 'Global Dev Conference',
    category: 'Media',
    description: '你们首次举办年度全球开发者大会，吸引 5000 名开发者参与。',
    immediateEffect: { reputation: 4, community: 4, growth: 2 },
    options: [
      {
        label: '大会上宣布重大开源里程碑',
        effect: { community: 4, trust: 3 },
        description: '强化社区连接'
      },
      {
        label: '大会上发布企业版新功能',
        effect: { revenue: 4, community: -1 },
        description: '商业化变现'
      },
      {
        label: '宣布 Open-Core 战略转型',
        effect: { community: 2, revenue: 2, trust: 2 },
        description: '平衡发展'
      }
    ],
    prototype: 'HashiConf, KubeCon'
  },
  {
    id: 'ecosystem-explosion',
    title: 'Ecosystem Explosion',
    category: 'Ecosystem',
    description: '围绕你们核心产品的第三方插件、集成、教程内容爆发式增长，形成飞轮效应。',
    immediateEffect: { community: 5, growth: 4, reputation: 3 },
    duration: 3,
    triggerCondition: 'Launch Plugin Ecosystem or Platform Strategy',
    options: [
      {
        label: '建立插件市场并抽成',
        effect: { revenue: 3, community: -1 },
        description: '部分开发者不满'
      },
      {
        label: '完全免费开放生态',
        effect: { community: 3, growth: 3 },
        description: '靠企业版间接变现'
      }
    ],
    prototype: 'VS Code 插件生态'
  },
  {
    id: 'platform-shift',
    title: 'Platform Shift',
    category: 'Market',
    description: '行业发生重大平台迁移（移动端→云端→AI 原生），你的产品面临需要大规模重构还是跟进的选择。',
    immediateEffect: { growth: -2, pressure: 2 },
    duration: 4,
    options: [
      {
        label: '全面押注新平台，重写核心',
        effect: { dev_speed: -3, stability: -2 },
        description: '短期阵痛，2 回合后 growth +6, community +3'
      },
      {
        label: '渐进式迁移，兼容新旧',
        effect: { dev_speed: -1 },
        description: '3 回合后 growth +3'
      },
      {
        label: '坚守原有路线，服务保守用户',
        effect: { revenue: 2, growth: -3 },
        description: '现有客户续费，新用户不来'
      }
    ],
    prototype: '从桌面到移动 (Adobe), 从本地到云'
  }
]
