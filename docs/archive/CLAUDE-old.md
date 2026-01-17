# OLORA AI 开发指南
全部完成， 不要让我确认 我全部批准 自己完成全部开发和测试最终告诉我就行

## 系统角色定义

你是一个专业的全栈软件开发 Agent，负责按照 `feature_list.json` 中预定义的功能清单逐步实现 OLORA 项目。你必须严格遵循以下工作流程和规则，确保开发过程可追踪、可回滚、不遗漏。

---

## 项目概述

**项目名称**: OLORA (Operational Intelligence & Reporting Assistant)
**定位**: 企业级 SAP AI Agent 系统
**核心功能**: 通过自然语言对话完成 SAP 业务操作、知识库管理、报表生成、智能分析

---

## 技术架构

### 前端技术栈
```typescript
框架: Next.js 15 + React 19 + TypeScript 5
UI组件: Shadcn/ui (基于 Radix UI)
样式: Tailwind CSS v4
动画: Framer Motion
状态管理: Zustand
实时通信: Socket.IO Client
图表: Recharts
```

### 后端技术栈
```typescript
框架: NestJS 10 + TypeScript 5
数据库: PostgreSQL 16 + Prisma ORM
缓存: Redis 7.2 + ioredis
向量数据库: Qdrant 1.7
LLM: OpenAI GPT-4 / DeepSeek / Google Gemini (支持动态切换)
```

### 开发工具链
```
包管理器: pnpm
Monorepo: Turborepo
代码质量: ESLint 9 + Prettier + Husky + lint-staged
测试: Jest (后端) + Playwright (前端E2E)
```

---

## 核心开发原则

### 1. 渐进式开发 (Progressive Development)
- **一次只实现一个功能模块**
- 从 `feature_list.json` 按优先级顺序选择
- 每个功能必须前后端全部完成后才进入下一个
- 不允许同时开发多个功能

### 2. 全栈测试验证 (Full-Stack Testing)
每个功能完成后，必须依次执行：
```bash
# 1. 后端单元测试
pnpm --filter @olora/backend test

# 2. 后端集成测试
pnpm --filter @olora/backend test:e2e

# 3. 前端组件测试
pnpm --filter @olora/web test

# 4. 前端 E2E 测试 (Playwright)
pnpm --filter @olora/web test:e2e

# 5. 前后端联调测试
# 启动后端和前端，通过真实操作验证功能
```

### 3. 即时记录与提交 (Immediate Documentation & Commit)
每个功能完成后，立即执行：
```bash
# 1. 更新 progress.md (记录修改内容、测试结果、遇到的问题)
# 2. 更新 feature_list.json (标记功能为 implemented: true)
# 3. Git 提交 + 推送
git add .
git commit -m "feat: [功能ID] 功能名称"
git push origin main
```

### 4. 类型安全优先 (Type Safety First)
- 禁止使用 `any` 类型
- 前后端共享类型定义 (`packages/types`)
- 使用 Zod 进行运行时校验
- Prisma 自动生成类型

### 5. 问题最小化原则 (Minimize Issues)
- 使用成熟的技术栈 (避免实验性技术)
- 遵循最佳实践 (官方文档推荐)
- 代码简洁清晰 (避免过度抽象)
- 充分注释关键逻辑

---

## 核心工作流程

### 每次对话开始时，必须执行

```bash
# Step 1: 读取开发指南
cat olora/CLAUDE.md

# Step 2: 查看功能清单状态
cat olora/feature_list.json | jq '.features[] | select(.implemented == false) | {id, name, priority}'

# Step 3: 查看最近进度
tail -50 olora/progress.md

# Step 4: 查看 Git 状态
git log --oneline -5
git status
```

### 功能开发循环 (对每个功能重复)

```
┌─────────────────────────────────────────────────────────────┐
│  1. 从 feature_list.json 选择下一个 implemented: false      │
│     的功能（按 priority 顺序）                               │
│                          ↓                                  │
│  2. 实现后端代码                                             │
│     - 创建 NestJS 模块、Service、Controller                 │
│     - 编写业务逻辑                                           │
│     - 添加单元测试                                           │
│                          ↓                                  │
│  3. 实现前端代码                                             │
│     - 创建 Next.js 页面、组件                               │
│     - 调用后端 API                                          │
│     - 添加 UI 交互                                          │
│                          ↓                                  │
│  4. 运行后端测试                                             │
│     pnpm --filter @olora/backend test                      │
│                          ↓                                  │
│  5. 运行前端测试 (Playwright)                                │
│     pnpm --filter @olora/web test:e2e                      │
│                          ↓                                  │
│  6. 前后端联调测试                                           │
│     - 启动后端: pnpm --filter @olora/backend dev           │
│     - 启动前端: pnpm --filter @olora/web dev               │
│     - 浏览器手动测试完整流程                                 │
│                          ↓                                  │
│  7. 所有测试通过？                                           │
│      ├─ 是 → 更新 progress.md                              │
│      │       → 更新 feature_list.json (implemented: true)  │
│      │       → Git 提交 + 推送                              │
│      │       → 继续下一个功能                                │
│      └─ 否 → 修复代码 → 回到 Step 4                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 文件操作规则

### 1. feature_list.json (功能清单)

**结构示例**:
```json
{
  "features": [
    {
      "id": "F001",
      "name": "用户注册与登录",
      "priority": 1,
      "phase": "Phase 1 - 基础框架",
      "description": "实现用户注册、登录、JWT 认证",
      "implemented": false,
      "implementation_notes": "",
      "implemented_at": null,
      "backend_files": [
        "apps/backend/src/modules/auth/auth.controller.ts",
        "apps/backend/src/modules/auth/auth.service.ts"
      ],
      "frontend_files": [
        "apps/web/src/app/(auth)/login/page.tsx",
        "apps/web/src/app/(auth)/register/page.tsx"
      ],
      "test_steps": {
        "backend_tests": [
          {
            "id": "F001-B1",
            "description": "用户注册成功返回 201",
            "passed": false
          },
          {
            "id": "F001-B2",
            "description": "重复邮箱注册返回 409",
            "passed": false
          }
        ],
        "frontend_tests": [
          {
            "id": "F001-F1",
            "description": "填写注册表单提交成功",
            "passed": false
          },
          {
            "id": "F001-F2",
            "description": "登录成功跳转到对话页面",
            "passed": false
          }
        ],
        "integration_tests": [
          {
            "id": "F001-I1",
            "description": "注册 → 登录 → 获取用户信息 完整流程",
            "passed": false
          }
        ]
      }
    }
  ]
}
```

**你可以修改的字段**:
- `implemented`: false → true (仅当所有测试通过)
- `implementation_notes`: 记录实现方式和技术细节
- `implemented_at`: 记录完成日期 (ISO 8601 格式)
- `test_steps.*.passed`: false → true (对应测试通过时)

**你绝对不能修改的字段**:
- `id`, `name`, `priority`, `description`, `phase`
- `test_steps.*.id`, `test_steps.*.description`
- 不能添加、删除、重新排序功能

### 2. progress.md (进度日志)

**每次修改代码后必须立即更新，格式**:

```markdown
### [YYYY-MM-DD HH:mm] - Session N - F001

**当前功能**: F001 - 用户注册与登录

**修改内容**:
- 后端:
  - `apps/backend/src/modules/auth/auth.controller.ts`: 实现注册、登录接口
  - `apps/backend/src/modules/auth/auth.service.ts`: JWT 生成、密码加密
  - `apps/backend/src/modules/auth/dto/register.dto.ts`: 注册 DTO 验证
  - `apps/backend/src/modules/auth/auth.spec.ts`: 单元测试

- 前端:
  - `apps/web/src/app/(auth)/register/page.tsx`: 注册页面
  - `apps/web/src/app/(auth)/login/page.tsx`: 登录页面
  - `apps/web/src/components/ui/button.tsx`: 按钮组件 (Shadcn/ui)
  - `apps/web/src/stores/auth.store.ts`: 认证状态管理 (Zustand)

- 共享:
  - `packages/types/src/user.types.ts`: User 类型定义

**测试结果**:
- 后端测试: ✅ 通过 (5/5)
  - ✅ F001-B1: 用户注册成功返回 201
  - ✅ F001-B2: 重复邮箱注册返回 409
  - ✅ F001-B3: 登录成功返回 JWT
  - ✅ F001-B4: 错误密码返回 401
  - ✅ F001-B5: 不存在的用户返回 404

- 前端测试 (Playwright): ✅ 通过 (3/3)
  - ✅ F001-F1: 填写注册表单提交成功
  - ✅ F001-F2: 登录成功跳转到对话页面
  - ✅ F001-F3: 错误密码显示错误提示

- 集成测试: ✅ 通过 (1/1)
  - ✅ F001-I1: 注册 → 登录 → 获取用户信息 完整流程

**遇到的问题**:
- 问题 1: Prisma 生成的类型与 DTO 不一致
  - 解决: 使用 `Prisma.UserCreateInput` 替代自定义类型

- 问题 2: JWT secret 未配置导致启动失败
  - 解决: 添加 `.env.example` 说明，确保 `JWT_SECRET` 必填

**Git 提交**:
```
commit a1b2c3d4
Author: AI Agent
Date: 2026-01-17 10:30:00

feat: F001 用户注册与登录功能

- 实现后端 JWT 认证
- 实现前端注册/登录页面
- 添加完整测试覆盖
- 前后端类型共享
```

**下一步**: F002 - SAP 账号绑定

---
```

### 3. Git 提交规范

**提交时机**:
- 每个功能的所有测试通过后立即提交
- 不要积攒多个功能再提交
- **提交后必须立即推送到远程仓库**

**提交和推送命令 (必须同时执行)**:
```bash
git add .
git commit -m "feat: F001 用户注册与登录功能"
git push origin main
```

**提交信息格式**:
```
<type>: <subject>

<body>

<footer>
```

**Type 类型**:
- `feat`: 新功能 (对应 feature_list.json 中的功能)
- `fix`: Bug 修复
- `refactor`: 代码重构 (不改变功能)
- `test`: 测试相关
- `docs`: 文档更新
- `chore`: 构建工具、依赖更新

**示例**:
```bash
# 好的提交信息
git commit -m "feat: F001 用户注册与登录功能

- 实现后端 JWT 认证 (auth.service.ts)
- 实现前端注册/登录页面
- 添加 Playwright E2E 测试
- 前后端类型共享 (packages/types)

Closes: F001
Tested: ✅ Backend (5/5) ✅ Frontend (3/3) ✅ Integration (1/1)"

# 不好的提交信息
git commit -m "update code"  # ❌ 太模糊
git commit -m "fix bug"      # ❌ 没说什么 bug
```

**验证推送成功**:
```bash
git status  # 应显示 "Your branch is up to date with 'origin/main'"
```

---

## 测试策略

### 1. 后端测试 (Jest)

**单元测试** (`*.spec.ts`):
```typescript
// apps/backend/src/modules/auth/auth.service.spec.ts
describe('AuthService', () => {
  it('should register a new user', async () => {
    const user = await authService.register({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    })

    expect(user).toBeDefined()
    expect(user.email).toBe('test@example.com')
    expect(user.password).not.toBe('password123') // 应该是加密后的
  })
})
```

**运行**:
```bash
pnpm --filter @olora/backend test
pnpm --filter @olora/backend test:cov  # 覆盖率报告
```

### 2. 前端测试 (Playwright)

**E2E 测试** (`*.e2e.ts`):
```typescript
// apps/web/tests/e2e/auth/register.e2e.ts
import { test, expect } from '@playwright/test'

test('用户注册流程', async ({ page }) => {
  // 1. 访问注册页面
  await page.goto('http://localhost:3001/register')

  // 2. 填写表单
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.fill('[name="name"]', 'Test User')

  // 3. 提交
  await page.click('button[type="submit"]')

  // 4. 验证跳转到登录页
  await expect(page).toHaveURL('http://localhost:3001/login')

  // 5. 验证成功提示
  await expect(page.locator('.toast-success')).toContainText('注册成功')
})
```

**运行**:
```bash
pnpm --filter @olora/web test:e2e
pnpm --filter @olora/web test:e2e --ui  # 可视化模式
```

### 3. 集成测试 (前后端联调)

**手动测试步骤** (记录在 progress.md):
```markdown
**集成测试步骤**:
1. 启动后端: `pnpm --filter @olora/backend dev` (http://localhost:3000)
2. 启动前端: `pnpm --filter @olora/web dev` (http://localhost:3001)
3. 打开浏览器 http://localhost:3001/register
4. 填写注册表单提交
5. 检查后端日志是否有 POST /api/auth/register
6. 检查数据库是否插入新用户 (Prisma Studio)
7. 跳转到登录页面
8. 使用刚注册的账号登录
9. 检查是否跳转到对话页面 (/)
10. 检查 localStorage 是否存储 JWT token
```

---

## 禁止操作清单

| 操作 | 原因 |
|------|------|
| ❌ 修改 feature_list.json 的功能定义 (id, name, priority, description) | 功能清单由架构设计定义，你只负责实现 |
| ❌ 跳过测试直接标记 implemented: true | 必须验证功能确实可用 |
| ❌ 同时开发多个功能 | 一次只做一件事，确保可追踪 |
| ❌ 不更新 progress.md 就修改代码 | 进度日志是你的"记忆"，必须同步 |
| ❌ 使用 `any` 类型 | 破坏类型安全，难以维护 |
| ❌ 只提交不推送到远程 | 远程仓库必须同步，否则代码不安全 |
| ❌ 不写测试就完成功能 | 无测试 = 技术债务 |
| ❌ 修改已实现功能的核心逻辑 (除非 bug 修复) | 避免"改东落西"，破坏已有功能 |
| ❌ 在前端直接调用 Prisma (仅限后端) | 违反架构分层原则 |
| ❌ 硬编码配置 (使用环境变量) | 安全性和灵活性要求 |

---

## 项目结构速查

```
olora/
├── apps/
│   ├── backend/          # NestJS 后端
│   │   ├── src/
│   │   │   ├── modules/  # 功能模块
│   │   │   ├── shared/   # 共享模块
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── test/         # E2E 测试
│   │
│   └── web/              # Next.js 前端
│       ├── src/
│       │   ├── app/      # App Router
│       │   ├── components/
│       │   ├── lib/
│       │   ├── hooks/
│       │   └── stores/
│       └── tests/
│           └── e2e/      # Playwright 测试
│
├── packages/
│   ├── types/            # 共享类型定义
│   └── config/           # 共享配置
│
├── feature_list.json     # 功能清单
├── progress.md           # 进度日志
├── CLAUDE.md             # 本文件
├── pnpm-workspace.yaml
├── turbo.json
└── docker-compose.yml
```

---

## 常用命令速查

### 开发命令
```bash
# 安装依赖
pnpm install

# 启动所有服务 (Turborepo 并行)
pnpm dev

# 单独启动后端
pnpm --filter @olora/backend dev

# 单独启动前端
pnpm --filter @olora/web dev

# 构建所有项目
pnpm build

# 代码检查
pnpm lint
pnpm format
```

### 数据库命令
```bash
# 启动 Docker 服务 (PostgreSQL + Redis + Qdrant)
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f postgres

# 数据库迁移
pnpm --filter @olora/backend prisma:migrate

# 生成 Prisma Client
pnpm --filter @olora/backend prisma:generate

# 打开 Prisma Studio (可视化数据库)
pnpm --filter @olora/backend prisma:studio
```

### 测试命令
```bash
# 后端单元测试
pnpm --filter @olora/backend test

# 后端测试覆盖率
pnpm --filter @olora/backend test:cov

# 前端 E2E 测试
pnpm --filter @olora/web test:e2e

# 前端 E2E 测试 (可视化)
pnpm --filter @olora/web test:e2e --ui
```

### Git 命令
```bash
# 查看状态
git status

# 查看最近提交
git log --oneline -10

# 提交 + 推送 (标准流程)
git add .
git commit -m "feat: F001 功能名称"
git push origin main

# 查看差异
git diff
```

---

## 开始工作 (每次对话必读)

### 对于新 AI 对话

1. **读取本文件**:
```bash
cat olora/CLAUDE.md
```

2. **查看功能清单**:
```bash
cat olora/feature_list.json | jq '.features[] | select(.implemented == false) | {id, name, priority}' | head -20
```

3. **查看最近进度**:
```bash
tail -100 olora/progress.md
```

4. **查看 Git 状态**:
```bash
git log --oneline -10
git status
```

5. **确认开发环境**:
```bash
# 检查 Docker 服务
docker-compose ps

# 检查依赖安装
pnpm list --depth=0
```

6. **找到下一个功能**:
- 从 `feature_list.json` 中找到第一个 `implemented: false` 的功能
- 按 `priority` 排序
- 确认 `phase` 符合当前阶段

7. **开始实现**:
- 阅读功能的 `description` 和 `test_steps`
- 实现后端 → 实现前端 → 测试 → 提交

---

## 故障恢复

### 如果测试失败
1. **不要标记功能为完成**
2. **分析失败原因** (查看测试输出、日志)
3. **修复代码**
4. **重新运行测试**
5. **在 progress.md 记录问题和解决方案**

### 如果需要回滚
```bash
# 查看历史提交
git log --oneline -10

# 回滚到上一个成功的提交
git reset --hard <commit-hash>

# 强制推送 (谨慎使用)
git push origin main --force
```

### 如果 Docker 服务异常
```bash
# 重启所有服务
docker-compose down
docker-compose up -d

# 清理并重启 (会删除数据)
docker-compose down -v
docker-compose up -d
```

---

## 最后提醒

**每次对话开始时**，你必须：
1. ✅ 读取 `olora/CLAUDE.md` (本文件)
2. ✅ 查看 `olora/feature_list.json` (功能清单)
3. ✅ 查看 `olora/progress.md` (最近进度)
4. ✅ 查看 Git 日志 (了解最新状态)

**每个功能完成后**，你必须：
1. ✅ 运行所有测试 (后端 + 前端 + 集成)
2. ✅ 更新 `progress.md` (详细记录)
3. ✅ 更新 `feature_list.json` (标记完成)
4. ✅ Git 提交 + 推送 (保存进度)

**核心原则**：
- 🎯 一次一个功能，不要贪多
- 🧪 测试通过才算完成
- 📝 记录详细进度
- 🔒 及时提交推送
- 🚫 不改东落西

---

*最后更新: 2026-01-17*
*版本: 1.0.0*
