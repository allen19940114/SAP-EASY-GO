# SAP EASY GO (OLORA)

> **Enterprise AI Agent for SAP Business Operations**
>
> 基于 Boris Cherny 并行开发工作流重构 | 支持 1-15 个 Claude 实例同时工作

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

---

## 📖 项目概述

**SAP EASY GO** (代号 OLORA) 是一个企业级 SAP 智能助手,通过自然语言对话帮助用户完成 SAP 业务操作。系统集成了知识库管理 (RAG)、统一动作执行引擎、数据安全网关和智能分析能力。

### 核心特性

- 🤖 **AI 对话 & 知识库 (RAG)** - 自然语言交互、意图识别、知识库管理、反幻觉机制
- ⚡ **动作执行引擎** - 统一 `action_id + payload` 执行路由、权限验证、审计追踪
- 📊 **报表模板 & BI** - 模板报表、BI 仪表盘、可视化摘要、数据溯源
- 🔌 **接口管理** - 订阅授权、字段规则、扩展字段、接口版本管理
- 🔒 **数据安全网关** - PII 检测、数据脱敏/还原、敏感数据不出企业

---

## 🏗️ 技术架构

### 五层架构设计

```
① 交互层 (Next.js)      - 对话 UI、知识管理、接口管理
         ↓
② 智能层 (NestJS)       - 意图识别、规划、推理、数据安全网关
         ↓
③ 能力层                - SAP 适配器、文档服务、邮件、RPA、BI
         ↓
④ 治理层                - 权限管理、风险控制、审批流、审计日志
         ↓
⑤ 记录系统              - SAP S/4HANA、PostgreSQL、Redis、Qdrant
```

### 技术栈

#### 后端
```
框架: NestJS 10 + TypeScript 5
数据库: PostgreSQL 16 (Prisma ORM)
缓存: Redis 7.2
向量库: Qdrant 1.7 (RAG)
LLM: OpenAI GPT-4 / DeepSeek / Gemini (支持动态切换)
认证: JWT
```

#### 前端
```
框架: Next.js 14 + React 18
UI: Ant Design 5 / Shadcn/ui
状态: Zustand
实时: Socket.IO
图表: Recharts
```

#### 开发工具
```
包管理: pnpm + Turborepo (Monorepo)
代码质量: ESLint + Prettier + Husky
测试: Jest (后端) + Playwright (前端 E2E)
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+
- (可选) Qdrant 向量数据库

### 安装步骤

#### 1. 克隆仓库
```bash
git clone https://github.com/your-org/SAP-EASY-GO.git
cd SAP-EASY-GO
```

#### 2. 安装依赖
```bash
# 进入主项目目录
cd olora

# 安装所有依赖 (Turborepo 会自动处理 Monorepo)
pnpm install
```

#### 3. 配置环境变量
```bash
# 复制示例配置
cp .env.example .env

# 编辑 .env 文件,配置以下关键参数:
# - DATABASE_URL: PostgreSQL 连接字符串
# - REDIS_URL: Redis 连接字符串
# - JWT_SECRET: JWT 密钥 (至少 32 字符)
# - OPENAI_API_KEY: OpenAI API 密钥 (可选)
```

#### 4. 启动基础设施服务
```bash
# 启动 PostgreSQL + Redis + Qdrant
docker-compose up -d

# 等待服务启动完成
docker-compose ps
```

#### 5. 初始化数据库
```bash
# 进入后端目录
cd apps/backend

# 运行数据库迁移
npx prisma migrate dev

# 生成 Prisma Client
npx prisma generate

# (可选) 打开 Prisma Studio 查看数据库
npx prisma studio
```

#### 6. 启动开发服务器
```bash
# 返回 olora 根目录
cd ../..

# 启动所有服务 (Turborepo 并行启动)
pnpm dev

# 或者分别启动:
# 终端 1 - 后端
pnpm --filter @olora/backend dev

# 终端 2 - 前端
pnpm --filter @olora/web dev
```

#### 7. 访问应用
- 前端: http://localhost:3001
- 后端 API: http://localhost:3000
- API 文档: http://localhost:3000/api/docs
- Qdrant 控制台: http://localhost:6333/dashboard
- Prisma Studio: http://localhost:5555

---

## 📂 项目结构

```
SAP-EASY-GO/
├── CLAUDE.md                    ⭐ Claude AI 记忆系统 (核心开发指南)
├── TASKS.json                   ⭐ 并行任务清单 (支持 1-15 个 Claude 实例)
├── README.md                    # 本文件
│
├── .automate/                   ⭐ 自动化脚本
│   ├── verify.sh                # 代码验证脚本 (类型/测试/构建)
│   ├── parallel-test.sh         # 并行测试脚本
│   └── logs/                    # 测试日志
│
├── docs/                        # 文档
│   ├── guides/                  # 使用指南
│   │   ├── QUICK_START_GUIDE.md
│   │   ├── OLORA_ARCHITECTURE.md
│   │   └── FRONTEND_TEST_GUIDE.md
│   └── archive/                 # 历史文档归档
│
└── olora/                       # 主项目 (Monorepo)
    ├── apps/
    │   ├── backend/             # NestJS 后端
    │   │   ├── src/
    │   │   │   ├── modules/     # 功能模块
    │   │   │   │   ├── auth/    # 认证
    │   │   │   │   ├── user/    # 用户管理
    │   │   │   │   ├── chat/    # 对话管理
    │   │   │   │   ├── rag/     # RAG 知识库
    │   │   │   │   ├── action/  # 动作执行引擎
    │   │   │   │   ├── security/ # 数据安全网关
    │   │   │   │   ├── sap/     # SAP 集成
    │   │   │   │   ├── template/ # 报表模板
    │   │   │   │   ├── interface/ # 接口管理
    │   │   │   │   └── audit/   # 审计日志
    │   │   │   ├── services/    # 业务服务
    │   │   │   ├── shared/      # 共享模块
    │   │   │   └── standalone-api.ts
    │   │   ├── prisma/
    │   │   │   └── schema.prisma # 数据库模型
    │   │   └── test/            # E2E 测试
    │   │
    │   └── web/                 # Next.js 前端
    │       ├── app/
    │       │   ├── page.tsx     # 对话界面 (主入口)
    │       │   ├── knowledge/   # 知识库管理
    │       │   ├── reports/     # 报表中心
    │       │   ├── settings/    # 系统设置
    │       │   └── mail/        # 邮件管理
    │       ├── components/      # React 组件
    │       ├── config/
    │       │   └── env.ts       # 环境配置
    │       ├── stores/          # Zustand 状态管理
    │       └── tests/
    │           └── e2e/         # Playwright E2E 测试
    │
    ├── packages/                # 共享包
    │   ├── types/               # 类型定义
    │   └── config/              # 共享配置
    │
    ├── docker-compose.yml       # Docker 服务
    ├── pnpm-workspace.yaml      # pnpm Monorepo 配置
    └── turbo.json               # Turborepo 配置
```

---

## 🧪 测试

### 运行测试

```bash
# 快速验证 (类型检查 + ESLint + Prettier)
./.automate/verify.sh --fast

# 完整验证 (包含单元测试和构建)
./.automate/verify.sh --full

# 并行测试 (5 个任务并行执行)
./.automate/parallel-test.sh
```

### 手动运行测试

```bash
# 后端单元测试
cd olora
pnpm --filter @olora/backend test

# 后端测试覆盖率
pnpm --filter @olora/backend test:cov

# 前端 E2E 测试
pnpm --filter @olora/web test:e2e

# 前端 E2E 测试 (可视化模式)
pnpm --filter @olora/web test:e2e --ui

# 代码质量检查
pnpm lint
pnpm format
```

---

## 🛠️ 开发

### Boris Cherny 并行工作流

本项目采用 Anthropic Claude Code 负责人 Boris Cherny 的并行开发工作流:

- **极致并行**: 支持 1-15 个 Claude 实例同时工作
- **任务清单**: [TASKS.json](TASKS.json) 管理并行任务
- **记忆系统**: [CLAUDE.md](CLAUDE.md) 记录所有错误和规则
- **自动验证**: 每个变更自动运行测试

### 开发者指南

```bash
# 1. 阅读 Claude 开发指南
cat CLAUDE.md

# 2. 查看待办任务
cat TASKS.json | jq '.task_pools'

# 3. 运行自动化验证
./.automate/verify.sh --fast

# 4. 提交代码 (遵循约定式提交)
git add .
git commit -m "feat: 功能描述"
git push origin main
```

### 数据库管理

```bash
cd olora/apps/backend

# 创建新迁移
npx prisma migrate dev --name your_migration_name

# 重置数据库 (⚠️ 删除所有数据)
npx prisma migrate reset

# 打开 Prisma Studio
npx prisma studio
```

---

## 📊 核心功能流程

### 场景 1: 从模板生成月度报表

**用户输入**: "生成 2026 年 1 月的月度经营报表,公司代码 1000,利润中心 A01"

**执行流程**:
```
1. 意图识别: REPORT_TEMPLATE_RUN
2. 参数提取: template_id, period, company_code, profit_center
3. 知识库查询: 获取模板口径文档
4. 生成 Action: action_id: RPT_TEMPLATE_RUN
5. 调用 ABAP 函数: Z_OLORA_EXECUTE_ACTION
6. 数据获取: 收入/成本/费用/库存
7. 填充模板: Excel/CSV
8. 返回结果: 文件 + 关键指标 + 数据溯源
9. 审计日志
```

### 场景 2: 对话式分析

**用户输入**: "为什么本月毛利下降?我们看一下 A 事业部的情况"

**执行流程**:
```
1. 意图识别: ANALYSIS_RUN
2. 明确维度: 期间、事业部、毛利口径
3. 知识库查询: 毛利计算公式
4. 生成 Action 组: GM 桥接分析、分段收入、分段COGS、采购价格趋势
5. 调用 ABAP 函数 (批量)
6. 归因分析: TOP 贡献因子
7. 预警判断: 阈值触发
8. 返回结果: 结论 + 证据 + 建议
9. 审计日志
```

### 场景 3: 数据变更操作

**用户输入**: "将项目 P-1001 中的 WBS 1.2 的开始/结束日期延长两周"

**执行流程**:
```
1. 意图识别: DATA_CHANGE (WBS)
2. 生成变更草稿: 字段、旧值、新值、影响范围、风险警告
3. 用户确认: 显示变更卡片
4. 权限检查: SAP 授权检查
5. 生成 Action: action_id: PS_WBS_CHANGE
6. 调用 ABAP 函数: 内部调用 BAPI_BUS2054_CHANGE_MULTI
7. 返回结果: 成功/失败 + 消息
8. 审计日志
```

---

## 🔒 安全与合规

### 数据分类

- **L1 (公开)**: 操作类型、通用术语 → 可发送至云端 LLM
- **L2 (内部)**: 项目名称、部门名称 → 脱敏后发送
- **L3 (机密)**: 合同金额、客户名称 → 仅本地处理
- **L4 (秘密)**: 密码、API 密钥 → 加密存储,不处理

### 数据脱敏流程

```
用户输入 → PII 检测 → 替换为占位符 → 存储映射 (Redis) → 发送至云端 LLM
                                                                    ↓
                            返回真实数据 ← 从映射还原 ← LLM 响应
```

---

## 🚢 生产部署

### 构建生产版本

```bash
cd olora

# 后端构建
pnpm --filter @olora/backend build
pnpm --filter @olora/backend start:prod

# 前端构建
pnpm --filter @olora/web build
pnpm --filter @olora/web start
```

### Docker 部署

```bash
# 构建镜像
docker-compose -f docker-compose.prod.yml build

# 启动所有服务
docker-compose -f docker-compose.prod.yml up -d
```

### 环境检查清单

查看 [CLAUDE.md - 生产部署检查清单](CLAUDE.md#-生产部署检查清单) 获取完整配置要求。

---

## 📚 文档

- **快速开始**: [docs/guides/QUICK_START_GUIDE.md](docs/guides/QUICK_START_GUIDE.md)
- **架构设计**: [docs/guides/OLORA_ARCHITECTURE.md](docs/guides/OLORA_ARCHITECTURE.md)
- **前端测试**: [docs/guides/FRONTEND_TEST_GUIDE.md](docs/guides/FRONTEND_TEST_GUIDE.md)
- **Claude 开发指南**: [CLAUDE.md](CLAUDE.md) ⭐
- **并行任务清单**: [TASKS.json](TASKS.json) ⭐
- **API 文档**: http://localhost:3000/api/docs (后端运行时)

---

## 🤝 贡献

本项目采用 **Boris Cherny 并行工作流**,支持 1-15 个 Claude AI 实例同时开发。

贡献前请:
1. 阅读 [CLAUDE.md](CLAUDE.md) 了解开发规范
2. 查看 [TASKS.json](TASKS.json) 选择任务
3. 运行 `./.automate/verify.sh --full` 验证代码
4. 遵循约定式提交规范

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

---

## 💬 支持

- **GitHub Issues**: https://github.com/your-org/SAP-EASY-GO/issues
- **文档**: https://docs.sap-easy-go.com
- **Email**: support@sap-easy-go.com

---

## 🎯 项目状态

### ✅ 已完成
- 统一环境配置管理
- 真实用户认证系统 (JWT + bcrypt)
- Excel 报表导出功能
- 前后端类型共享

### ⚠️ 演示模式 (待完成)
- 报表数据源 (需接入 PostgreSQL + SAP API)
- SAP 操作执行 (需调用真实 BAPI)
- 权限验证系统 (需调用 SAP Authorization API)

### 🚧 进行中
查看 [TASKS.json](TASKS.json) 获取详细任务列表和进度。

---

**基于 Boris Cherny 并行工作流构建** ⚡️
**支持 1-15 个 Claude 实例同时开发** 🤖
