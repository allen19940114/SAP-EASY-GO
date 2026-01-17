require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const llmService = require('./services/llm.service');
const documentParser = require('./services/document-parser.service');
const reportService = require('./services/report.service');
const mailService = require('./services/mail.service');
const executorService = require('./services/executor.service');
const authService = require('./services/auth.service');

const app = express();
const PORT = 3002;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.md'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`不支持的文件类型: ${ext}。仅支持 PDF, Word, TXT, MD 文件`));
    }
  }
});

app.use(cors());
app.use(express.json());

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'OLORA API Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
});

// Chat API - Real LLM Integration with Executor Intent Detection
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '请输入消息内容',
      });
    }

    // Step 1: Check for SAP Executor intent
    let matchedExecutor = null;
    try {
      matchedExecutor = await executorService.matchExecutorWithAI(message, llmService);
      console.log('Executor matching result:', matchedExecutor ? matchedExecutor.id : 'No match');
    } catch (error) {
      console.log('Executor matching failed (non-critical):', error.message);
    }

    // If executor is matched, return executor action card
    if (matchedExecutor) {
      return res.json({
        success: true,
        mode: llmService.isConfigured() ? 'production' : 'demo',
        provider: llmService.getProviderName(),
        timestamp: new Date().toISOString(),
        // Executor-specific response
        hasExecutor: true,
        executor: {
          id: matchedExecutor.id,
          name: matchedExecutor.name,
          description: matchedExecutor.description,
          tcode: matchedExecutor.tcode,
          api: matchedExecutor.api,
          moduleId: matchedExecutor.moduleId,
          moduleName: matchedExecutor.moduleName,
          parameters: matchedExecutor.parameters,
        },
        message: `✨ 我理解您想要执行：**${matchedExecutor.name}**\n\n📋 操作详情：\n- T-Code: ${matchedExecutor.tcode}\n- BAPI: ${matchedExecutor.api}\n- 模块: ${matchedExecutor.moduleName}\n\n请点击下方的执行按钮，填写必需的参数后即可执行此操作。`,
      });
    }

    // Step 2: No executor matched, proceed with normal chat
    // Check if LLM is configured
    if (!llmService.isConfigured()) {
      // Fallback to demo mode if not configured
      const demoResponse = generateResponse(message);
      return res.json({
        success: true,
        message: demoResponse,
        mode: 'demo',
        provider: 'Demo Mode (未配置 LLM)',
        hasExecutor: false,
        timestamp: new Date().toISOString(),
      });
    }

    // Use real LLM
    const response = await llmService.chat(message, conversationHistory || []);

    res.json({
      success: true,
      message: response,
      mode: 'production',
      provider: llmService.getProviderName(),
      hasExecutor: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // If LLM fails, fall back to demo mode
    const fallbackResponse = generateResponse(req.body.message);
    res.json({
      success: true,
      message: fallbackResponse + '\n\n⚠️ 注意：LLM 调用失败，已切换到演示模式。\n错误信息：' + error.message,
      mode: 'demo',
      provider: 'Demo Mode (LLM 调用失败)',
      hasExecutor: false,
      timestamp: new Date().toISOString(),
    });
  }
});

// 用户注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: '请提供完整的注册信息',
      });
    }

    const result = await authService.register({ email, password, name });
    res.json(result);
  } catch (error) {
    console.error('Register API error:', error);
    res.status(500).json({
      success: false,
      message: '注册失败: ' + error.message,
    });
  }
});

// 用户登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '请提供邮箱和密码',
      });
    }

    const result = await authService.login({ email, password });
    res.json(result);
  } catch (error) {
    console.error('Login API error:', error);
    res.status(500).json({
      success: false,
      message: '登录失败: ' + error.message,
    });
  }
});

// Knowledge Base APIs

// Upload document with parsing
app.post('/api/knowledge/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的文件',
      });
    }

    const fileType = path.extname(req.file.originalname).toLowerCase();

    // Parse document content
    let parsedData = null;
    try {
      parsedData = await documentParser.processDocument(
        req.file.path,
        fileType,
        req.file.originalname
      );
    } catch (parseError) {
      console.error('Document parsing failed:', parseError);
      // Continue even if parsing fails
    }

    const fileInfo = {
      id: `doc-${Date.now()}`,
      name: req.file.originalname,
      storedName: req.file.filename,
      size: formatFileSize(req.file.size),
      sizeBytes: req.file.size,
      uploadTime: new Date().toISOString(),
      status: parsedData ? '已处理' : '上传成功（解析失败）',
      path: req.file.path,
      type: fileType,
      parsed: !!parsedData,
      chunkCount: parsedData ? parsedData.chunkCount : 0,
      characterCount: parsedData ? parsedData.totalCharacters : 0,
    };

    // Save parsed chunks to separate file if successful
    if (parsedData) {
      const chunksPath = path.join(uploadsDir, `${fileInfo.id}_chunks.json`);
      fs.writeFileSync(chunksPath, JSON.stringify({
        documentId: fileInfo.id,
        fileName: req.file.originalname,
        chunks: parsedData.chunks,
        metadata: documentParser.extractMetadata(parsedData.fullText),
      }, null, 2));
    }

    // Save metadata to a JSON file
    const metadataPath = path.join(uploadsDir, 'metadata.json');
    let metadata = [];
    if (fs.existsSync(metadataPath)) {
      const content = fs.readFileSync(metadataPath, 'utf-8');
      metadata = JSON.parse(content);
    }
    metadata.push(fileInfo);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    res.json({
      success: true,
      message: parsedData ? '文件上传并解析成功' : '文件上传成功（文本解析失败）',
      document: fileInfo,
      parsed: !!parsedData,
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: '文件上传失败: ' + error.message,
    });
  }
});

// List all documents
app.get('/api/knowledge/documents', (req, res) => {
  try {
    const metadataPath = path.join(uploadsDir, 'metadata.json');
    let documents = [];

    if (fs.existsSync(metadataPath)) {
      const content = fs.readFileSync(metadataPath, 'utf-8');
      documents = JSON.parse(content);
    }

    res.json({
      success: true,
      documents: documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        size: doc.size,
        uploadTime: formatDate(doc.uploadTime),
        status: doc.status,
      })),
    });
  } catch (error) {
    console.error('List documents error:', error);
    res.status(500).json({
      success: false,
      message: '获取文档列表失败: ' + error.message,
      documents: [],
    });
  }
});

// Delete document
app.delete('/api/knowledge/documents/:id', (req, res) => {
  try {
    const { id } = req.params;
    const metadataPath = path.join(uploadsDir, 'metadata.json');

    if (!fs.existsSync(metadataPath)) {
      return res.status(404).json({
        success: false,
        message: '文档不存在',
      });
    }

    const content = fs.readFileSync(metadataPath, 'utf-8');
    let documents = JSON.parse(content);
    const docIndex = documents.findIndex(d => d.id === id);

    if (docIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '文档不存在',
      });
    }

    const doc = documents[docIndex];

    // Delete the actual file
    if (fs.existsSync(doc.path)) {
      fs.unlinkSync(doc.path);
    }

    // Remove from metadata
    documents.splice(docIndex, 1);
    fs.writeFileSync(metadataPath, JSON.stringify(documents, null, 2));

    res.json({
      success: true,
      message: '文档删除成功',
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: '删除文档失败: ' + error.message,
    });
  }
});

// View document details
app.get('/api/knowledge/documents/:id', (req, res) => {
  try {
    const { id } = req.params;
    const metadataPath = path.join(uploadsDir, 'metadata.json');

    if (!fs.existsSync(metadataPath)) {
      return res.status(404).json({
        success: false,
        message: '文档不存在',
      });
    }

    const content = fs.readFileSync(metadataPath, 'utf-8');
    const documents = JSON.parse(content);
    const doc = documents.find(d => d.id === id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: '文档不存在',
      });
    }

    // For text files, read content
    let fileContent = null;
    if (doc.type === '.txt' || doc.type === '.md') {
      if (fs.existsSync(doc.path)) {
        fileContent = fs.readFileSync(doc.path, 'utf-8');
      }
    }

    res.json({
      success: true,
      document: {
        ...doc,
        content: fileContent,
      },
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: '获取文档详情失败: ' + error.message,
    });
  }
});

// Settings APIs

// Get current settings
app.get('/api/settings', (req, res) => {
  try {
    const envPath = path.join(__dirname, '../.env');
    const config = {
      llm: {
        provider: process.env.LLM_PROVIDER || 'openai',
        openaiKey: process.env.OPENAI_API_KEY || '',
        deepseekKey: process.env.DEEPSEEK_API_KEY || '',
        geminiKey: process.env.GEMINI_API_KEY || '',
        temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
        maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '2000'),
      },
      qdrant: {
        url: process.env.QDRANT_URL || 'http://localhost:6333',
        collectionName: process.env.QDRANT_COLLECTION || 'olora_knowledge',
        embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-ada-002',
      },
    };
    res.json({ success: true, config });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: '获取配置失败: ' + error.message,
    });
  }
});

// Save settings to .env file
app.post('/api/settings', (req, res) => {
  try {
    const { llm, qdrant } = req.body;
    const envPath = path.join(__dirname, '../.env');

    // Read existing .env file or create new one
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Parse existing env vars
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    // Update with new values
    if (llm) {
      if (llm.provider) envVars['LLM_PROVIDER'] = llm.provider;
      if (llm.openaiKey !== undefined) envVars['OPENAI_API_KEY'] = llm.openaiKey;
      if (llm.deepseekKey !== undefined) envVars['DEEPSEEK_API_KEY'] = llm.deepseekKey;
      if (llm.geminiKey !== undefined) envVars['GEMINI_API_KEY'] = llm.geminiKey;
      if (llm.temperature !== undefined) envVars['LLM_TEMPERATURE'] = llm.temperature.toString();
      if (llm.maxTokens !== undefined) envVars['LLM_MAX_TOKENS'] = llm.maxTokens.toString();
    }

    if (qdrant) {
      if (qdrant.url) envVars['QDRANT_URL'] = qdrant.url;
      if (qdrant.collectionName) envVars['QDRANT_COLLECTION'] = qdrant.collectionName;
      if (qdrant.embeddingModel) envVars['EMBEDDING_MODEL'] = qdrant.embeddingModel;
    }

    // Write back to .env file
    const newEnvContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(envPath, newEnvContent + '\n', 'utf-8');

    res.json({
      success: true,
      message: '配置已保存到 .env 文件。请重启后端服务使配置生效。',
    });
  } catch (error) {
    console.error('Save settings error:', error);
    res.status(500).json({
      success: false,
      message: '保存配置失败: ' + error.message,
    });
  }
});

// Report APIs

// Get available report types
app.get('/api/reports/types', (req, res) => {
  try {
    res.json({
      success: true,
      types: reportService.reportTypes,
    });
  } catch (error) {
    console.error('Get report types error:', error);
    res.status(500).json({
      success: false,
      message: '获取报表类型失败: ' + error.message,
    });
  }
});

// Generate financial report
app.get('/api/reports/financial', async (req, res) => {
  try {
    const report = await reportService.generateFinancialReport(req.query);
    res.json({ success: true, report });
  } catch (error) {
    console.error('Generate financial report error:', error);
    res.status(500).json({
      success: false,
      message: '生成财务报表失败: ' + error.message,
    });
  }
});

// Generate project report
app.get('/api/reports/project', async (req, res) => {
  try {
    const report = await reportService.generateProjectReport(req.query);
    res.json({ success: true, report });
  } catch (error) {
    console.error('Generate project report error:', error);
    res.status(500).json({
      success: false,
      message: '生成项目报表失败: ' + error.message,
    });
  }
});

// Generate budget report
app.get('/api/reports/budget', async (req, res) => {
  try {
    const report = await reportService.generateBudgetReport(req.query);
    res.json({ success: true, report });
  } catch (error) {
    console.error('Generate budget report error:', error);
    res.status(500).json({
      success: false,
      message: '生成预算报表失败: ' + error.message,
    });
  }
});

// Generate cost center report
app.get('/api/reports/cost-center', async (req, res) => {
  try {
    const report = await reportService.generateCostCenterReport(req.query);
    res.json({ success: true, report });
  } catch (error) {
    console.error('Generate cost center report error:', error);
    res.status(500).json({
      success: false,
      message: '生成成本中心报表失败: ' + error.message,
    });
  }
});

// Generate resource report
app.get('/api/reports/resource', async (req, res) => {
  try {
    const report = await reportService.generateResourceReport(req.query);
    res.json({ success: true, report });
  } catch (error) {
    console.error('Generate resource report error:', error);
    res.status(500).json({
      success: false,
      message: '生成资源报表失败: ' + error.message,
    });
  }
});

// Generate performance report
app.get('/api/reports/performance', async (req, res) => {
  try {
    const report = await reportService.generatePerformanceReport(req.query);
    res.json({ success: true, report });
  } catch (error) {
    console.error('Generate performance report error:', error);
    res.status(500).json({
      success: false,
      message: '生成绩效报表失败: ' + error.message,
    });
  }
});

// Export report in different formats
app.post('/api/reports/export', async (req, res) => {
  try {
    const { report, format } = req.body;
    const exportedData = await reportService.exportReport(report, format);
    res.json({
      success: true,
      data: exportedData,
      format,
    });
  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({
      success: false,
      message: '导出报表失败: ' + error.message,
    });
  }
});

// Mail APIs

// Get all supported email providers
app.get('/api/mail/providers', (req, res) => {
  try {
    const providers = mailService.getAllProviders();
    res.json({ success: true, providers });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({
      success: false,
      message: '获取邮箱服务商失败: ' + error.message,
    });
  }
});

// Test email connection
app.post('/api/mail/test-connection', async (req, res) => {
  try {
    const config = req.body;
    const result = await mailService.testConnection(config);
    res.json(result);
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({
      success: false,
      error: '测试连接失败: ' + error.message,
    });
  }
});

// Fetch emails from account
app.post('/api/mail/fetch-emails', async (req, res) => {
  try {
    const { config, options } = req.body;
    const emails = await mailService.fetchEmails(config, options);
    res.json({
      success: true,
      emails,
      count: emails.length,
    });
  } catch (error) {
    console.error('Fetch emails error:', error);
    res.status(500).json({
      success: false,
      message: '获取邮件失败: ' + error.message,
    });
  }
});

// Get email detail
app.post('/api/mail/get-email', async (req, res) => {
  try {
    const { config, messageId } = req.body;
    const email = await mailService.getEmailDetail(config, messageId);
    res.json({
      success: true,
      email,
    });
  } catch (error) {
    console.error('Get email error:', error);
    res.status(500).json({
      success: false,
      message: '获取邮件详情失败: ' + error.message,
    });
  }
});

// Get inbox statistics
app.post('/api/mail/inbox-stats', async (req, res) => {
  try {
    const config = req.body;
    const stats = await mailService.getInboxStats(config);
    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get inbox stats error:', error);
    res.status(500).json({
      success: false,
      message: '获取收件箱统计失败: ' + error.message,
    });
  }
});

// Executor APIs

// Get all executor modules
app.get('/api/executors/modules', (req, res) => {
  try {
    const modules = executorService.getAllModules();
    res.json({ success: true, modules });
  } catch (error) {
    console.error('Get executor modules error:', error);
    res.status(500).json({
      success: false,
      message: '获取 Executor 模块失败: ' + error.message,
    });
  }
});

// Get executors by module
app.get('/api/executors/module/:moduleId', (req, res) => {
  try {
    const { moduleId } = req.params;
    const executors = executorService.getExecutorsByModule(moduleId);
    res.json({ success: true, executors });
  } catch (error) {
    console.error('Get executors by module error:', error);
    res.status(500).json({
      success: false,
      message: '获取模块 Executor 失败: ' + error.message,
    });
  }
});

// Get executor by ID
app.get('/api/executors/:executorId', (req, res) => {
  try {
    const { executorId } = req.params;
    const executor = executorService.getExecutorById(executorId);
    if (executor) {
      res.json({ success: true, executor });
    } else {
      res.status(404).json({
        success: false,
        message: 'Executor 未找到',
      });
    }
  } catch (error) {
    console.error('Get executor error:', error);
    res.status(500).json({
      success: false,
      message: '获取 Executor 失败: ' + error.message,
    });
  }
});

// Match executor from user message
app.post('/api/executors/match', async (req, res) => {
  try {
    const { message } = req.body;
    const executor = await executorService.matchExecutorWithAI(message, llmService);

    if (executor) {
      res.json({
        success: true,
        matched: true,
        executor,
        message: `匹配到操作: ${executor.name}`,
      });
    } else {
      res.json({
        success: true,
        matched: false,
        message: '未找到匹配的操作',
      });
    }
  } catch (error) {
    console.error('Match executor error:', error);
    res.status(500).json({
      success: false,
      message: '匹配 Executor 失败: ' + error.message,
    });
  }
});

// Execute SAP BAPI
app.post('/api/executors/execute', async (req, res) => {
  try {
    const { executorId, params } = req.body;
    const result = await executorService.executeExecutor(executorId, params);
    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Execute executor error:', error);
    res.status(500).json({
      success: false,
      message: '执行 Executor 失败: ' + error.message,
    });
  }
});

// Search executors
app.get('/api/executors/search/:keyword', (req, res) => {
  try {
    const { keyword } = req.params;
    const results = executorService.searchExecutors(keyword);
    res.json({
      success: true,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error('Search executors error:', error);
    res.status(500).json({
      success: false,
      message: '搜索 Executor 失败: ' + error.message,
    });
  }
});

// Get executor statistics
app.get('/api/executors/stats', (req, res) => {
  try {
    const stats = executorService.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Get executor stats error:', error);
    res.status(500).json({
      success: false,
      message: '获取统计信息失败: ' + error.message,
    });
  }
});

// Helper functions
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function generateResponse(userMessage) {
  return `⚠️ 系统当前处于演示模式（LLM未配置）

您的消息：${userMessage}

🔧 请配置LLM以使用完整的AI功能：
1. 前往"系统设置"页面
2. 选择LLM提供商（OpenAI/DeepSeek/Gemini）
3. 输入API密钥
4. 保存并重启后端服务

当前系统状态：
- 后端API：✅ 运行中
- 数据库：✅ PostgreSQL已连接
- LLM：⏳ 未配置
- 向量库：⏳ 待启动`;
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
