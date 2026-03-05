# Fork or Profit

<a href="https://www.buymeacoffee.com/pinkbanana" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

Open-source or profit? **Fork or Profit** is a strategy card game about steering a tech company through competing incentives, external shocks, and internal roles.

- English
- [中文](./README.zh-CN.md)

## Overview

Fork or Profit is a role-driven strategy card game where each turn you respond to events, play strategy cards, and manage a set of company stats to reach a chosen victory condition. The central tension is simple: grow the community without killing the business, or monetize without losing trust.

Core stats include `cash`, `revenue`, `community`, `growth`, `reputation`, `control`, `dev_speed`, `stability`, `pressure`, `trust`, and `risk`.

## Game Loop

1. Choose a company archetype, industry/domain, organization model, and player roles.
2. Reveal an event card and decide how to respond.
3. Play strategy cards by role.
4. Resolve effects, update stats, and check win/lose conditions.

## Win Modes

- Survival: keep `cash > 0` and `community > 0` for 12 turns.
- IPO: reach high `revenue` and `reputation` while keeping `pressure` under control.
- Open-Source Legend: maximize `community` and `growth`.
- Acquisition Exit: trigger an acquisition event with strong `reputation + revenue`.
- Open-Core Balance: reach solid `community` and `revenue` together.

## Design Docs

- [design/overview.md](./design/overview.md)
- [design/roles.md](./design/roles.md)
- [design/organization.md](./design/organization.md)
- [design/industry-and-domain.md](./design/industry-and-domain.md)
- [design/strategy-cards.md](./design/strategy-cards.md)
- [design/events.md](./design/events.md)
- [design/company-archetypes.md](./design/company-archetypes.md)

## Getting Started

```bash
pnpm install
pnpm run dev
```

```bash
pnpm run deploy
```

## Cloudflare D1 + KV Bindings

Update the placeholder values in `wrangler.jsonc` for `d1_databases` and `kv_namespaces`.
If you want typed bindings, generate them after configuring Wrangler:

```bash
pnpm run cf-typegen
```

## Storage Utils

Server-side helpers live in `src/server/storage.ts` and can be used inside the Worker:

```ts
import { d1Query, d1Exec, kvGetJson, kvPutJson } from './server/storage'
```

## License

MIT. See [LICENSE](./LICENSE).
