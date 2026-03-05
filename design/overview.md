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
        ├── 阶段 1: 事件（翻开事件卡，选择响应）
        ├── 阶段 2: 行动（各角色打出策略卡）
        ├── 阶段 3: 结算（cash += revenue - burn，触发连锁）
        └── 阶段 4: 检查胜负 / 继续
```

## 设计文件索引

| 文件 | 内容 |
|------|------|
| [roles.md](./roles.md) | 可选角色系统（CEO、CTO、CMO 等） |
| [organization.md](./organization.md) | 公司组织架构选项 |
| [industry-and-domain.md](./industry-and-domain.md) | 行业与领域选择 |
| [strategy-cards.md](./strategy-cards.md) | 50 张策略卡完整列表 |
| [events.md](./events.md) | 30 个真实科技史事件卡 |
| [company-archetypes.md](./company-archetypes.md) | 真实公司原型模板 |
