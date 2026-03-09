# Room Bonus System

## 概述

每回合**事件阶段**结束后进入 `planning` 阶段，玩家选择本回合要进驻的**房间（Room）**。房间选择立即触发即时效果和阵营偏移，并为本回合所有策略卡打出提供类别加成；部分房间还会影响下一轮事件的权重分布。

```
planning 阶段
  │
  └── 选择一个 Room → immediateEffect + factionShift + categoryBoosts 激活
                     → nextEventWeights 在本回合结束前持续生效
                     → 进入 action 阶段
```

## 8 个房间

### HQ — War Room（总部作战室）

| 属性 | 内容 |
|------|------|
| `immediateEffect` | reputation +1 |
| `categoryBoosts` | 所有类别 +5%（Open Source / Monetization / Growth / Operations / Finance） |
| `nextEventWeights` | major-conference-talk ×1.2，acquisition-offer ×1.15 |
| `factionShift` | investors +1 |

适合：无明确专攻路线、希望保持全面弹性的回合。

---

### Eng — Architecture Workshop（工程架构室）

| 属性 | 内容 |
|------|------|
| `immediateEffect` | stability +1 |
| `categoryBoosts` | Open Source +15%，Operations +20% |
| `nextEventWeights` | major-security-vulnerability ×0.7，massive-outage ×0.75，kubernetes-adoption ×1.2 |
| `factionShift` | ecosystem +1 |

适合：专注技术债、基础设施建设或开源贡献的回合。

---

### Product — Product Strategy Table（产品战略桌）

| 属性 | 内容 |
|------|------|
| `immediateEffect` | growth +1 |
| `categoryBoosts` | Growth +15%，Monetization +10% |
| `nextEventWeights` | developer-tool-integration ×1.2，platform-shift ×1.2，big-tech-competition ×1.15 |
| `factionShift` | enterprise +1 |

适合：推进产品化路线、打通平台和商业化的回合。

---

### Growth — Launch Control（增长指挥室）

| 属性 | 内容 |
|------|------|
| `immediateEffect` | reputation +1，growth +1 |
| `categoryBoosts` | Growth +20% |
| `nextEventWeights` | viral-blog-post ×1.4，hacker-news-front-page ×1.3，global-dev-conference ×1.15 |
| `factionShift` | enterprise +1，community +1 |

适合：全力冲增长、押注媒体曝光的回合。

---

### Revenue — Deal Desk（营收谈判桌）

| 属性 | 内容 |
|------|------|
| `immediateEffect` | revenue +1 |
| `categoryBoosts` | Monetization +20%，Finance +10% |
| `nextEventWeights` | big-enterprise-contract ×1.4，cloud-partnership ×1.2，acquisition-offer ×1.15 |
| `factionShift` | investors +1，enterprise +2 |

适合：BD 冲单、拉企业客户、推进营收路线的关键回合。

---

### Community — Contributor Commons（贡献者社区）

| 属性 | 内容 |
|------|------|
| `immediateEffect` | community +1，trust +1 |
| `categoryBoosts` | Open Source +20%，Growth +5% |
| `nextEventWeights` | github-stars-explosion ×1.25，developer-migration-wave ×1.2，open-source-fork ×1.1 |
| `factionShift` | community +2，ecosystem +1 |

适合：强化开源社区、维护社区信任的回合。

---

### Finance — Treasury Office（财务金库）

| 属性 | 内容 |
|------|------|
| `immediateEffect` | cash +2 |
| `categoryBoosts` | Finance +20%，Operations +10% |
| `nextEventWeights` | vc-funding-winter ×0.75，government-regulation ×1.15，acquisition-offer ×1.1 |
| `factionShift` | investors +2，regulators +1 |

适合：现金紧张、需要融资或财务优化的回合。

---

### Platform — Ecosystem Lab（生态实验室）

| 属性 | 内容 |
|------|------|
| `immediateEffect` | dev_speed +1，growth +1 |
| `categoryBoosts` | Open Source +10%，Growth +10%，Operations +10% |
| `nextEventWeights` | ecosystem-explosion ×1.6，industry-standardization ×1.25，developer-tool-integration ×1.25 |
| `synergyBoost` | growth +1，community +1（卡牌连击时额外叠加） |
| `factionShift` | ecosystem +2 |

适合：SDK / 插件生态路线、或需要触发生态爆炸事件的回合。

---

## 房间衍生加成（Room Derived Bonus）

进驻特定房间后，打出匹配类别的卡会在即时效果之外额外获得一次 stat 加成：

| 房间 | 卡牌类别 | 额外加成 |
|------|----------|----------|
| community | Open Source | trust +1 |
| product | Growth | control +1 |
| revenue | Monetization | reputation +1 |
| platform | sdk-release 或 platform-strategy | growth +1，community +1 |
| finance | Finance | cash +1 |

## 与其他系统的叠加规则

房间加成（`categoryBoosts`）会与以下来源**叠加**：

- 组织架构倍率（`Organization.cardCategoryMultipliers`）
- 激活效果中的 `next_card_boost`
- 天赋进阶的 `categoryBoosts`
- 公司原型（Template）专属被动

最终效果乘数 = `baseMultiplier + roomBonus + orgBonus + talentBonus + activeBuffBonus`

## 与事件权重的关系

房间的 `nextEventWeights` 与以下来源**叠加**：
- 公司原型的 `TEMPLATE_EVENT_BIASES`
- 天赋的 `eventWeights`
- 世界标记（worldFlags）引发的权重修正
