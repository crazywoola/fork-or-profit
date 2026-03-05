# 外部突发事件（30 张）

30 个来自真实科技史的事件。每回合开始翻开 1 张，玩家选择响应方式。

## 事件格式说明

- **即时效果**：翻开后自动生效
- **选项 A/B/C**：玩家选择一个响应，产生对应后续效果
- **原型参考**：该事件在现实中对应的真实案例

---

## 1. GitHub Stars Explosion
`[社区]` 正面 · 一次性

你们的仓库在一夜之间被某个知名开发者推荐，Star 数暴涨。

- **即时效果**：`com +6`，`gro +5`
- **选项**：
  - A. 趁热打铁发 Blog：`rep +2`，`com +2`（趁流量高峰输出内容）
  - B. 快速修复积压 Issues：`trust +3`，`stb +1`（展示响应力）
  - C. 推出赞助渠道：`rev +2`，`com -1`（趁热变现，部分用户反感）
- **原型**：curl、bat、ripgrep 等工具的爆红时刻

---

## 2. Hacker News Front Page
`[媒体]` 正面 · 一次性

你们的文章或产品登上 HN 首页，停留 4 小时。

- **即时效果**：`gro +5`，`com +3`
- **评论风向（随机）**：
  - 好评（60%）：`rep +2`，`trust +1`
  - 批评（40%）：`rep -1`，但 `com +1`（争议带来热度）
- **原型**：几乎每个开发者工具的重要里程碑

---

## 3. Cloud Vendor Fork
`[竞争]` 危机 · 持续 3 回合

一家主要云厂商宣布将你的开源项目 fork 并作为托管服务提供，自己不回馈上游。

- **即时效果**：`ctr -5`，`rev -3`，`com +2`（社区同情你）
- **选项**：
  - A. 更换许可证（BSL/SSPL）：`ctr +4`，`com -4`（社区分裂）→ 触发「Licensing Controversy」
  - B. 与云厂商谈判合作：`rev +3`，`ctr -2`（妥协但有收益）
  - C. 全力建设社区护城河：`com +5`，`gro +3`（输了商业，赢了社区）
- **原型**：AWS ElastiCache vs Redis，AWS OpenSearch vs Elasticsearch

---

## 4. Major Security Vulnerability
`[技术]` 危机 · 持续 2 回合

安全研究人员在你们产品中发现高危漏洞，已公开 CVE 编号，CVSS 评分 9.8。

- **即时效果**：`rep -6`，`gro -2`，`rsk +3`
- **选项**：
  - A. 72 小时紧急修复 + 公开 Post-Mortem：`rep +3`，`trust +2`（诚实挽回信任）
  - B. 静默修复，低调处理：无额外损失，但若被媒体发现 `rep -4`（额外惩罚）
  - C. 免费升级所有受影响客户：`csh -2`，`rev +2`（长期客户留存）
- **原型**：Log4Shell（Log4j），OpenSSL Heartbleed

---

## 5. Open Source Maintainer Burnout
`[社区][人才]` 重要 · 持续 2 回合

核心维护者公开发文：「我已经精疲力竭，无法再独自撑起这个项目」。

- **即时效果**：`com -5`，`spd -2`
- **选项**：
  - A. 雇佣维护者全职投入：`csh -2`/回合，`com +3`，`spd +2`
  - B. 公开招募社区接替者：`com +2`，但需等待 2 回合才有效果
  - C. 宣布进入维护模式（低迭代）：`stb +2`，`gro -3`，`com -2`
- **原型**：core-js 维护者危机，Babel 疲惫公告，left-pad 事件前后

---

## 6. VC Funding Winter
`[融资]` 危机 · 持续 4 回合

宏观环境恶化，一级市场进入寒冬，估值倍数大幅压缩，融资周期延长至 18 个月。

- **即时效果**：所有融资类策略卡效果 -30%
- **选项**：
  - A. 裁员 10-15%，延长跑道：`csh +3`/回合，`com -2`，`rep -2`
  - B. 加速商业化，减少对融资依赖：商业化类卡效果 +20%（本事件持续期间）
  - C. 寻找战略投资人（非 VC）：打出「Strategic Investor」卡时费用 -1
- **原型**：2022-2023 年科技寒冬，Crypto 寒冬

---

## 7. Big Tech Competition
`[竞争]` 重要 · 持续 3 回合

Google/Microsoft/Amazon 发布一款与你的产品高度重叠的免费工具，并深度集成自家生态。

- **即时效果**：`gro -4`，`rep -1`
- **选项**：
  - A. 聚焦细分市场，打差异化：`com +3`，`gro -1`（进一步收窄，但更深）
  - B. 加速开源社区建设：`com +4`（大厂通常社区运营不如独立项目）
  - C. 主动与大厂接触：可能触发「Acquisition Offer」事件（触发概率 +30%）
- **原型**：Docker vs containerd，Algolia vs Elasticsearch，Notion vs Microsoft Loop

---

## 8. Developer Migration Wave
`[社区]` 正面 · 一次性

行业内另一个老牌项目宣布停止维护，其用户开始大规模迁移。

- **即时效果**：`com +4`，`gro +3`
- **选项**：
  - A. 发布迁移指南，主动接收用户：`com +3`，`gro +2`，`spd -1`（支持成本）
  - B. 提供一键迁移工具：`csh -1`，`gro +4`，`trust +2`
  - C. 什么都不做：获得部分自然迁移，效果减半
- **原型**：CentOS → AlmaLinux/Rocky Linux，Parse → 各替代方案

---

## 9. Major Conference Talk
`[媒体]` 正面 · 一次性

你们团队在 KubeCon / PyCon / JSConf 等顶级会议发表主题演讲，现场 3000 人。

- **即时效果**：`rep +4`，`gro +2`
- **选项**：
  - A. 同步发布重大新功能：`com +3`，`gro +2`（借势发布）
  - B. 宣布开源新模块：`com +4`，`rev -1`
  - C. 宣布企业版计划：`rev +3`，`com -1`
- **原型**：Solomon Hykes 在 PyCon 首次 demo Docker

---

## 10. Licensing Controversy
`[社区][媒体]` 危机 · 持续 3 回合

你们宣布将许可证从 MIT/Apache 更换为商业源码许可证（BSL/SSPL），社区哗然。

- **即时效果**：`com -4`，`trust -3`
- **选项**：
  - A. 坚持变更，解释商业理由：`ctr +3`，`com -3`（进一步流失），`rev +2`
  - B. 回滚许可证：`com +4`，`trust +3`，`ctr -4`（放弃控制）
  - C. 折中：只对新版本变更，旧版本维持原协议：`com -1`，`ctr +2`
- **原型**：HashiCorp BSL 变更，Redis SSPL 事件，Elastic vs AWS

---

## 11. Docker Boom
`[生态]` 正面 · 持续 2 回合

容器化技术爆发，你们的产品恰好与 Docker/容器生态高度兼容，用户大量涌入。

- **即时效果**：`gro +5`，`com +3`
- **选项**：
  - A. 发布官方 Docker 镜像 + 集成文档：`com +2`，`gro +2`
  - B. 联合 Docker 联合营销：`rep +3`，`csh -1`
  - C. 乘势推出容器专属企业功能：`rev +4`，`com -1`
- **原型**：2014-2016 年容器生态大爆发

---

## 12. Kubernetes Adoption
`[生态]` 正面 · 持续 2 回合

Kubernetes 成为行业标准，你们提前完成 K8s 集成，成为默认推荐方案。

- **即时效果**：`gro +4`，`rep +3`
- **选项**：
  - A. 申请成为 CNCF 项目：`com +5`，`csh -1`，需 2 回合审批
  - B. 推出 Helm Chart / Operator：`com +3`，`gro +2`
  - C. 针对 K8s 推出专属企业版：`rev +5`，`com -2`
- **原型**：Prometheus、Grafana、Linkerd 的 CNCF 之路

---

## 13. AI Hype Cycle
`[市场]` 重要 · 持续 3 回合

生成式 AI 浪潮席卷全行业，投资人和用户都在问「你们的 AI 功能在哪里」。

- **即时效果**：`prs +2`（投资人施压要求 AI 转型）
- **选项**：
  - A. 快速集成 LLM API，发布 AI 功能：`gro +4`，`stb -2`（赶工质量差），`rep +2`
  - B. 深思熟虑再推出，不跟风：`trust +3`，`gro -1`（短期落后），后续 AI 卡效果 +30%
  - C. 开源你们的 AI 模型/工具：`com +5`，`rev -1`
- **原型**：2023 年几乎所有公司的 AI 转型压力

---

## 14. Developer Strike
`[社区]` 危机 · 一次性

核心社区开发者联合声明：在公司做出某项政策调整前，停止向项目贡献代码。

- **即时效果**：`com -4`，`spd -3`
- **选项**：
  - A. 与开发者对话，满足诉求：`com +5`，`trust +3`，可能需要放弃一张已打出的商业化卡
  - B. 拒绝，自行推进：`ctr +2`，`com -3`，`spd -2`（继续恶化）
  - C. 引入社区治理（TSC）：`com +3`，`ctr -2`，`trust +2`
- **原型**：Python 社区 GvR 退休后的治理危机，Node.js vs io.js 分裂

---

## 15. Government Regulation
`[监管]` 重要 · 持续

主要市场政府出台新法规，要求数据本地化或安全审查（参考 GDPR、中国网络安全法）。

- **即时效果**：`rsk +2`，`csh -2`（合规成本）
- **选项**：
  - A. 立即合规，获得认证：`csh -3`，`rep +3`，`trust +2`（长期收益）
  - B. 观望，边做边改：`rsk +2`/回合，节省当期开支
  - C. 以开源透明度应对监管：`com +2`，合规成本减半（仅开源项目可选）
- **原型**：GDPR 执行，TikTok 数据本地化要求

---

## 16. Patent Lawsuit
`[监管]` 危机 · 持续 3 回合

一家专利流氓公司或竞争对手起诉你们侵犯了 3 项软件专利，索赔 $1000 万。

- **即时效果**：`rep -3`，`rsk +4`，`csh -2`（律师费）
- **选项**：
  - A. 应诉并反诉：`csh -4`，50% 概率胜诉（`rep +4`），50% 败诉（`csh -6`）
  - B. 庭外和解：`csh -5`，`rsk -3`，事件结束
  - C. 加入开源专利保护组织（OIN）：`csh -1`，长期 `rsk -2`，`com +2`
- **原型**：Oracle vs Google（Java 专利），各类 NPE 诉讼

---

## 17. Viral Blog Post
`[媒体]` 正面 · 一次性

一位知名技术博主发表了关于你们产品的深度好评文章，全网转发。

- **即时效果**：`gro +4`，`rep +3`
- **选项**：
  - A. 与博主合作，持续输出内容：`csh -1`/回合，`rep +2`，`gro +2`（持续 3 回合）
  - B. 趁热打铁开启免费试用活动：`gro +3`，`rev -1`（短期）
  - C. 什么都不做：效果维持，无额外收益
- **原型**：Jeff Dean 文章带火某个开源工具的案例

---

## 18. Massive Outage
`[技术]` 危机 · 持续 2 回合

生产环境发生重大宕机，核心服务中断超过 6 小时，影响所有付费客户。

- **即时效果**：`rep -5`，`rev -2`（SLA 赔付），`trust -3`
- **选项**：
  - A. 全面公开 Post-Mortem + 补偿：`rep +3`，`trust +3`，`csh -2`
  - B. 加急修复，最小化声明：`rep -1`（额外），无补偿，省钱但失信
  - C. 将事故根本原因开源（如：开源监控系统）：`com +3`，`rep +1`
- **原型**：AWS us-east-1 宕机，Cloudflare 大规模中断

---

## 19. Data Breach
`[技术][监管]` 危机 · 持续 3 回合

黑客攻破你们的数据库，200 万用户数据泄露，已在暗网售卖。

- **即时效果**：`rep -6`，`trust -4`，`rsk +5`
- **选项**：
  - A. 72 小时内主动披露 + 通知用户：`rep +2`，`trust +2`（合规减轻处罚）
  - B. 延迟披露，先修复再公告：`rsk +3`（被监管发现加倍惩罚概率 +40%）
  - C. 聘请顶级安全公司公开处理：`csh -4`，`rep +3`，`rsk -3`
- **原型**：Uber 数据泄露事件（延迟披露被重罚），LastPass 数据泄露

---

## 20. Open Source Fork
`[社区]` 危机 · 触发链

社区核心成员正式宣布 Fork 你的项目，并获得多个知名开发者背书。

- **即时效果**：`com -5`，`ctr -4`
- **后续判定**（3 回合后）：
  - 若 `com ≥ 15`：分叉影响有限，你保持主流地位
  - 若 `com < 10`：分叉成为社区新主流，你的开源路线基本失败
- **选项**：
  - A. 拥抱分叉，合并优秀贡献：`com +4`，`trust +3`（化敌为友）
  - B. 通过社区投票证明正当性：`com +2`，需消耗 1 回合行动
  - C. 法律手段阻止（商标/版权）：`ctr +3`，`com -5`，`rep -3`（公关灾难）
- **原型**：OpenOffice → LibreOffice，io.js → Node.js 回归，MariaDB vs MySQL

---

## 21. Acquisition Offer
`[市场]` 传说 · 一次性

一家头部科技公司的 M&A 团队发来正式收购意向，估值为当前市场价的 3 倍。

- **触发条件**：`reputation + revenue ≥ 20` 时以 20% 概率随机触发
- **选项**：
  - A. 接受收购：触发「并购退出」胜利检查
  - B. 拒绝并保持独立：`com +3`，`rep +2`，`prs -1`（员工振奋）
  - C. 借邀约谈判融资：用收购要约作筹码，打出融资卡时 `csh +3`（本回合）
- **原型**：WhatsApp 被 Facebook 收购，GitHub 被 Microsoft 收购，Figma 被 Adobe 收购（失败）

---

## 22. Big Enterprise Contract
`[市场]` 正面 · 持续 6 回合

一家 Fortune 500 公司签署 3 年期大合同，年均合同价值 $500K。

- **即时效果**：`rev +8`，`rep +3`，`csh +4`（预付款）
- **选项**：
  - A. 接受合同并满足定制需求：`rev +8`/回合，但 `stb -2`（定制需求分散精力）
  - B. 接受合同但拒绝深度定制：`rev +6`/回合，`com +1`（保持产品纯粹性）
  - C. 将合同案例公开（客户同意）：`rep +4`，解锁「标杆客户」状态
- **原型**：各大开源公司的第一个企业大客户

---

## 23. Competitor Shutdown
`[竞争]` 正面 · 一次性

你的主要竞争对手宣布关闭产品或被收购整合，大量用户急需替代方案。

- **即时效果**：`gro +5`，`com +3`
- **选项**：
  - A. 紧急发布迁移工具：`gro +4`，`com +2`，`spd -1`（突击开发）
  - B. 发布对比文章，吸引用户：`rep +3`，`gro +3`
  - C. 提供限时免费优惠：`gro +5`，`rev -1`（短期牺牲换用户量）
- **原型**：Parse 关闭后 Firebase 的爆发，Heroku 免费层关闭后其他 PaaS 的受益

---

## 24. Industry Standardization
`[生态]` 重要 · 持续

一个行业标准委员会（CNCF/OpenSSF/W3C）将你们的技术纳为官方标准基础。

- **即时效果**：`rep +4`，`com +3`
- **选项**：
  - A. 主导标准制定，投入资源：`csh -2`，`com +4`，`ctr +2`（定义行业规则）
  - B. 积极参与但不主导：`com +2`，无额外成本
  - C. 旁观等待：短期无影响，但错过标准塑造窗口
- **原型**：Prometheus 成为 CNCF 毕业项目，OpenTelemetry 标准化

---

## 25. Foundation Formation
`[生态]` 重要 · 一次性

社区和企业成员联合建议成立独立基金会管理项目，将控制权从公司转向中立机构。

- **即时效果**：无（需玩家决策）
- **选项**：
  - A. 同意成立基金会：`com +5`，`trust +4`，`ctr -4`（放弃部分控制）
  - B. 拒绝，保持公司控制：`ctr +2`，`com -3`，`trust -2`
  - C. 成立基金会但保留关键席位：`com +3`，`trust +2`，`ctr -2`（折中）
- **原型**：Node.js Foundation，OpenJS Foundation，Rust Foundation 的成立

---

## 26. Cloud Partnership
`[生态]` 正面 · 持续 3 回合

AWS/GCP/Azure 主动提出将你们的产品列入其 Marketplace，并提供联合销售支持。

- **即时效果**：`rev +4`，`gro +3`
- **选项**：
  - A. 全面合作，深度集成：`rev +6`，`ctr -2`（平台依赖），`com -1`
  - B. 有限合作，保持独立：`rev +3`，维持自主性
  - C. 拒绝，担心被平台锁定：`com +2`，`ctr +2`，错过短期营收
- **原型**：HashiCorp 与 AWS Marketplace，MongoDB Atlas 的云合作

---

## 27. Developer Tool Integration
`[生态]` 正面 · 一次性

GitHub/VS Code/JetBrains 官方宣布内置或推荐你们的工具。

- **即时效果**：`gro +5`，`com +3`，`rep +2`
- **选项**：
  - A. 优化集成体验，发布专属插件：`gro +3`，`com +2`，`spd -1`
  - B. 联合发布营销：`rep +3`，`gro +2`
  - C. 以此为筹码谈判：打出融资卡时额外 `csh +2`（本回合）
- **原型**：ESLint 被 VS Code 默认集成，Prettier 进入主流编辑器

---

## 28. Global Dev Conference
`[媒体]` 正面 · 一次性

你们首次举办年度全球开发者大会，吸引 5000 名开发者参与。

- **即时效果**：`rep +4`，`com +4`，`gro +2`
- **选项**：
  - A. 大会上宣布重大开源里程碑：`com +4`，`trust +3`
  - B. 大会上发布企业版新功能：`rev +4`，`com -1`
  - C. 宣布 Open-Core 战略转型：同时 `com +2`，`rev +2`，`trust +2`
- **原型**：HashiConf、KubeCon、DockerCon

---

## 29. Ecosystem Explosion
`[生态]` 正面 · 持续 3 回合

围绕你们核心产品的第三方插件、集成、教程内容爆发式增长，形成飞轮效应。

- **触发条件**：通常由「Launch Plugin Ecosystem」或「Platform Strategy」卡触发
- **即时效果**：`com +5`，`gro +4`，`rep +3`
- **持续效果**：每回合 `com +1`，`gro +1`
- **选项**：
  - A. 建立插件市场并抽成：`rev +3`/回合，`com -1`（部分开发者不满）
  - B. 完全免费开放生态：`com +3`，`gro +3`，`rev` 靠企业版间接变现
- **原型**：VS Code 插件生态，Grafana 数据源插件，Terraform Provider 生态

---

## 30. Platform Shift
`[市场]` 重要 · 持续 4 回合

行业发生重大平台迁移（移动端→云端→AI 原生），你的产品面临需要大规模重构还是跟进的选择。

- **即时效果**：`gro -2`（当前方向失去动力），`prs +2`（投资人催促转型）
- **选项**：
  - A. 全面押注新平台，重写核心：`spd -3`，`stb -2`（短期阵痛），2 回合后 `gro +6`，`com +3`
  - B. 渐进式迁移，兼容新旧：`spd -1`，3 回合后 `gro +3`，稳健但不亮眼
  - C. 坚守原有路线，服务保守用户：`rev +2`（现有客户续费），`gro -3`（新用户不来）
- **原型**：从桌面到移动（Adobe），从本地到云（Microsoft Office 365），从云到 AI 原生（Salesforce Einstein）

---

## 事件牌组构成

| 类别 | 张数 | 典型事件 |
|------|------|---------|
| 社区类 | 7 | Stars Explosion, Maintainer Burnout, Fork, Strike |
| 竞争类 | 5 | Cloud Fork, Big Tech Competition, Competitor Shutdown |
| 生态类 | 6 | Docker Boom, K8s Adoption, Ecosystem Explosion, Platform Shift |
| 媒体类 | 4 | HN Front Page, Viral Blog, Conference Talk, Dev Conference |
| 技术类 | 4 | Security Vulnerability, Massive Outage, Data Breach |
| 市场类 | 4 | Acquisition Offer, Big Enterprise Contract, AI Hype, VC Winter |
| **合计** | **30** | |

## 事件触发规则

1. **标准触发**：每回合阶段 1 翻开牌堆顶 1 张
2. **条件触发**：传说级事件（如「Acquisition Offer」）只在满足指标阈值时才进入牌堆
3. **连锁触发**：部分卡牌打出后（如「Launch Plugin Ecosystem」）会将对应正面事件加入牌堆
4. **行业加权**：行业选择影响各类事件的出现概率（云基础设施行业中「Cloud Vendor Fork」出现概率 ×2）
