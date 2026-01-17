# 前端测试指南

## 🚀 服务已启动

### 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| **前端** | http://localhost:3001 | Next.js 前端应用 |
| **后端** | http://localhost:3000 | NestJS 后端 API |
| **Swagger文档** | http://localhost:3000/api | API 文档 |

---

## 📝 测试步骤

### 1. 打开浏览器访问前端

```
http://localhost:3001
```

### 2. 测试用户注册

1. 访问注册页面: http://localhost:3001/register
2. 填写信息:
   - Email: test@example.com
   - Password: Test123456
   - Name: 测试用户
3. 点击「注册」按钮
4. 成功后会跳转到登录页面

### 3. 测试用户登录

1. 访问登录页面: http://localhost:3001/login
2. 输入注册的账号:
   - Email: test@example.com
   - Password: Test123456
3. 点击「登录」按钮
4. 成功后会跳转到聊天页面

### 4. 测试聊天功能

1. 登录成功后自动进入聊天页面: http://localhost:3001/chat
2. 在输入框输入消息，例如: "你好"
3. 点击「Send」按钮
4. 观察 WebSocket 实时响应 (需要配置 LLM API Key)

---

## ⚙️ 环境变量配置

如果要测试 LLM 功能，需要配置 API Key:

```bash
cd /Users/leijinglun/Documents/GitHub/SAP-EASY-GO/olora
cp .env.example .env
```

编辑 `.env` 文件，添加你的 API Key:

```env
# OpenAI
OPENAI_API_KEY="sk-your-openai-key"

# 或使用 DeepSeek
DEEPSEEK_API_KEY="sk-your-deepseek-key"
LLM_PROVIDER="deepseek"

# 或使用 Gemini
GEMINI_API_KEY="your-gemini-key"
LLM_PROVIDER="gemini"
```

配置后重启后端:

```bash
# 停止后端
pkill -f "pnpm.*dev"

# 重新启动
pnpm run dev
```

---

## 🔍 测试功能清单

### 基础功能
- [ ] 用户注册
- [ ] 用户登录
- [ ] 创建聊天会话
- [ ] 发送消息
- [ ] 查看消息历史

### 高级功能 (需要配置 API Key)
- [ ] LLM 对话 (OpenAI/DeepSeek/Gemini)
- [ ] WebSocket 实时流式响应
- [ ] 知识库文档上传
- [ ] 语义搜索
- [ ] Action 执行

---

## 🛠️ 常用命令

### 查看服务状态
```bash
# 查看前端日志
tail -f /private/tmp/claude/-Users-leijinglun-Documents-GitHub-SAP-EASY-GO/tasks/b91274d.output

# 查看后端日志
tail -f /private/tmp/claude/-Users-leijinglun-Documents-GitHub-SAP-EASY-GO/tasks/b6504de.output
```

### 重启服务
```bash
# 停止所有服务
pkill -f "pnpm.*dev"

# 重新启动 (在项目根目录)
cd /Users/leijinglun/Documents/GitHub/SAP-EASY-GO/olora
pnpm run dev
```

### 停止服务
```bash
# 停止前端和后端
pkill -f "pnpm.*dev"

# 停止数据库
docker-compose down
```

---

## 📱 前端页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 项目介绍 |
| `/register` | 注册页面 | 用户注册 |
| `/login` | 登录页面 | 用户登录 |
| `/chat` | 聊天页面 | AI 对话界面 |

---

## 🐛 问题排查

### 1. 前端无法访问？

检查端口是否被占用:
```bash
lsof -ti:3001
```

如果被占用，杀掉进程:
```bash
kill -9 $(lsof -ti:3001)
```

### 2. 后端 API 报错？

检查数据库是否启动:
```bash
docker-compose ps
```

如果未启动:
```bash
docker-compose up -d postgres redis qdrant
```

### 3. LLM 无响应？

确认环境变量配置:
```bash
cat /Users/leijinglun/Documents/GitHub/SAP-EASY-GO/olora/.env | grep API_KEY
```

### 4. WebSocket 连接失败？

检查后端是否正常运行:
```bash
curl http://localhost:3000/api/health
```

---

## 🎯 快速测试脚本

创建一个测试用户并登录:

```bash
# 注册用户
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "name": "测试用户"
  }'

# 登录获取 Token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

---

**当前状态**:
- ✅ 数据库已启动 (PostgreSQL, Redis, Qdrant)
- ✅ 前端已启动 (http://localhost:3001)
- ⏳ 后端正在启动中 (http://localhost:3000)

请在浏览器打开 **http://localhost:3001** 开始测试！
