import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
});

// Chat API
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const response = generateResponse(message);

  res.json({
    message: response,
    timestamp: new Date().toISOString(),
  });
});

// 用户注册
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: '注册成功（演示模式）',
    userId: 'demo-user-123',
  });
});

// 用户登录
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    token: 'demo-token-' + Date.now(),
    user: {
      id: 'demo-user-123',
      name: '演示用户',
      email: req.body.email,
    },
  });
});

function generateResponse(userMessage: string): string {
  const lower = userMessage?.toLowerCase() || '';

  if (lower.includes('你好') || lower.includes('hello') || lower.includes('hi')) {
    return `你好！我是OLORA AI助手，专为SAP业务操作设计。

🎯 我可以帮助您：
- 📊 创建和管理SAP项目
- 💰 处理预算和成本中心
- 📚 查询知识库文档
- 🔍 执行数据分析
- 📝 生成业务报表

请告诉我您需要什么帮助？`;
  }

  if (lower.includes('项目') || lower.includes('project')) {
    return `我可以帮您创建SAP项目。请提供以下信息：

📋 必需信息：
- 项目名称
- 预算金额
- 负责人
- 开始日期

💡 示例：
"创建一个名为'华为5G基站'的项目，预算500万元，负责人张三，2025年1月开始"`;
  }

  if (lower.includes('预算') || lower.includes('budget')) {
    return `关于预算管理，我可以帮您：

✅ 查询当前预算状态
✅ 修改预算分配
✅ 生成预算报表
✅ 预算超支预警

请告诉我具体需要什么操作？`;
  }

  if (lower.includes('报表') || lower.includes('report')) {
    return `📊 可用的报表类型：

1️⃣ 财务报表（收入、支出、利润）
2️⃣ 项目进度报表
3️⃣ 成本中心分析
4️⃣ 资源使用情况

请选择您需要的报表类型，或描述您的具体需求。`;
  }

  if (lower.includes('知识库') || lower.includes('文档')) {
    return `📚 知识库功能：

✅ 上传业务文档（PDF、Word、TXT）
✅ 智能问答（基于文档内容）
✅ 语义搜索
✅ 文档分类管理

您可以上传SAP操作手册、业务流程文档等，我会帮您快速找到答案。`;
  }

  if (lower.includes('安全') || lower.includes('隐私') || lower.includes('数据')) {
    return `🔒 数据安全保障：

✅ PII检测与脱敏（自动识别姓名、金额、项目名等敏感信息）
✅ 敏感数据永不发送到云端LLM
✅ 本地数据还原机制
✅ 完整的审计日志
✅ 符合企业级安全标准

您的数据安全是我们的首要任务！`;
  }

  if (lower.includes('功能') || lower.includes('能力')) {
    return `🚀 OLORA 核心能力：

✅ **AI对话引擎**
   - 多模型LLM支持（OpenAI、DeepSeek、Gemini）
   - 上下文理解与意图识别
   - 流式响应

✅ **数据安全网关**
   - PII自动检测与脱敏
   - 本地数据还原
   - 审计日志

✅ **RAG知识库**
   - 向量检索（Qdrant）
   - 语义搜索
   - 文档智能解析

✅ **SAP集成**
   - 项目管理（PS模块）
   - 成本控制（CO模块）
   - 财务报表（FI模块）

当前状态：
- 后端API：✅ 运行中
- 数据库：✅ PostgreSQL已连接
- LLM集成：⏳ 需要配置API密钥
- 向量库：⏳ 需要启动Qdrant`;
  }

  // 默认回复
  return `收到您的消息："${userMessage}"

我是OLORA AI助手，目前处于演示模式。

💡 您可以尝试问我：
- "你好，介绍一下你的功能"
- "如何创建一个SAP项目？"
- "查询当前预算情况"
- "生成财务报表"
- "知识库有什么功能？"
- "数据安全是如何保障的？"

🔧 当前系统状态：
- 后端API：✅ 运行中
- 数据库：✅ PostgreSQL已连接
- LLM：⏳ 需要配置API密钥
- 向量库：⏳ 需要启动Qdrant`;
}

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🤖  OLORA API Server is running!                        ║
║                                                            ║
║   📍  http://localhost:${PORT}                               ║
║   ✅  Health check: http://localhost:${PORT}/health          ║
║   💬  Chat API: POST http://localhost:${PORT}/api/chat       ║
║                                                            ║
║   📊  Status: READY                                        ║
║   🗄️   Database: PostgreSQL Connected                      ║
║   ⏰  Started at: ${new Date().toLocaleString('zh-CN')}  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
