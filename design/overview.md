# Fork or Profit — 游戏设计总览

## 游戏概念

**Fork or Profit** 是一款以科技公司战略决策为核心的策略卡牌游戏。玩家扮演公司内外的关键角色，在有限回合内通过打出策略卡、响应外部事件、与其他角色博弈，最终引导公司走向"开源社区路线"或"商业变现路线"——或者找到两者之间的平衡点。

## 核心张力

```
开源 → community ↑  growth ↑   revenue ↓  control ↓
商业 → revenue ↑   control ↑  community ↓

没有收入 → 公司死亡（cash ≤ 0）
没有社区 → 项目死亡（community ≤ 0）
```

## 核心指标（Stats）

所有策略卡和事件卡通过以下数值指标影响游戏状态：

| 指标 | 说明 | 初始值 | 致死线 |
|------|------|--------|--------|
| `cash` | 现金储备，公司生死线 | 10 | ≤ 0 则游戏结束 |
| `revenue` | 月度营收，每回合为 cash 充值 | 0 | — |
| `community` | 开源社区影响力 | 5 | ≤ 0 则开源路线崩溃 |
| `growth` | 用户/采用率增长势头 | 3 | — |
| `reputation` | 品牌声誉，影响融资与客户信任 | 5 | — |
| `control` | 对产品方向和授权的控制力 | 8 | — |
| `dev_speed` | 开发迭代速度 | 3 | — |
| `stability` | 产品稳定性（技术债反指标） | 5 | — |
| `pressure` | 来自投资人/董事会的压力 | 0 | ≥ 10 则触发强制改组 |
| `trust` | 用户与社区的信任度 | 5 | — |
| `risk` | 当前风险暴露 | 2 | ≥ 10 则触发危机事件 |

> **每回合结算**：`cash += revenue - burn_rate`，`burn_rate` 由公司规模和组织架构决定。

## 游戏目标

每局游戏选择一个胜利条件：

| 模式 | 胜利条件 |
|------|---------|
| 生存模式 | 12 回合内保持 `cash > 0` 且 `community > 0` |
| IPO 模式 | 20 回合内 `revenue ≥ 30` 且 `reputation ≥ 15` 且 `pressure < 8` |
| 传奇开源 | 20 回合内 `community ≥ 30` 且 `growth ≥ 20` |
| 并购退出 | 触发「Acquisition Offer」事件且 `reputation + revenue ≥ 25` |
| Open-Core | 20 回合内 `community ≥ 15` 且 `revenue ≥ 15` 同时达成 |

## 游戏流程

```
游戏开始
  │
  ├── 1. 选择公司原型（Company Archetype）或自定义
  ├── 2. 选择行业 & 领域
  ├── 3. 选择组织架构
  ├── 4. 各玩家选择角色
  │
  └── 进入回合循环（最多 20 回合）
        │
        ├── 阶段 1: event    （翻开事件卡，选择响应方式）
        ├── 阶段 2: planning （选择本回合 Room Bonus 房间加成）
        ├── 阶段 3: action   （各角色打出策略卡，消耗行动点）
        ├── 阶段 4: resolution（cash += revenue - burn_rate，触发连锁效果）
        └── 阶段 5: summary  （回合总结，检查胜负，推进到下一回合）
```

### burn_rate 机制

每回合结算时：`cash += revenue - burn_rate`

- `burn_rate` 初始由公司规模和组织架构决定
- 打出「Automate Operations」或「Cloud Cost Optimization」卡可**永久**降低 `burn_rate`
- 某些事件选项或角色能力也会临时或永久调整 `burn_rate`

### 游戏阶段（GameStage）

游戏内部维护三个阶段，随回合推进和里程碑自动转换：

| 阶段 | 说明 |
|------|------|
| `seed` | 种子期——早期事件权重更高，融资卡可用性强 |
| `growth` | 成长期——中期事件解锁，更多商业化选项开放 |
| `scale` | 规模期——晚期事件出现（如 Acquisition Offer、Data Breach），决战阶段 |

### 派系声誉（Faction Reputation）

游戏内有 5 个派系，各有独立声誉值（0-10，初始均为 5）：

| 派系 ID | 名称 | 影响 |
|---------|------|------|
| `community` | 开源社区 | 事件选项解锁、trust 联动 |
| `investors` | 投资人 | pressure 联动、融资卡条件 |
| `enterprise` | 企业客户 | revenue 联动、合同事件权重 |
| `regulators` | 监管机构 | risk 联动、合规事件触发 |
| `ecosystem` | 生态伙伴 | growth 联动、生态类事件权重 |

部分事件选项的 `factionEffects` 字段会直接调整对应派系声誉。

### 持续效果系统（Active Effects）

策略卡打出后可产生**持续效果**（buff/debuff），而非仅有即时效果：

| 效果类型 | 说明 |
|----------|------|
| `stat_per_round` | 每回合开始时应用一次指标变化（如 Contributor Program 每回合 `community +1`） |
| `next_card_boost` | 下一张特定类别卡的效果加成（消耗即失效） |
| `event_trigger` | 倒计时结束后触发指定事件（如 Launch Plugin Ecosystem 触发 Ecosystem Explosion） |
| `burn_rate_delta` | 打出卡时立即永久改变 burn rate |

### 威胁预警系统（Pending Threats）

游戏在每次状态变化后调用 `refreshThreats()` 刷新当前威胁列表（最多 5 条），展示在 UI 中供玩家实时感知风险：

| 触发条件 | 威胁提示 |
|----------|----------|
| cash ≤ 4 | Cash collapse risk |
| community ≤ 3 | Community fracture risk |
| risk ≥ 7 | Risk exposure critical |
| pressure ≥ 7 | Investor pressure nearing failure |
| 有 `event_trigger` 类型的持续效果 | `{效果描述} in {N}r`（倒计时）|
| worldFlag: `license_hardened` 且 licensing-controversy 未触发 | Licensing controversy is brewing |
| worldFlag: `ecosystem_ready` 且 ecosystem-explosion 未触发 | Ecosystem payoff is approaching |
| worldFlag: `foundation_path` 且 foundation-formation 未触发 | Governance crossroads ahead |

---

### 世界标记系统（World Flags）

打出特定策略卡或响应特定事件选项会设置**世界标记**（boolean 标志位），影响后续事件的可用性和权重：

| 标记 | 触发来源 | 影响 |
|------|----------|------|
| `ecosystem_ready` | Launch Plugin Ecosystem，Platform Strategy | ecosystem-explosion 事件可用 |
| `platform_route` | Platform Strategy | 同上 |
| `foundation_path` | Foundation Donation | foundation-formation 事件可用 |
| `open_core_route` | Open Core | — |
| `cloud_surface` | Hosted SaaS | cloud-vendor-fork 权重 ×1.5 |
| `license_hardened` | Dual License，cloud-vendor-fork option 0 | licensing-controversy 权重 ×1.6 |
| `funded_seed` | Seed Round | — |
| `funded_series_a` | Series A | — |
| `funded_series_b` | Series B | — |
| `ipo_ready` | IPO | — |
| `strategic_backer` | Strategic Investor | — |
| `benchmark_customer` | big-enterprise-contract option 0/2 | big-enterprise-contract 权重 ×1.35 |
| `media_tailwind` | viral-blog-post option 0 | viral-blog-post / major-conference-talk 权重 ×1.2 |
| `community_moat` | cloud-vendor-fork option 2 | — |
| `maintainer_supported` | open-source-maintainer-burnout option 0 | — |
| `talent:{talentId}` | 选择任意天赋进阶 | 天赋已激活标记 |

部分卡牌打出后还会**预约**一个未来事件（`scheduleEvent`）：

| 卡牌 | 预约事件 | 延迟回合数 |
|------|----------|------------|
| Foundation Donation | foundation-formation | 3 |
| Hosted SaaS | cloud-vendor-fork | 3 |
| Dual License | licensing-controversy | 2 |
| Platform Strategy | ecosystem-explosion | 3 |

---

### 公司原型被动（Template Passives）

每个公司原型在打出策略卡时触发专属被动逻辑：

| 原型 | 触发条件 | 效果 |
|------|----------|------|
| Redis | 打出任意 Open Source 卡 | trust +1 |
| MongoDB | 打出 Enterprise Edition（community 本为负值时） | community 损失归零 |
| GitLab | 打出 Open Governance 或 Public Roadmap | 卡牌效果翻倍 |
| Red Hat | 打出任意 Open Source 卡 | revenue +1 |
| Kubernetes | 打出 Open Governance | community 和 trust 效果翻倍 |
| Elastic | 本回合已打过至少 1 张卡时再打任意卡 | community +1 |
| HashiCorp | 打出满足条件的 Monetization 卡 | 卡牌效果 +25% |
| Dify | 每 3 回合（round % 3 == 0，round > 1） | 额外 +1 行动点 |

Docker 原型对所有 Growth 类卡牌有 ×2 基础乘数（在 `getMultiplierInfo` 中硬编码）。

---

### 角色被动系统（Role Passives）

每回合开始时 `applyRolePassives()` 按角色**原型**和**具体角色 ID** 两层分别触发：

**按原型（Archetype）**

| 原型 | 触发条件 | 效果 |
|------|----------|------|
| community | round % 3 == 0 | community +1 |
| risk | risk ≥ 7 | risk -1 |
| people | round % 4 == 0 | stability +1 |
| engineering | round % 3 == 0 | dev_speed +1 |
| support | round % 3 == 0 | trust +1 |
| growth | round % 4 == 0 | growth +1 |

**按角色 ID（Role-specific）**

| 角色 ID | 触发条件 | 效果 |
|---------|----------|------|
| staff-engineer | round % 2 == 0 | stability +1 |
| oss | round % 2 == 0 | community +1，trust +1 |
| sre | round % 3 == 0 | stability +1，risk -1 |
| security | risk ≥ 5 | risk -1 |
| privacy | round % 3 == 0 | trust +1，risk -1 |
| cfo | round % 4 == 0 且 cash < 10 | cash +1 |
| people | round % 3 == 0 | morale +1 |

此外，选择「Open Foundation Model」组织架构时，每回合自动 `community +1`（在角色被动流程末尾执行）。

---

### 团队士气系统（Morale）

`morale` 是 0–10 量程的负向缓冲指标，初始值 7：

- 当 `pressure ≥ 8` 时，每回合结算末 `morale -1`
- 当 `morale ≤ 2` 时，每回合结算末 `stability -1`
- 当 `morale ≤ 0` 时，游戏**立即失败**（"Team morale collapsed. The company fell apart."）

---

## 设计文件索引

| 文件 | 内容 |
|------|------|
| [roles.md](./roles.md) | 可选角色系统（CEO、CTO、CMO 等） |
| [organization.md](./organization.md) | 公司组织架构选项 |
| [industry-and-domain.md](./industry-and-domain.md) | 行业与领域选择 |
| [strategy-cards.md](./strategy-cards.md) | 52 张策略卡 + 卡牌连击系统 |
| [events.md](./events.md) | 30 个真实科技史事件卡 |
| [company-archetypes.md](./company-archetypes.md) | 真实公司原型模板 |
| [room-bonus.md](./room-bonus.md) | 8 个房间加成（planning 阶段） |
| [talent-progression.md](./talent-progression.md) | 天赋进阶系统（growth / scale 里程碑） |
