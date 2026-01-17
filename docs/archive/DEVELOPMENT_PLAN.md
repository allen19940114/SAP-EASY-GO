# OLORA 开发计划 (Step-by-Step)

> 基于 feature_list.json 的 32 个功能模块，制定严格的分步执行计划

**项目目标**: 企业级 SAP AI Agent 系统
**总功能数**: 32 个
**开发周期**: 9 个 Phase
**当前状态**: Phase 0 - 架构搭建阶段

---

## Phase 0: 基础架构搭建 (必须先完成)

> **目标**: 搭建完整的开发环境和项目骨架，确保后续功能开发无阻碍

### Step 0.1: Monorepo 初始化 ✅ (准备中)

**任务清单**:
```bash
□ 初始化 pnpm workspace
□ 配置 Turborepo
□ 创建 apps/backend 目录结构
□ 创建 apps/web 目录结构
□ 创建 packages/types 共享包
□ 创建 packages/config 共享配置
```

**产出文件**:
- `pnpm-workspace.yaml`
- `turbo.json`
- `package.json` (root)
- `apps/backend/package.json`
- `apps/web/package.json`
- `packages/types/package.json`
- `packages/config/package.json`

**验证标准**:
```bash
✓ pnpm install 成功
✓ pnpm dev 可以同时启动所有项目
✓ 依赖安装无错误
```

---

### Step 0.2: 后端基础框架 (NestJS)

**任务清单**:
```bash
□ 创建 NestJS 应用 (main.ts, app.module.ts)
□ 配置 TypeScript (tsconfig.json)
□ 添加健康检查端点 (/api/health)
□ 配置环境变量 (@nestjs/config)
□ 集成 Swagger 文档
□ 配置全局异常过滤器
□ 配置全局验证管道 (class-validator)
```

**产出文件**:
- `apps/backend/src/main.ts`
- `apps/backend/src/app.module.ts`
- `apps/backend/src/app.controller.ts`
- `apps/backend/src/app.service.ts`
- `apps/backend/tsconfig.json`
- `apps/backend/.env.example`
- `apps/backend/src/common/filters/http-exception.filter.ts`
- `apps/backend/src/common/pipes/validation.pipe.ts`

**验证标准**:
```bash
✓ npm run dev 启动成功，监听 3000 端口
✓ 访问 http://localhost:3000/api/health 返回 200
✓ 访问 http://localhost:3000/api/docs 显示 Swagger 文档
```

---

### Step 0.3: 前端基础框架 (Next.js)

**任务清单**:
```bash
□ 创建 Next.js 应用 (App Router)
□ 配置 TypeScript
□ 配置 Tailwind CSS
□ 初始化 Shadcn/ui
□ 创建基础布局组件 (Layout, Sidebar, Header)
□ 创建首页 (app/page.tsx)
□ 配置环境变量
```

**产出文件**:
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/tailwind.config.ts`
- `apps/web/next.config.js`
- `apps/web/tsconfig.json`
- `apps/web/.env.local.example`
- `apps/web/src/components/ui/button.tsx` (Shadcn/ui)
- `apps/web/src/components/layout/sidebar.tsx`
- `apps/web/src/components/layout/header.tsx`

**验证标准**:
```bash
✓ npm run dev 启动成功，监听 3001 端口
✓ 访问 http://localhost:3001 显示首页
✓ Tailwind CSS 样式正常
✓ Shadcn/ui 组件显示正常
```

---

### Step 0.4: 数据库初始化 (PostgreSQL + Prisma)

**任务清单**:
```bash
□ 配置 docker-compose.yml (PostgreSQL + Redis + Qdrant)
□ 创建 Prisma schema (所有数据模型)
□ 运行 Prisma migrate (生成迁移文件)
□ 生成 Prisma Client
□ 创建 PrismaService
□ 创建 PrismaModule
```

**产出文件**:
- `docker-compose.yml`
- `apps/backend/prisma/schema.prisma`
- `apps/backend/prisma/migrations/`
- `apps/backend/src/shared/prisma/prisma.service.ts`
- `apps/backend/src/shared/prisma/prisma.module.ts`

**验证标准**:
```bash
✓ docker-compose up -d 启动所有服务
✓ PostgreSQL 可连接 (localhost:5432)
✓ Redis 可连接 (localhost:6379)
✓ Qdrant 可连接 (localhost:6333)
✓ npx prisma migrate dev 成功
✓ npx prisma studio 打开数据库可视化
```

---

### Step 0.5: 代码质量工具链

**任务清单**:
```bash
□ 配置 ESLint
□ 配置 Prettier
□ 配置 Husky (Git hooks)
□ 配置 lint-staged
□ 添加 pre-commit hook (自动格式化 + lint)
```

**产出文件**:
- `.eslintrc.js`
- `.prettierrc`
- `.husky/pre-commit`
- `lint-staged.config.js`

**验证标准**:
```bash
✓ pnpm lint 检查代码无错误
✓ pnpm format 格式化代码成功
✓ git commit 触发 pre-commit hook
```

---

### Step 0.6: 测试框架配置

**任务清单**:
```bash
□ 配置 Jest (后端单元测试)
□ 配置 Playwright (前端 E2E 测试)
□ 创建测试示例文件
□ 配置测试脚本
```

**产出文件**:
- `apps/backend/jest.config.js`
- `apps/backend/test/app.e2e-spec.ts`
- `apps/web/playwright.config.ts`
- `apps/web/tests/e2e/home.spec.ts`

**验证标准**:
```bash
✓ pnpm --filter @olora/backend test 运行成功
✓ pnpm --filter @olora/web test:e2e 运行成功
```

---

### Step 0.7: 共享类型定义 (packages/types)

**任务清单**:
```bash
□ 创建 User 类型定义
□ 创建 Auth 类型定义
□ 创建 Chat 类型定义
□ 创建 Action 类型定义
□ 配置 TypeScript 构建
□ 导出所有类型
```

**产出文件**:
- `packages/types/src/user.types.ts`
- `packages/types/src/auth.types.ts`
- `packages/types/src/chat.types.ts`
- `packages/types/src/action.types.ts`
- `packages/types/src/index.ts`
- `packages/types/tsconfig.json`
- `packages/types/package.json`

**验证标准**:
```bash
✓ 前后端可以导入共享类型
✓ TypeScript 编译无错误
```

---

## Phase 0 完成标准 (Checkpoint)

**必须全部通过才能进入 Phase 1**:

```bash
# 1. 项目启动测试
✓ pnpm install (root) - 安装所有依赖
✓ pnpm dev - 同时启动前后端
✓ 后端监听 3000 端口
✓ 前端监听 3001 端口

# 2. 健康检查
✓ curl http://localhost:3000/api/health - 返回 200
✓ curl http://localhost:3001 - 返回 HTML

# 3. 数据库连接
✓ docker-compose ps - 所有服务 running
✓ npx prisma studio - 打开数据库可视化

# 4. 代码质量
✓ pnpm lint - 无错误
✓ pnpm format - 格式化成功

# 5. 测试
✓ pnpm --filter @olora/backend test - 后端测试通过
✓ pnpm --filter @olora/web test:e2e - 前端测试通过

# 6. Git
✓ git status - 干净的工作目录
✓ 所有文件已提交并推送到远程
```

**通过后生成文件**:
- `PHASE_0_COMPLETED.md` (检查清单)
- 更新 `progress.md`
- Git commit: "chore: Phase 0 基础架构搭建完成"

---

## Phase 1: 基础框架 (4 个功能)

### F001: 项目初始化与 Monorepo 搭建 ✅
**Status**: Phase 0 已包含

### F002: 数据库设计与 Prisma 集成 ✅
**Status**: Phase 0 已包含

### F003: 用户注册与登录 (JWT 认证)
**Priority**: 3
**预估时间**: 4 小时
**前置依赖**: Phase 0 完成

**开发步骤**:
1. 后端实现 (2小时)
   - 创建 AuthModule, AuthService, AuthController
   - 实现注册逻辑 (bcrypt 加密密码)
   - 实现登录逻辑 (JWT 生成)
   - 集成 Passport JWT Strategy
   - 创建 JwtAuthGuard
   - 编写单元测试 (5个测试用例)

2. 前端实现 (1.5小时)
   - 创建注册页面 (apps/web/src/app/(auth)/register/page.tsx)
   - 创建登录页面 (apps/web/src/app/(auth)/login/page.tsx)
   - 创建 AuthStore (Zustand)
   - 创建 API Client (axios)
   - 添加表单验证

3. 测试 (0.5小时)
   - 后端测试: 5/5 通过
   - 前端测试: 4/4 通过 (Playwright)
   - 集成测试: 注册 → 登录 → 获取用户信息

4. 文档 & 提交
   - 更新 progress.md
   - 更新 feature_list.json (F003.implemented = true)
   - Git commit + push

**完成标准**:
```bash
✓ POST /api/auth/register - 201 Created
✓ POST /api/auth/login - 200 OK (返回 JWT)
✓ GET /api/users/me - 200 OK (带 JWT)
✓ 前端注册页面正常
✓ 前端登录页面正常
✓ 所有测试通过 (10/10)
```

---

### F004: SAP 账号绑定
**Priority**: 4
**预估时间**: 2 小时
**前置依赖**: F003 完成

**开发步骤**:
1. 后端实现 (1小时)
   - UserController 添加 SAP 绑定接口
   - UserService 实现绑定逻辑
   - 创建 SapBindingDto
   - 编写单元测试 (3个测试用例)

2. 前端实现 (0.5小时)
   - 创建 SAP 绑定页面
   - 创建 SAP 绑定表单组件

3. 测试 (0.5小时)
   - 后端测试: 3/3 通过
   - 前端测试: 2/2 通过
   - 集成测试: 绑定 → 查看 → 解绑

**完成标准**:
```bash
✓ POST /api/users/sap-binding - 201 Created
✓ GET /api/users/sap-binding - 200 OK
✓ DELETE /api/users/sap-binding - 200 OK
✓ 所有测试通过 (6/6)
```

---

## Phase 2: AI 对话与 RAG (7 个功能)

### F005: 对话管理 (ChatSession & Message)
**Priority**: 5
**预估时间**: 3 小时

### F006: WebSocket 实时通信
**Priority**: 6
**预估时间**: 3 小时

### F007: LLM 集成 (OpenAI GPT-4)
**Priority**: 7
**预估时间**: 4 小时

### F008: 知识库文档上传
**Priority**: 8
**预估时间**: 3 小时

### F009: 文档解析与向量化 (Qdrant)
**Priority**: 9
**预估时间**: 5 小时

### F010: 知识库语义搜索 (RAG)
**Priority**: 10
**预估时间**: 4 小时

### F011: 意图识别与参数提取
**Priority**: 11
**预估时间**: 5 小时

**Phase 2 总时间**: 约 27 小时

---

## Phase 3: 数据安全网关 (2 个功能)

### F012: PII 检测与数据脱敏
**Priority**: 12
**预估时间**: 4 小时

### F013: 数据还原引擎
**Priority**: 13
**预估时间**: 2 小时

**Phase 3 总时间**: 约 6 小时

---

## Phase 4: Action 执行引擎 (5 个功能)

### F014: Action 执行引擎
**Priority**: 14
**预估时间**: 5 小时

### F015: SAP 集成 - ABAP Function 调用
**Priority**: 15
**预估时间**: 6 小时

### F016: 权限校验 (SAP 授权检查)
**Priority**: 16
**预估时间**: 3 小时

### F017: 审计日志
**Priority**: 17
**预估时间**: 3 小时

**Phase 4 总时间**: 约 17 小时

---

## Phase 5: 报表与 BI (2 个功能)

### F018: 报表模板管理
**Priority**: 18
**预估时间**: 4 小时

### F019: 报表生成与下载
**Priority**: 19
**预估时间**: 5 小时

**Phase 5 总时间**: 约 9 小时

---

## Phase 6: 接口管理 (2 个功能)

### F020: 接口订阅管理 (企业级)
**Priority**: 20
**预估时间**: 4 小时

### F021: 字段规则与扩展字段
**Priority**: 21
**预估时间**: 4 小时

**Phase 6 总时间**: 约 8 小时

---

## Phase 7: 前端优化 (4 个功能)

### F022: UI 主题系统 (深色模式)
**Priority**: 22
**预估时间**: 2 小时

### F023: 动画与微交互 (Framer Motion)
**Priority**: 23
**预估时间**: 3 小时

### F024: 响应式布局 (移动端适配)
**Priority**: 24
**预估时间**: 4 小时

### F025: 数据可视化图表 (Recharts)
**Priority**: 25
**预估时间**: 3 小时

**Phase 7 总时间**: 约 12 小时

---

## Phase 8: 完善与优化 (3 个功能)

### F026: 错误处理与提示
**Priority**: 26
**预估时间**: 2 小时

### F027: 性能优化 (代码分割、懒加载)
**Priority**: 27
**预估时间**: 3 小时

### F028: 国际化 (i18n)
**Priority**: 28
**预估时间**: 3 小时

**Phase 8 总时间**: 约 8 小时

---

## Phase 9: 部署 (4 个功能)

### F029: 部署配置 (Docker)
**Priority**: 29
**预估时间**: 3 小时

### F030: CI/CD 流水线 (GitHub Actions)
**Priority**: 30
**预估时间**: 3 小时

### F031: 监控与日志 (可选)
**Priority**: 31
**预估时间**: 2 小时

### F032: 文档完善
**Priority**: 32
**预估时间**: 2 小时

**Phase 9 总时间**: 约 10 小时

---

## 总体时间估算

| Phase | 功能数 | 预估时间 | 状态 |
|-------|--------|---------|------|
| Phase 0 | 架构搭建 | 8 小时 | 🔄 进行中 |
| Phase 1 | 4 个 | 6 小时 | ⏳ 待开始 |
| Phase 2 | 7 个 | 27 小时 | ⏳ 待开始 |
| Phase 3 | 2 个 | 6 小时 | ⏳ 待开始 |
| Phase 4 | 5 个 | 17 小时 | ⏳ 待开始 |
| Phase 5 | 2 个 | 9 小时 | ⏳ 待开始 |
| Phase 6 | 2 个 | 8 小时 | ⏳ 待开始 |
| Phase 7 | 4 个 | 12 小时 | ⏳ 待开始 |
| Phase 8 | 3 个 | 8 小时 | ⏳ 待开始 |
| Phase 9 | 4 个 | 10 小时 | ⏳ 待开始 |
| **总计** | **32 个** | **约 111 小时** | |

---

## 开发原则 (再次强调)

### 1. 严格按顺序开发
- **Phase 0 必须 100% 完成才能进入 Phase 1**
- Phase 内部按 Priority 顺序开发
- 不允许跳过或并行开发多个功能

### 2. 每个功能必须完整测试
```bash
后端测试 (Jest)
    ↓ 通过
前端测试 (Playwright)
    ↓ 通过
集成测试 (手动验证)
    ↓ 通过
更新 progress.md + feature_list.json
    ↓
Git commit + push
```

### 3. 不改东落西
- 已完成功能不再修改 (除非 bug 修复)
- 新功能不影响旧功能
- 回归测试保证功能完整性

### 4. 前后端类型共享
- 所有类型定义在 `packages/types`
- 前后端导入同一类型
- 禁止使用 `any` 类型

---

## 下一步行动

**立即开始**: Phase 0 - Step 0.1 (Monorepo 初始化)

**执行命令**:
```bash
# 1. 读取开发计划
cat olora/DEVELOPMENT_PLAN.md

# 2. 开始 Phase 0
# (AI Agent 开始实现 Step 0.1)
```

---

*最后更新: 2026-01-17*
*总功能数: 32*
*当前进度: 0/32 (0%)*
