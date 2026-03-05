# Fork or Profit

<a href="https://www.buymeacoffee.com/pinkbanana" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

开源还是利润？**Fork or Profit** 是一款像素风策略 RPG / 卡牌游戏，围绕科技公司在社区与商业之间的长期博弈展开。

- [English](./README.md)
- 中文

## 在线体验

- [Cloudflare Workers 在线地址](https://fork-or-profit.evilbanana.workers.dev)

## 游戏截图

### 标题界面

![Fork or Profit 标题界面](./docs/screenshots/title-screen.png)

### 对局界面

![Fork or Profit 对局界面](./docs/screenshots/game-screen.png)

## 核心玩法

你需要选择角色、公司原型和胜利模式，在有限回合中平衡关键指标并达成目标。

每回合的核心流程：

1. **事件阶段**：面对叙事事件并做出决策。
2. **行动阶段**：消耗行动点打出策略卡。
3. **结算阶段**：应用效果、更新指标并判定胜负。

主要指标包括：
`cash`、`revenue`、`community`、`growth`、`reputation`、`control`、`dev_speed`、`stability`、`pressure`、`trust`、`risk`。

## 胜利模式

- **生存模式**：在第 12 回合前保持 `cash` 和 `community` 都大于 0。
- **IPO 模式**：在第 20 回合前达到 `revenue >= 30` 且 `reputation >= 15`。
- **开源传奇**：在第 20 回合前达到 `community >= 30` 且 `growth >= 20`。
- **并购退出**：触发并购事件并满足 `reputation + revenue >= 25`。
- **Open-Core**：在第 20 回合前同时达到 `community >= 15` 与 `revenue >= 15`。

## 快捷键

- `Tab`：切换开局配置面板焦点。
- `方向键 左/右`：切换角色、公司或模式。
- `方向键 上/下`：选择事件选项。
- `1-9`：在行动阶段快速打牌。
- `Enter`：确认当前选项或卡牌。
- `E`：结束当前行动回合。
- `S`：开关详细状态面板。
- `H`：打开帮助层。
- `I`：打开情报面板。
- `Esc`：关闭当前浮层。

## 本地开发

### 环境要求

- Node.js 20+
- `pnpm`

### 本地运行

```bash
pnpm install
pnpm run dev
```

浏览器打开 `http://localhost:5173`。

### 构建

```bash
pnpm run build
```

### 部署到 Cloudflare

```bash
pnpm run deploy
```

## Cloudflare 绑定（D1 + KV）

请在 `wrangler.jsonc` 中替换以下配置为你的真实资源 ID：

- `d1_databases`
- `kv_namespaces`

完成 Wrangler 配置后，可生成类型绑定：

```bash
pnpm run cf-typegen
```

## 设计文档

- [design/overview.md](./design/overview.md)
- [design/roles.md](./design/roles.md)
- [design/organization.md](./design/organization.md)
- [design/industry-and-domain.md](./design/industry-and-domain.md)
- [design/strategy-cards.md](./design/strategy-cards.md)
- [design/events.md](./design/events.md)
- [design/company-archetypes.md](./design/company-archetypes.md)

## 许可证

MIT，详见 [LICENSE](./LICENSE)。
