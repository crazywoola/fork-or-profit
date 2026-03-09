# 天赋进阶系统（Talent Progression System）

## 概述

游戏内部维护三个阶段（`seed → growth → scale`）。当回合数越过阶段分界线（第 6 回合进入 `growth`，第 13 回合进入 `scale`）时，系统会在该回合开始时**插入一个专属进阶事件**，玩家从两个天赋选项中选一个，永久解锁。

```
回合开始
  │
  ├── getPendingStageMilestone() → 首次进入 growth 或 scale?
  │     └── YES → buildProgressionEvent(stage) → 插入进阶事件，玩家选择天赋
  │     └── NO  → 正常抽取事件牌
  │
  └── 已选天赋每回合 applyTalentRoundStartEffects() 生效
```

每局最多触发 2 次进阶事件（进入 growth 1 次、进入 scale 1 次），最多解锁 2 个天赋。

---

## 天赋属性说明

| 属性 | 类型 | 说明 |
|------|------|------|
| `immediateEffect` | StatEffect | 选择该天赋时立即执行的 stat 变更 |
| `categoryBoosts` | Partial\<Record\<CardCategory, number\>\> | 对应类别卡牌的效果乘数加成（叠加在房间/组织之上） |
| `roundStartEffect` | StatEffect | 每 N 回合开始时自动应用一次 stat 变更 |
| `roundEvery` | number | 与 `roundStartEffect` 配合，每隔几回合触发 |
| `burnRateDelta` | number | 立即永久改变 burn rate |
| `eventWeights` | Partial\<Record\<string, number\>\> | 修改特定事件的抽取权重 |
| `factionShift` | Partial\<Record\<FactionId, number\>\> | 立即调整指定派系声誉 |
| `roomFocus` | string | 天赋的首选房间；进驻该房间时额外 +5% 类别加成 |
| `profitableCashBonus` | number | 每个净收入 > 0 的回合结算后额外获得 cash |
| `extraActionPointEvery` | number | 每隔 N 回合，本回合行动点 +1 |
| `synergyBoost` | StatEffect | 触发卡牌连击时额外叠加到连击奖励 |
| `techShield` | number | 降低 Tech 类事件的负面效果（0.0–1.0，如 0.3 = 减伤 30%） |

---

## 天赋轨道（Talent Tracks）

每个角色原型（archetype）对应一条轨道，每条轨道有 `growth` 和 `scale` 两组选项，每组 2 个天赋二选一。

原型与轨道映射：

| 角色原型 | 天赋轨道 |
|----------|----------|
| executive | executive |
| engineering | engineering |
| product | product |
| growth | growth |
| revenue | revenue |
| community | community |
| finance | finance |
| risk | risk |
| people | people |
| support | support |
| operations | operations |
| data | engineering（共用） |
| design | growth（共用） |

---

## 各轨道天赋列表

### Executive 轨道

**Growth 阶段（二选一）**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `executive-capital-discipline` | Capital Discipline | cash +3，burn -1，investors +1 |
| `executive-boardroom-offensive` | Boardroom Offensive | Finance +15% / Ops +10%，reputation +1 |

**Scale 阶段（二选一）**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `executive-vision-brand` | Vision As Weapon | 每 2 回合 reputation +1 / trust +1，community +1 |
| `executive-dealmaker-network` | Dealmaker Network | Monetization +10% / Finance +10%，企业合同事件权重↑ |

---

### Engineering 轨道

**Growth 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `engineering-architecture-guild` | Architecture Guild | Operations +15% / OSS +10%，每 3 回合 stability +1 |
| `engineering-maintainer-culture` | Maintainer Culture | OSS +15%，每 2 回合 community +1 |

**Scale 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `engineering-release-train` | Release Train | 每 2 回合 dev_speed +1 |
| `engineering-platform-moat` | Platform Moat | Growth +10% / OSS +10%，生态事件权重↑，roomFocus: platform |

---

### Product 轨道

**Growth 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `product-roadmap-discipline` | Roadmap Discipline | Growth +10% / Monetization +10%，control +1，reputation +1 |
| `product-discovery-loop` | Discovery Loop | 每 3 回合 growth +1 / trust +1，迁移波事件权重↑ |

**Scale 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `product-platform-expansion` | Platform Expansion | Growth +10% / OSS +10%，roomFocus: product，生态事件权重↑ |
| `product-ux-compounding` | UX Compounding | 盈利回合额外 community +1，Growth +10%，enterprise +1 |

---

### Growth 轨道

**Growth 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `growth-media-engine` | Media Engine | Growth +15%，媒体相关事件权重大幅提升 |
| `growth-funnel-optimizer` | Funnel Optimizer | Growth +10% / Monetization +10%，revenue +1 |

**Scale 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `growth-brand-dominance` | Brand Dominance | 每 2 回合 reputation +1 |
| `growth-viral-flywheel` | Viral Flywheel | 每 4 回合 +1 行动点，竞争对手关停事件权重↑ |

---

### Revenue 轨道

**Growth 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `revenue-deal-desk` | Deal Desk | Monetization +15% / Finance +10%，trust +1 |
| `revenue-customer-voice` | Voice Of Customer | Monetization +10% / Growth +5%，每 3 回合 trust +1 |

**Scale 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `revenue-land-expand` | Land And Expand | 盈利回合 cash +2，企业大合同事件权重↑ |
| `revenue-channel-empire` | Channel Empire | Monetization +10% / Growth +10%，enterprise +2 |

---

### Community 轨道

**Growth 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `community-ambassador-network` | Ambassador Network | 每 2 回合 community +1 / trust +1 |
| `community-governance-council` | Governance Council | OSS +15%，trust +2 / control -1，community +2 / ecosystem +1 |

**Scale 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `community-foundation-arc` | Foundation Arc | 基金会/标准化事件权重大幅提升，roomFocus: community |
| `community-fork-healer` | Fork Healer | techShield 20%，OSS +10% / Growth +10% |

---

### Finance 轨道

**Growth 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `finance-war-chest` | War Chest | cash +4，burn -1 |
| `finance-precision-funding` | Precision Funding | Finance +15% / Monetization +5%，investors +2 |

**Scale 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `finance-risk-hedge` | Risk Hedge | 每 2 回合 risk -1 |
| `finance-capital-machine` | Capital Machine | 盈利回合 cash +2，Finance +10% |

---

### Risk 轨道

**Growth 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `risk-compliance-shield` | Compliance Shield | 每 3 回合 risk -1，监管和专利事件权重↓，regulators +2 |
| `risk-litigation-playbook` | Litigation Playbook | Operations +10% / Finance +10%，stability +1，reputation +1 |

**Scale 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `risk-zero-trust` | Zero Trust Program | techShield 30%，Operations +10% |
| `risk-public-trust` | Public Trust Protocol | 每 3 回合 trust +1 / reputation +1 |

---

### People 轨道

**Growth 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `people-talent-ladder` | Talent Ladder | 每 4 回合 +1 行动点，每 3 回合 stability +1 |
| `people-culture-covenant` | Culture Covenant | 每 3 回合 trust +1 / community +1 |

**Scale 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `people-performance-loop` | Performance Loop | Operations +10% / Growth +10%，roomFocus: hq |
| `people-founder-morale` | Founder Morale | 每 4 回合 pressure -1 |

---

### Support 轨道

**Growth 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `support-incident-drill` | Incident Drill | techShield 25%，Operations +10% |
| `support-voice-of-customer` | Voice Of Customer | 每 2 回合 trust +1，enterprise +1 |

**Scale 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `support-service-flywheel` | Service Flywheel | Monetization +10% / Operations +10%，盈利回合 cash +1 |
| `support-knowledge-network` | Knowledge Network | 每 3 回合 community +1，开发者迁移事件权重↑ |

---

### Operations 轨道

**Growth 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `operations-process-forge` | Process Forge | Operations +15%，stability +1 / control +1 |
| `operations-resilience-loop` | Resilience Loop | 每 2 回合 stability +1，盈利回合 cash +1 |

**Scale 阶段**

| 天赋 ID | 名称 | 效果概要 |
|---------|------|----------|
| `operations-squad-rhythm` | Squad Rhythm | 每 4 回合 +1 行动点，Growth +5% / Operations +10% |
| `operations-delivery-aura` | Delivery Aura | Operations +10% / Finance +5%，roomFocus: eng |

---

## 进阶事件机制细节

1. `getPendingStageMilestone()` 检查当前 stage 是否已记录在 `stageMilestones` 中。
2. 若未记录，则将其加入 `stageMilestones`，并返回该 stage，触发进阶事件。
3. 进阶事件 ID 格式：`progression-{stage}-{roleId}`，属于 `prototype: 'progression'`。
4. 玩家选择后，`applyProgressionChoice()` 立即执行：
   - 将 talentId 加入 `progressionSelections`
   - 应用 `immediateEffect`
   - 应用 `burnRateDelta`（若有）
   - 应用 `factionShift`（若有）
   - 设置世界标记 `talent:{talentId}`
5. 进阶事件不消耗行动点，选择后直接进入 `planning` 阶段。
