# 真实公司原型（Company Archetypes）

公司原型是游戏开始时的预设起点，每个原型对应一家真实科技公司的经典阶段，提供差异化的初始指标、专属能力和特殊事件偏向。

玩家可以选择原型快速开局，也可以完全自定义初始值。

---

## 指标初始值说明

标准初始值（自定义起点）：

```
cash: 10   revenue: 0   community: 5   growth: 3
reputation: 5   control: 8   dev_speed: 3
stability: 5   pressure: 0   trust: 5   risk: 2
```

原型会在此基础上做加减修正。

---

## Redis Archetype

> **阶段**：2009-2019 年，从单人项目到被云厂商觊觎

**背景**：Salvatore Sanfilippo（antirez）一人创造了全球最流行的内存数据库，社区极度热爱，但免费开源的选择让商业化之路艰难，最终遭到云厂商大规模白嫖。

**初始指标修正**

| 指标 | 修正 | 原因 |
|------|------|------|
| `community` | +5 | 开发者极度热爱 |
| `growth` | +4 | 技术口碑强劲 |
| `revenue` | +2 | 早期商业化薄弱 |
| `control` | -2 | 开放源码，控制力弱 |
| `stability` | +3 | 极简架构，极度稳定 |

**专属能力**：「antirez 效应」— 每当打出开源类策略卡，`trust` 额外 +1（创始人个人魅力加成）

**专属起始手牌**：Open Core × 1，Fully Open Source × 1，Security Audit × 1

**特殊事件偏向**：「Cloud Vendor Fork」事件出现概率 ×2（这就是 Redis 的宿命）

**推荐胜利路线**：Open-Core（挑战：如何在被云厂商白嫖的同时建立商业护城河）

---

## MongoDB Archetype

> **阶段**：2013-2017 年，从开源新星到企业级 NoSQL 领导者

**背景**：MongoDB 是 Open-Core 模式的经典案例，用免费版积累海量社区，用企业版和 Atlas 云服务变现。许可证从 AGPL 到 SSPL 的变更是标志性历史节点。

**初始指标修正**

| 指标 | 修正 | 原因 |
|------|------|------|
| `growth` | +5 | JSON 文档模型天然增长 |
| `revenue` | +4 | 企业版销售成熟 |
| `community` | +2 | 社区认可但不如 Redis 极致 |
| `pressure` | +2 | 投资人期望高 |
| `reputation` | +2 | 品牌知名度高 |

**专属能力**：「Open-Core 飞轮」— 打出「Enterprise Edition」卡时不损失 `community`（已建立良好品牌信任）

**专属起始手牌**：Open Core × 1，Enterprise Edition × 1，Series A × 1

**特殊事件偏向**：「Licensing Controversy」事件出现概率 +1 张（额外放入牌堆）

**推荐胜利路线**：IPO 模式（MongoDB 2017 年成功上市）

---

## Elastic Archetype

> **阶段**：2014-2021 年，从 Elasticsearch 到 Elastic Cloud

**背景**：Elastic 拥有强大的搜索与可观测性生态（Elastic Stack：Elasticsearch + Kibana + Logstash + Beats），以开源起家，与 AWS OpenSearch 的争斗是经典的云厂商竞争案例。

**初始指标修正**

| 指标 | 修正 | 原因 |
|------|------|------|
| `community` | +4 | 强大的开源生态 |
| `growth` | +4 | 多产品线协同 |
| `revenue` | +3 | 企业订阅成熟 |
| `stability` | +2 | 成熟产品 |
| `risk` | +1 | 云厂商竞争风险 |

**专属能力**：「Stack 协同」— 同一回合内打出 2 张不同类型的策略卡，其中较小效果的那张额外 +2（多产品线协同效应）

**专属起始手牌**：Open Core × 1，Hosted SaaS × 1，Developer Evangelism × 1

**特殊事件偏向**：「Cloud Vendor Fork」（AWS OpenSearch 事件）出现概率 ×1.5

**推荐胜利路线**：Open-Core 或 IPO 模式

---

## HashiCorp Archetype

> **阶段**：2015-2023 年，从 DevOps 工具集到 BSL 许可证争议

**背景**：HashiCorp 是 DevOps 工具链的王者（Terraform、Vault、Consul、Nomad），极受开发者喜爱。2023 年将 Terraform 许可证从 MPL 改为 BSL，引发巨大争议，并催生了 OpenTofu 分叉。

**初始指标修正**

| 指标 | 修正 | 原因 |
|------|------|------|
| `community` | +5 | DevOps 社区极度热爱 |
| `growth` | +4 | 企业采用率高 |
| `reputation` | +3 | 工具质量公认优秀 |
| `control` | +2 | 多工具形成生态锁定 |
| `dev_speed` | +2 | 工程文化强 |

**专属能力**：「工具链锁定」— 若已有 2 张「企业版」或「合作伙伴」类卡生效，任意新增一张商业化卡效果 +25%

**专属起始手牌**：Enterprise Edition × 1，Partner Program × 1，Dual License × 1

**特殊事件偏向**：「Licensing Controversy」必然在第 8-12 回合之间出现（历史宿命）

**推荐胜利路线**：IPO 或并购退出（HashiCorp 2023 年被 IBM 收购）

---

## GitLab Archetype

> **阶段**：2016-2021 年，完全开源的 DevOps 平台

**背景**：GitLab 是罕见的「完全开放核心」公司——CE（社区版）和 EE（企业版）代码都公开，靠透明度建立极强信任。与 GitHub 的竞争和最终 IPO 是其核心叙事。

**初始指标修正**

| 指标 | 修正 | 原因 |
|------|------|------|
| `community` | +4 | 开放透明，社区高度认同 |
| `trust` | +4 | 完全公开代码建立极强信任 |
| `revenue` | +3 | 企业版订阅稳健 |
| `growth` | +3 | 一体化 DevOps 吸引力强 |
| `control` | -1 | 完全开放代码减少控制筹码 |

**专属能力**：「全透明文化」— 「Public Roadmap」和「Open Governance」卡效果翻倍；每打出一张开源类卡，额外 `trust +1`

**专属起始手牌**：Open Governance × 1，Enterprise Support × 1，Series B × 1

**特殊事件偏向**：「Big Tech Competition」（GitHub vs GitLab）在第 5 回合必然触发

**推荐胜利路线**：IPO 模式（GitLab 2021 年 Nasdaq 上市）

---

## Red Hat Archetype

> **阶段**：2005-2019 年，企业开源的终极形态

**背景**：Red Hat 证明了纯企业开源模式的可行性——不靠卖软件，靠卖订阅和支持服务。2019 年以 $340 亿被 IBM 收购，是开源史上最大并购案。

**初始指标修正**

| 指标 | 修正 | 原因 |
|------|------|------|
| `revenue` | +6 | 订阅模式成熟 |
| `reputation` | +5 | 企业级信任极强 |
| `stability` | +4 | 企业级产品稳定性要求 |
| `community` | +3 | 上游优先文化 |
| `growth` | -1 | 企业市场增速慢但稳 |
| `pressure` | +1 | 华尔街期待 |

**专属能力**：「上游优先」（Upstream First）— 每打出一张「Accept Community PRs」或「Open Governance」卡，额外获得 `revenue +1`（企业客户为开源参与付费）

**专属起始手牌**：Enterprise Support × 2，Consulting Services × 1，Series B × 1

**特殊事件偏向**：「Big Enterprise Contract」事件出现概率 ×2

**推荐胜利路线**：并购退出（历史最高价的开源并购）

---

## Docker Archetype

> **阶段**：2013-2017 年，从爆红到商业化困境

**背景**：Docker 是技术史上增长最快的开源项目之一，但在商业化上步履蹒跚。容器生态的标准制定权被 Kubernetes 和 CNCF 拿走，最终公司被分拆出售。

**初始指标修正**

| 指标 | 修正 | 原因 |
|------|------|------|
| `community` | +6 | 历史级别的社区爆发 |
| `growth` | +6 | 病毒式增长 |
| `revenue` | -2 | 商业化严重滞后 |
| `pressure` | +3 | 投资人急于看到变现 |
| `control` | -2 | 生态标准制定权旁落 |

**专属能力**：「病毒式增长」— 「Hacker News Launch」和「Product Hunt Launch」卡效果 ×2；但每回合若 `revenue < 5`，`pressure +1`

**专属起始手牌**：Free Tier × 1，Hacker News Launch × 1，Series A × 1

**特殊事件偏向**：「Industry Standardization」（Kubernetes 夺走标准主导权）必然在第 6-10 回合出现

**推荐胜利路线**：并购退出（挑战：在商业化失败前找到买家）

---

## Kubernetes / CNCF Archetype

> **阶段**：2015-2020 年，从 Google 内部项目到行业标准

**背景**：Kubernetes 的特殊之处在于：它从一开始就由一个中立基金会（CNCF）治理，没有单一商业主体，但围绕它诞生了数十亿美元的商业生态。

**初始指标修正**

| 指标 | 修正 | 原因 |
|------|------|------|
| `community` | +7 | 史上最活跃的开源社区之一 |
| `trust` | +5 | 中立基金会治理，极强信任 |
| `control` | -4 | 中立治理意味着无单一控制方 |
| `revenue` | 0 | 基金会本身不直接产生营收 |
| `reputation` | +5 | 行业标准地位 |

**专属能力**：「基金会治理」— `control` 永远不能低于 -4；打出「Foundation Formation」或「Open Governance」后，`community` 和 `trust` 效果加倍

**专属起始手牌**：Open Governance × 1，Foundation Donation × 1，Platform Strategy × 1

**特殊事件偏向**：「Ecosystem Explosion」在游戏开始时直接加入牌堆顶（必然早期触发）

**推荐胜利路线**：传奇开源（`community ≥ 30`，`growth ≥ 20`）

---

## Dify / Langgenius Archetype

> **阶段**：2023-2026 年，从开源 LLM 应用平台到 AI 时代的操作系统

**背景**：Dify 是当下最热门的开源 AI 应用开发平台（130K+ GitHub Stars，Top 60 全球全时开源项目），在 AI 浪潮最高峰切入。1.4M+ 台机器部署、175 个国家的开发者、280+ 企业客户（Maersk、Novartis、Anker）。Pre-A 轮融资 $30M，估值 $1.8 亿。

核心张力极度鲜明：开源社区爆炸式增长，但 AI 推理成本极高；云厂商随时可能推出同类托管服务；社区期望免费，企业客户愿意付费——这就是 **Fork or Profit** 游戏的原型写照。

**初始指标修正**

| 指标 | 修正 | 原因 |
|------|------|------|
| `community` | +6 | 130K Stars，AI 热度加持，社区爆炸 |
| `growth` | +5 | 全球 175 国部署，病毒式传播 |
| `reputation` | +4 | 顶级开源项目品牌，媒体高曝光 |
| `dev_speed` | +3 | AI-Native 文化，60%+ 代码由 LLM 生成 |
| `cash` | +3 | $30M Pre-A 融资在手 |
| `trust` | +3 | 1.4M 台生产部署证明可靠性 |
| `pressure` | +2 | VC 支持，投资人期待高速增长 |
| `risk` | +2 | AI 赛道竞争极激烈，云厂商随时入场 |

**专属能力**

- **AI-Native 速度**：「Hire Engineers」和「Improve CI/CD」策略卡的 `dev_speed` 效果 ×2（AI 辅助编程加速迭代）
- **Fast-Track Policy**：每 3 回合可执行一次「快速通道」——无需消耗行动点打出 1 张额外策略卡，需 CEO 角色宣布启动（48 小时决策文化）
- **插件生态飞轮**：一旦打出「Launch Plugin Ecosystem」，每回合额外获得 `community +1`、`growth +1`（Dify 的插件市场已成增长引擎）

**专属起始手牌**：Open Core × 1，Launch Plugin Ecosystem × 1，Series A × 1

**特殊事件偏向**
- 「AI Hype Cycle」在第 1-3 回合必然触发（在最高潮入场，双面效应）
- 「Cloud Vendor Fork」出现概率 ×1.5（托管 AI 服务是云厂商的必争之地）
- 「Ecosystem Explosion」在满足 `community ≥ 15` 后自动加入牌堆（插件市场飞轮）

**推荐胜利路线**：Open-Core 或 IPO 模式

**设计注记**：Dify 是这款游戏最接近「教科书案例」的原型——它真实地活在开源与商业化的永恒张力之中。选择 Dify 原型即是在模拟当下正在发生的历史。

---

## 原型对比总览

| 原型 | 核心优势 | 核心挑战 | 推荐路线 | 难度 |
|------|---------|---------|---------|------|
| Redis | 极强社区信任 | 云厂商白嫖 | Open-Core | ★★★☆ |
| MongoDB | 商业化成熟 | 许可证争议 | IPO | ★★☆☆ |
| Elastic | 多产品协同 | 云竞争 | Open-Core / IPO | ★★★☆ |
| HashiCorp | 工具链锁定 | 必触许可证危机 | 并购退出 | ★★★★ |
| GitLab | 极强信任文化 | 直面 GitHub | IPO | ★★★☆ |
| Red Hat | 营收最稳健 | 增长慢 | 并购退出 | ★★☆☆ |
| Docker | 增长最爆炸 | 商业化最难 | 并购退出 | ★★★★★ |
| Kubernetes | 社区无敌 | 无法直接变现 | 传奇开源 | ★★★★ |
| **Dify** | **AI + 开源双爆发** | **云竞争 + 推理成本** | **Open-Core / IPO** | **★★★★** |

---

## 自定义起点

不想用原型？可以完全自定义：

1. 从标准初始值开始
2. 在以下三个维度各分配 8 点加成（每项不超过 +4）：
   - 社区维度：`community`、`trust`、`growth`
   - 商业维度：`revenue`、`control`、`reputation`
   - 运营维度：`dev_speed`、`stability`、`cash`
3. 选择 3 张起始手牌（从对应倾向的卡类中各选 1 张）
