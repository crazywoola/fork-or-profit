# Fork or Profit

<a href="https://www.buymeacoffee.com/pinkbanana" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

开源还是利润？**Fork or Profit** 是一款以科技公司战略决策为核心的策略卡牌游戏，玩家需要在社区与商业之间找到生存与增长的平衡。

- [English](./README.md)
- 中文

## 项目概述

Fork or Profit 是一款以科技公司为舞台的策略卡牌游戏。每个回合玩家需要应对外部事件、打出策略卡、调整公司关键指标，以达成特定胜利条件。游戏的核心矛盾是：社区增长与商业变现如何兼得。

核心指标包括 `cash`、`revenue`、`community`、`growth`、`reputation`、`control`、`dev_speed`、`stability`、`pressure`、`trust`、`risk`。

## 核心流程

1. 选择公司原型、行业领域、组织架构与角色。
2. 翻开事件卡并选择响应。
3. 各角色打出策略卡。
4. 结算影响，更新指标并判定胜负。

## 胜利模式

- 生存模式：12 回合内保持 `cash > 0` 且 `community > 0`。
- IPO 模式：在控制 `pressure` 的前提下提升 `revenue` 与 `reputation`。
- 传奇开源：最大化 `community` 与 `growth`。
- 并购退出：触发并购事件并满足 `reputation + revenue` 门槛。
- Open-Core：同时达成稳定的 `community` 与 `revenue`。

## 设计文档

- [design/overview.md](./design/overview.md)
- [design/roles.md](./design/roles.md)
- [design/organization.md](./design/organization.md)
- [design/industry-and-domain.md](./design/industry-and-domain.md)
- [design/strategy-cards.md](./design/strategy-cards.md)
- [design/events.md](./design/events.md)
- [design/company-archetypes.md](./design/company-archetypes.md)

## 本地启动

```bash
pnpm install
pnpm run dev
```

```bash
pnpm run deploy
```

## Cloudflare D1 + KV 绑定

请在 `wrangler.jsonc` 中更新 `d1_databases` 与 `kv_namespaces` 的占位值。
如需类型化绑定，请在完成 Wrangler 配置后执行：

```bash
pnpm run cf-typegen
```

## 存储工具

服务端辅助函数位于 `src/server/storage.ts`，可在 Worker 中直接使用：

```ts
import { d1Query, d1Exec, kvGetJson, kvPutJson } from './server/storage'
```

## 许可证

MIT，详见 [LICENSE](./LICENSE)。
