# SAP EASY GO - Claude AI 开发记忆系统

> **最后更新**: 2026-01-17 23:05
> **版本**: 2.0.0 (基于 Boris Cherny 并行工作流重构)

---

## 🧠 系统概述

**项目名称**: SAP EASY GO (OLORA - SAP AI Agent)
**定位**: 企业级 SAP 智能助手,支持自然语言对话完成 SAP 业务操作
**工作模式**: 支持 1-15 个 Claude 实例并行开发

---

## 📋 技术栈

### 后端
```
框架: NestJS 10 + TypeScript 5
数据库: PostgreSQL 16 (Prisma ORM)
缓存: Redis 7.2
向量库: Qdrant 1.7 (RAG知识库)
LLM: OpenAI GPT-4 / DeepSeek / Gemini (可切换)
认证: JWT (jsonwebtoken@9.0.2)
```

### 前端
```
框架: Next.js 14 + React 18
UI: Ant Design 5 / Shadcn/ui
状态: Zustand
实时: Socket.IO
图表: Recharts
```

### 开发工具
```
包管理: pnpm + Turborepo (Monorepo)
代码质量: ESLint + Prettier + Husky
测试: Jest (后端) + Playwright (前端E2E)
```

---

## 🚫 Claude 绝对不能做的事 (错误记录)

### 1. 硬编码问题 (已修复 ✅)
❌ **不要** 在前端硬编码 API 地址 `http://localhost:3002`
✅ **正确**: 使用统一配置 `import { API_ENDPOINTS } from '@/config/env'`

**受影响文件**:
- `olora/apps/web/app/page.tsx`
- `olora/apps/web/app/knowledge/page.tsx`
- `olora/apps/web/app/reports/page.tsx`
- `olora/apps/web/app/settings/page.tsx`
- `olora/apps/web/app/mail/page.tsx`

**配置文件**:
- `olora/apps/web/.env.local` (开发环境)
- `olora/apps/web/.env.production` (生产环境)
- `olora/apps/web/config/env.ts` (统一导出)

---

### 2. 假数据问题

#### 2.1 认证系统 (已修复 ✅)
❌ **不要** 返回固定的演示 token `demo-token-${timestamp}`
✅ **正确**: 使用真实 JWT 认证

**实现文件**:
- `olora/apps/backend/src/services/auth.service.js`
  - bcrypt 密码哈希 (10 rounds)
  - JWT token 生成 (7天有效期)
  - 邮箱唯一性验证
  - 账户激活状态检查

**安全要求**:
- 必须配置 `JWT_SECRET` 环境变量
- 密码必须使用 bcrypt 加盐哈希
- Token 必须包含过期时间

---

#### 2.2 报表数据 (演示模式 ⚠️)
❌ **当前状态**: `olora/apps/backend/src/services/report.service.js` 返回硬编码演示数据
✅ **生产环境需要**:
1. 从 PostgreSQL 读取历史数据
2. 调用 SAP API 获取实时数据
3. 实现用户权限控制
4. 添加数据缓存 (Redis)

**标记**: 所有演示数据返回时添加 `_isDemoData: true`

---

#### 2.3 SAP API 集成 (TODO 🔧)
❌ **当前状态**: `olora/apps/backend/src/modules/action/executor.service.ts` 返回虚拟数据

| 函数 | 需要调用的 SAP BAPI | 状态 |
|------|-------------------|------|
| `generateReport()` | SAP 报表 API | TODO |
| `createProject()` | `BAPI_PROJECTDEF_CREATE` | TODO |
| `createWBS()` | `BAPI_BUS2054_CREATE` | TODO |
| `updateBudget()` | 预算更新 BAPI | TODO |

**实现要求**:
1. 安装 `node-rfc` 或使用 SAP Gateway OData
2. 配置 SAP 连接参数 (HOST, CLIENT, SYSNR)
3. 验证用户 SAP 权限
4. 记录操作到审计日志
5. 添加 `_isDemoData: true` 标记 (演示模式)

---

#### 2.4 权限检查系统 (简化版 ⚠️)
❌ **当前状态**: `olora/apps/backend/src/modules/action/permission.service.ts` 只检查是否有 SAP 绑定

✅ **生产环境需要**:
1. 查询 `user_sap_bindings` 表
2. 调用 SAP Authorization API 验证权限对象
3. 查询 `actions` 表获取所需权限列表
4. 实现权限缓存 (Redis, 5分钟)

**只读操作白名单**:
- `SAP_DATA_QUERY`
- `SAP_REPORT_GENERATE`

---

### 3. Excel 导出 (已修复 ✅)
❌ **不要** 返回 `'Excel export not implemented yet'`
✅ **正确**: 使用 `xlsx` 库生成真实 Excel

**实现**:
- `olora/apps/backend/src/services/report.service.js:convertToExcel()`
- 创建多个工作表 (摘要、详细数据、KPI)
- 返回 Excel buffer 供下载

---

### 4. 演示响应 (已优化 ✅)
❌ **不要** 硬编码 100+ 行的对话回复
✅ **正确**: 简洁的配置提示

**位置**: `olora/apps/backend/src/standalone-api.ts:generateResponse()`

```javascript
// 旧代码 (已删除)
if (userMessage.includes('你好')) {
  return `120行的详细介绍文本...`
}

// 新代码
function generateResponse(userMessage) {
  return `⚠️ 系统当前处于演示模式（LLM未配置）

您的消息：${userMessage}

🔧 请配置LLM以使用完整的AI功能：
1. 前往"系统设置"页面
2. 选择LLM提供商（OpenAI/DeepSeek/Gemini）
3. 输入API密钥
4. 保存并重启后端服务`
}
```

---

## 🎯 Boris Cherny 并行工作流

### 核心策略

#### 1. 极致并行处理
```bash
# 同时运行 10-15 个 Claude 实例
终端 Claude 1-5: 处理不同模块
浏览器 Claude 6-15: 处理 UI/文档/测试

# 任务分配示例
Claude 1: SAP API 集成 (executor.service.ts)
Claude 2: 报表数据源 (report.service.js)
Claude 3: 权限系统 (permission.service.ts)
Claude 4: 前端组件优化
Claude 5: 编写单元测试
Claude 6: E2E 测试 (Playwright)
Claude 7: 文档更新
Claude 8: 代码审查
Claude 9: 性能优化
Claude 10: 安全加固
```

#### 2. 只用最强模型
- **Opus 4.5 with thinking** - 用于所有复杂任务
- **Sonnet 4.5** - 用于中等复杂度任务
- **Haiku** - 仅用于简单重复性任务

#### 3. 自动化验证
每个变更必须通过:
```bash
# 1. 单元测试
pnpm --filter @olora/backend test

# 2. 集成测试
pnpm --filter @olora/backend test:e2e

# 3. 前端测试
pnpm --filter @olora/web test:e2e

# 4. 构建验证
pnpm build

# 5. 代码质量
pnpm lint
```

---

## 📂 项目结构

### Monorepo 布局
```
SAP-EASY-GO/
├── CLAUDE.md                    ⭐ 本文件 (唯一记忆系统)
├── TASKS.json                   ⭐ 并行任务清单 (新增)
├── .automate/                   ⭐ 自动化脚本 (新增)
│   ├── verify.sh                # 验证脚本
│   ├── parallel-test.sh         # 并行测试
│   └── deploy.sh                # 部署脚本
│
├── olora/                       # 主项目
│   ├── apps/
│   │   ├── backend/             # NestJS 后端
│   │   │   ├── src/
│   │   │   │   ├── modules/     # 功能模块
│   │   │   │   ├── services/    # 业务服务
│   │   │   │   └── standalone-api.ts
│   │   │   ├── prisma/
│   │   │   │   └── schema.prisma
│   │   │   └── package.json
│   │   │
│   │   └── web/                 # Next.js 前端
│   │       ├── app/
│   │       ├── components/
│   │       ├── config/
│   │       │   └── env.ts       # 环境配置
│   │       ├── .env.local
│   │       ├── .env.production
│   │       └── package.json
│   │
│   ├── packages/                # 共享包
│   │   ├── types/               # 类型定义
│   │   └── config/              # 共享配置
│   │
│   ├── docker-compose.yml
│   ├── pnpm-workspace.yaml
│   └── turbo.json
│
└── docs/                        ⭐ 文档归档 (新增)
    ├── archive/                 # 历史文档
    └── guides/                  # 使用指南
```

### 关键文件说明

| 文件 | 用途 | 是否可修改 |
|------|------|----------|
| `CLAUDE.md` | Claude AI 记忆系统 | ✅ 每次发现问题立即更新 |
| `TASKS.json` | 并行任务清单 | ✅ 任务状态变更时更新 |
| `.automate/verify.sh` | 自动化验证脚本 | ✅ 添加新检查项 |
| `olora/feature_list.json` | 功能清单 | ✅ 标记完成状态 |
| `olora/progress.md` | 开发日志 | ✅ 每次修改代码后追加 |
| `olora/apps/backend/prisma/schema.prisma` | 数据库模型 | ⚠️ 需要迁移 |
| `olora/apps/web/config/env.ts` | 环境配置 | ⚠️ 不要硬编码 |

---

## 🔧 常用命令

### 开发
```bash
# 安装依赖
pnpm install

# 启动所有服务
pnpm dev

# 单独启动后端
pnpm --filter @olora/backend dev

# 单独启动前端
pnpm --filter @olora/web dev

# 构建
pnpm build
```

### 数据库
```bash
# 启动 Docker 服务
docker-compose up -d

# 数据库迁移
cd olora/apps/backend
npx prisma migrate dev

# 生成 Prisma Client
npx prisma generate

# 打开 Prisma Studio
npx prisma studio
```

### 测试
```bash
# 后端测试
pnpm --filter @olora/backend test
pnpm --filter @olora/backend test:cov

# 前端测试
pnpm --filter @olora/web test:e2e
pnpm --filter @olora/web test:e2e --ui

# 运行自动化验证
./.automate/verify.sh
```

### Git
```bash
# 查看状态
git status

# 提交 (遵循约定式提交)
git add .
git commit -m "feat: 功能描述"
git push origin main

# 查看历史
git log --oneline -10
```

---

## 📊 当前系统状态

### ✅ 已完成
- [x] 统一环境配置管理 (`config/env.ts`)
- [x] 真实用户认证系统 (`auth.service.js`)
- [x] Excel 导出功能 (`report.service.js`)
- [x] 演示响应优化 (`standalone-api.ts`)

### ⚠️ 演示模式 (需要真实实现)
- [ ] 报表数据源 → 需要接入 PostgreSQL + SAP API
- [ ] SAP 操作执行 → 需要调用真实 BAPI
- [ ] 权限验证系统 → 需要调用 SAP Authorization API

### 🔧 待完成 (生产环境必需)
- [ ] SAP RFC 连接配置
- [ ] Redis 缓存实现
- [ ] 审计日志完善
- [ ] HTTPS/TLS 配置
- [ ] Rate Limiting
- [ ] CSRF 保护
- [ ] 错误监控 (Sentry)
- [ ] 性能监控 (APM)

---

## 🚀 生产部署检查清单

### 配置
```bash
# 前端
✅ .env.production 配置生产 API_URL
✅ 启用生产模式构建优化

# 后端
✅ DATABASE_URL 配置生产数据库
✅ JWT_SECRET 配置强密钥 (至少32字符)
⏳ SAP_HOST, SAP_CLIENT, SAP_SYSNR 配置
⏳ REDIS_URL 配置
✅ LLM API 密钥配置
⏳ SMTP 配置
```

### 安全
```bash
⏳ 配置 HTTPS/TLS
⏳ 配置 CORS 白名单
⏳ 启用 Rate Limiting
⏳ 启用 Helmet (安全头)
⏳ 配置 CSP (内容安全策略)
⏳ 配置防火墙规则
```

### 基础设施
```bash
⏳ Nginx/Caddy 反向代理
⏳ 负载均衡配置
⏳ 数据库备份策略
⏳ 日志收集 (ELK/Loki)
⏳ 监控告警 (Prometheus/Grafana)
```

---

## 📝 开发日志格式

每次修改代码后,立即追加到 `olora/progress.md`:

```markdown
### [2026-01-17 23:30] - F010 SAP API 集成

**修改内容**:
- `apps/backend/src/modules/action/executor.service.ts`:
  - 实现 createProject() 调用 BAPI_PROJECTDEF_CREATE
  - 添加参数验证和错误处理
  - 添加审计日志记录

**测试结果**:
- ✅ 单元测试通过 (3/3)
- ✅ 集成测试通过 (1/1)
- ✅ SAP 连接测试成功

**遇到的问题**:
- 问题: SAP RFC 连接超时
  - 解决: 增加连接超时时间到 30 秒

**Git 提交**:
```
commit abc123
feat: F010 SAP 项目创建 API 集成
```

**下一步**: F011 SAP WBS 创建集成
```

---

## 🔄 版本历史

- **v2.0.0** (2026-01-17): 基于 Boris Cherny 并行工作流重构
- **v1.0.0** (2026-01-17): 初始版本,集成代码审计发现

---

## 📞 快速参考

- **项目架构**: 见 `docs/guides/architecture.md`
- **API 文档**: http://localhost:3000/api/docs (后端运行时)
- **数据库 Schema**: `olora/apps/backend/prisma/schema.prisma`
- **问题记录**: 本文件 "Claude 绝对不能做的事" 章节

---

**记住**: 每次发现 Claude 做错的事,立即更新本文件! 🚫➡️📝
