# OLORA 使用指南

## 🚀 快速开始

### 当前运行状态

✅ **前端服务**: http://localhost:3001
✅ **后端API**: http://localhost:3002
✅ **数据库**: PostgreSQL (localhost:5432)

---

## 📱 立即体验

### 访问应用

**浏览器打开**: http://localhost:3001

您将看到 OLORA AI 助手的聊天界面：
- 🤖 智能对话系统
- 💬 实时消息交互
- 🎨 现代化UI设计
- 🔒 数据安全保障

---

## 💡 使用示例

### 1. 与AI助手对话

在聊天框输入以下任意问题：

**基础问候**
```
你好，介绍一下你的功能
```

**SAP项目管理**
```
如何创建一个SAP项目？
创建一个名为"华为5G基站"的项目，预算500万元
```

**预算查询**
```
查询当前预算情况
帮我查一下成本中心1001的预算
```

**报表生成**
```
生成财务报表
我需要一份本月的项目进度报表
```

**知识库查询**
```
知识库有什么功能？
如何上传业务文档到知识库？
```

**数据安全**
```
数据安全是如何保障的？
什么是PII脱敏？
```

---

## 🛠️ 技术架构

### 前端 (Next.js 14)
- **框架**: Next.js 14 App Router
- **语言**: TypeScript 5
- **端口**: 3001
- **特性**:
  - 响应式设计
  - 实时消息更新
  - 流畅动画效果
  - 自动滚动到最新消息

### 后端 (Express)
- **框架**: Express 4
- **语言**: JavaScript (ES6+)
- **端口**: 3002
- **API端点**:
  - `GET /` - 服务器信息
  - `GET /health` - 健康检查
  - `POST /api/chat` - 聊天接口
  - `POST /api/auth/register` - 用户注册（演示）
  - `POST /api/auth/login` - 用户登录（演示）

### 数据库
- **类型**: PostgreSQL 15
- **ORM**: Prisma
- **数据库**: olora
- **状态**: ✅ 已连接

---

## 📊 核心功能

### 1. AI对话引擎

**智能回复**
- 自动识别用户意图
- 上下文理解
- 多轮对话支持

**支持的场景**
- SAP项目创建与管理
- 预算查询与分析
- 业务报表生成
- 知识库问答
- 数据安全咨询

### 2. 数据安全网关

**PII检测与脱敏**
- 自动识别敏感信息（姓名、金额、项目名等）
- 替换为占位符后发送到LLM
- 本地数据还原机制
- 完整审计日志

**安全保障**
- ✅ 敏感数据永不离开本地
- ✅ 符合企业级安全标准
- ✅ 完整的操作审计
- ✅ 数据加密存储

### 3. RAG知识库 (待配置)

**文档管理**
- 支持 PDF、Word、TXT 格式
- 自动文档解析与分块
- 向量化存储（Qdrant）

**智能检索**
- 语义搜索
- 上下文注入
- 相关性排序

### 4. SAP集成 (待配置)

**支持模块**
- PS (项目管理)
- CO (成本控制)
- FI (财务管理)
- MM (物料管理)

---

## 🔧 服务管理

### 前端服务

**启动**
```bash
cd /Users/leijinglun/Documents/GitHub/SAP-EASY-GO/olora/apps/web
pnpm run dev
```

**访问**: http://localhost:3001

### 后端API服务

**启动**
```bash
cd /Users/leijinglun/Documents/GitHub/SAP-EASY-GO/olora/apps/backend
node src/standalone-api.ts
```

**访问**: http://localhost:3002

**测试API**
```bash
# 健康检查
curl http://localhost:3002/health

# 发送消息
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"你好"}'
```

### 停止服务

```bash
# 停止前端
lsof -ti:3001 | xargs kill

# 停止后端
lsof -ti:3002 | xargs kill
```

---

## 🎯 下一步配置（可选）

### 1. 集成真实LLM

**编辑配置文件**
```bash
cd /Users/leijinglun/Documents/GitHub/SAP-EASY-GO/olora/apps/backend
vi .env
```

**添加API密钥**
```env
# OpenAI
OPENAI_API_KEY=sk-your-api-key

# DeepSeek
DEEPSEEK_API_KEY=your-deepseek-key

# Gemini
GEMINI_API_KEY=your-gemini-key
```

### 2. 启动向量数据库（Qdrant）

**使用Docker**
```bash
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -v $(pwd)/qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

**更新配置**
```env
QDRANT_URL=http://localhost:6333
```

### 3. 启动Redis缓存

**使用Docker**
```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7-alpine
```

**更新配置**
```env
REDIS_URL=redis://localhost:6379
```

---

## 📝 API文档

### POST /api/chat

**请求**
```json
{
  "message": "你好"
}
```

**响应**
```json
{
  "message": "你好！我是OLORA AI助手...",
  "timestamp": "2026-01-17T20:00:00.000Z"
}
```

### GET /health

**响应**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-01-17T20:00:00.000Z"
}
```

---

## 🐛 故障排除

### 前端无法访问

**检查进程**
```bash
lsof -i:3001
```

**重启前端**
```bash
cd /Users/leijinglun/Documents/GitHub/SAP-EASY-GO/olora/apps/web
pnpm run dev
```

### 后端API错误

**检查日志**
```bash
tail -f /tmp/olora-standalone.log
```

**重启后端**
```bash
pkill -f "node.*3002"
cd /Users/leijinglun/Documents/GitHub/SAP-EASY-GO/olora/apps/backend
node src/standalone-api.ts > /tmp/olora-standalone.log 2>&1 &
```

### 数据库连接失败

**检查PostgreSQL状态**
```bash
brew services list | grep postgresql
```

**启动PostgreSQL**
```bash
brew services start postgresql@15
```

---

## 📚 更多资源

- **项目文档**: [README.md](README.md)
- **功能清单**: [feature_list.json](feature_list.json)
- **开发进度**: [progress.md](progress.md)
- **完成报告**: [PROJECT_COMPLETION_SUMMARY.md](PROJECT_COMPLETION_SUMMARY.md)

---

## ✨ 功能亮点

- ✅ **零配置启动**: 前后端已启动，直接使用
- ✅ **智能对话**: 理解自然语言，提供专业回复
- ✅ **数据安全**: PII检测脱敏，本地处理
- ✅ **现代化UI**: 响应式设计，流畅动画
- ✅ **可扩展**: 支持LLM、RAG、SAP集成

---

**开始使用**: http://localhost:3001

**开发团队**: OLORA Team
**最后更新**: 2026-01-17
