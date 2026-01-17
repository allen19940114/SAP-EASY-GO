# OLORA 邮件管理系统使用指南

## 📧 系统概览

OLORA 邮件管理系统集成自 MAILAGENT 项目,提供完整的企业级邮箱连接和邮件读取功能,支持主流邮箱服务商。

**实现状态**: ✅ 生产就绪 (Production Ready)

**完成时间**: 2026-01-17

**来源项目**: [MAILAGENT](https://github.com/leijinglun/MAILAGENT) - AI 智能邮件助手

---

## 🎯 功能特性

### 支持的邮箱服务商

| 服务商 | IMAP 服务器 | 端口 | SSL | 说明 |
|--------|------------|------|-----|------|
| 💬 **QQ 邮箱** | imap.qq.com | 993 | ✅ | 需使用授权码 |
| 📧 **163 邮箱** | imap.163.com | 993 | ✅ | 需使用授权码 |
| 📨 **126 邮箱** | imap.126.com | 993 | ✅ | 需使用授权码 |
| 📬 **Gmail** | imap.gmail.com | 993 | ✅ | 需应用专用密码 |
| 📮 **Outlook** | outlook.office365.com | 993 | ✅ | 使用邮箱密码 |
| 📭 **阿里云邮箱** | imap.aliyun.com | 993 | ✅ | 企业邮箱支持 |

### 核心功能

- ✅ **连接测试**: 快速验证邮箱配置是否正确
- ✅ **邮件读取**: 获取最近 50 封邮件（可配置）
- ✅ **邮件列表**: 显示主题、发件人、日期、预览
- ✅ **邮件详情**: 完整邮件内容查看（支持 HTML）
- ✅ **收件箱统计**: 总邮件数、未读邮件数
- ✅ **附件识别**: 识别并显示附件信息
- ✅ **自定义配置**: 支持自定义 IMAP 服务器

---

## 🚀 快速开始

### 1. 访问邮件管理页面

前端地址: `http://localhost:3000/mail`

### 2. 选择邮箱服务商

在下拉菜单中选择您的邮箱类型（QQ、163、Gmail 等）

### 3. 填写邮箱信息

- **邮箱地址**: 完整的邮箱地址（例如: user@qq.com）
- **密码/授权码**:
  - QQ/163/126 邮箱: 使用授权码（非登录密码）
  - Gmail: 使用应用专用密码
  - Outlook: 使用邮箱密码

### 4. 测试连接

点击「🔌 测试连接」按钮,系统会验证邮箱配置:
- ✅ 连接成功: 显示收件箱统计信息
- ❌ 连接失败: 显示错误原因

### 5. 获取邮件

连接成功后,点击「📨 获取邮件」按钮,系统会:
- 从收件箱获取最近 50 封邮件
- 显示在左侧列表中
- 点击邮件查看详情

---

## 🔑 获取授权码/应用密码

### QQ 邮箱授权码

1. 登录 [QQ 邮箱网页版](https://mail.qq.com)
2. 点击「设置」→「账户」
3. 找到「POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务」
4. 开启「IMAP/SMTP 服务」
5. 点击「生成授权码」
6. 通过手机 QQ 扫码验证
7. 复制生成的授权码（16 位）

### 163/126 邮箱授权码

1. 登录 [163 邮箱](https://mail.163.com) 或 [126 邮箱](https://mail.126.com)
2. 点击「设置」→「POP3/SMTP/IMAP」
3. 开启「IMAP/SMTP 服务」
4. 设置客户端授权密码
5. 通过手机短信验证
6. 记录授权码

### Gmail 应用专用密码

1. 登录 [Google 账号](https://myaccount.google.com)
2. 开启两步验证
3. 访问 [应用专用密码](https://myaccount.google.com/apppasswords)
4. 选择应用类型「邮件」和设备类型
5. 点击「生成」
6. 复制显示的 16 位密码

### Outlook 邮箱

直接使用邮箱登录密码,无需额外配置。

---

## 📡 API 接口文档

### 基础 URL

```
http://localhost:3002/api/mail
```

### 1. 获取支持的邮箱服务商

**端点**: `GET /providers`

**响应示例**:
```json
{
  "success": true,
  "providers": {
    "qq": {
      "name": "QQ 邮箱",
      "imap_host": "imap.qq.com",
      "imap_port": 993,
      "use_ssl": true,
      "smtp_host": "smtp.qq.com",
      "smtp_port": 465
    },
    "163": { ... },
    "gmail": { ... }
  }
}
```

### 2. 测试邮箱连接

**端点**: `POST /test-connection`

**请求体**:
```json
{
  "email": "user@qq.com",
  "password": "授权码",
  "imap_host": "imap.qq.com",
  "imap_port": 993,
  "use_ssl": true
}
```

**响应**:
```json
{
  "success": true
}
// 或
{
  "success": false,
  "error": "连接失败: Invalid credentials"
}
```

### 3. 获取邮件列表

**端点**: `POST /fetch-emails`

**请求体**:
```json
{
  "config": {
    "email": "user@qq.com",
    "password": "授权码",
    "imap_host": "imap.qq.com",
    "imap_port": 993,
    "use_ssl": true
  },
  "options": {
    "limit": 50,
    "since": null
  }
}
```

**响应**:
```json
{
  "success": true,
  "emails": [
    {
      "id": "uuid",
      "messageId": "original-message-id",
      "subject": "邮件主题",
      "from": "sender@example.com",
      "fromName": "发件人姓名",
      "to": ["recipient@example.com"],
      "date": "2026-01-17T10:00:00Z",
      "text": "邮件文本内容...",
      "html": "<html>...</html>",
      "isRead": false,
      "isImportant": false,
      "hasAttachments": true,
      "attachments": [
        {
          "filename": "document.pdf",
          "contentType": "application/pdf",
          "size": 1024000
        }
      ]
    }
  ],
  "count": 50
}
```

### 4. 获取邮件详情

**端点**: `POST /get-email`

**请求体**:
```json
{
  "config": { ... },
  "messageId": "message-id-string"
}
```

**响应**:
```json
{
  "success": true,
  "email": {
    "messageId": "...",
    "subject": "...",
    "from": { "address": "...", "name": "..." },
    "to": [ ... ],
    "cc": [ ... ],
    "date": "...",
    "text": "完整文本内容",
    "html": "完整HTML内容",
    "attachments": [ ... ]
  }
}
```

### 5. 获取收件箱统计

**端点**: `POST /inbox-stats`

**请求体**:
```json
{
  "email": "user@qq.com",
  "password": "授权码",
  "imap_host": "imap.qq.com",
  "imap_port": 993,
  "use_ssl": true
}
```

**响应**:
```json
{
  "success": true,
  "stats": {
    "total": 1234,
    "unread": 56
  }
}
```

---

## 🏗️ 技术实现

### 后端架构

**文件位置**: `/apps/backend/src/services/mail.service.js`

**核心类**: `MailService`

**主要功能**:
```javascript
class MailService {
  // 创建 IMAP 连接
  createConnection(config)

  // 测试连接
  async testConnection(config)

  // 获取服务商配置
  getProviderConfig(provider)
  getAllProviders()

  // 获取邮件
  async fetchEmails(config, options)
  async fetchEmailRange(imap, start, end, since)

  // 获取邮件详情
  async getEmailDetail(config, messageId)

  // 获取收件箱统计
  async getInboxStats(config)
}
```

**依赖包**:
- `imap`: IMAP 协议客户端
- `mailparser`: 邮件解析库
- `uuid`: UUID 生成

### 前端架构

**文件位置**: `/apps/web/app/mail/page.tsx`

**主要组件**:
- 邮箱连接设置表单
- 服务商选择器
- 连接状态指示器
- 邮件列表（左侧面板）
- 邮件详情（右侧面板）
- 收件箱统计卡片

**状态管理**:
```typescript
const [providers, setProviders] = useState({});
const [emailConfig, setEmailConfig] = useState({...});
const [isConnected, setIsConnected] = useState(false);
const [emails, setEmails] = useState([]);
const [selectedEmail, setSelectedEmail] = useState(null);
const [stats, setStats] = useState(null);
```

### API 路由

**文件位置**: `/apps/backend/src/standalone-api.ts`

**已注册路由**:
```javascript
app.get('/api/mail/providers', ...)
app.post('/api/mail/test-connection', ...)
app.post('/api/mail/fetch-emails', ...)
app.post('/api/mail/get-email', ...)
app.post('/api/mail/inbox-stats', ...)
```

---

## 🔒 安全说明

### 密码存储

- ⚠️ **当前实现**: 密码仅在会话期间存储于前端状态
- ⚠️ **不持久化**: 关闭页面后需重新输入
- ✅ **传输加密**: HTTPS 加密传输（生产环境必须）
- ✅ **IMAP SSL**: 使用 SSL/TLS 加密连接

### 生产环境建议

1. **使用 HTTPS**: 确保前后端通信加密
2. **密码加密存储**: 如需保存密码,使用服务器端加密
3. **访问控制**: 添加用户认证机制
4. **审计日志**: 记录邮箱访问操作
5. **权限管理**: 限制可访问的邮箱账户

---

## 📊 数据流程

### 邮件获取流程

```
用户输入邮箱配置
    ↓
前端调用 /test-connection
    ↓
后端创建 IMAP 连接
    ↓
验证认证信息
    ↓ 成功
显示收件箱统计
    ↓
用户点击「获取邮件」
    ↓
前端调用 /fetch-emails
    ↓
后端连接 IMAP 服务器
    ↓
打开 INBOX 邮箱
    ↓
获取最近 N 封邮件
    ↓
使用 mailparser 解析
    ↓
返回结构化数据
    ↓
前端显示邮件列表
```

### 邮件解析流程

```
IMAP 获取原始邮件
    ↓
simpleParser() 解析
    ↓
提取元数据:
  - 主题、发件人、收件人
  - 日期、Message-ID
  - 标志位（已读、重要）
    ↓
解析邮件正文:
  - 文本内容 (text)
  - HTML 内容 (html)
    ↓
提取附件信息:
  - 文件名、类型、大小
    ↓
返回结构化 JSON
```

---

## 📝 使用示例

### 前端调用示例

```typescript
// 测试连接
const testConnection = async () => {
  const response = await fetch('http://localhost:3002/api/mail/test-connection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@qq.com',
      password: '授权码',
      imap_host: 'imap.qq.com',
      imap_port: 993,
      use_ssl: true,
    }),
  });

  const data = await response.json();
  if (data.success) {
    console.log('连接成功!');
  }
};

// 获取邮件
const fetchEmails = async () => {
  const response = await fetch('http://localhost:3002/api/mail/fetch-emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      config: emailConfig,
      options: { limit: 50 },
    }),
  });

  const data = await response.json();
  console.log('获取到', data.count, '封邮件');
  console.log(data.emails);
};
```

### 命令行测试

```bash
# 获取服务商列表
curl http://localhost:3002/api/mail/providers

# 测试连接
curl -X POST http://localhost:3002/api/mail/test-connection \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@qq.com",
    "password": "授权码",
    "imap_host": "imap.qq.com",
    "imap_port": 993,
    "use_ssl": true
  }'

# 获取邮件
curl -X POST http://localhost:3002/api/mail/fetch-emails \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "email": "user@qq.com",
      "password": "授权码",
      "imap_host": "imap.qq.com",
      "imap_port": 993,
      "use_ssl": true
    },
    "options": {
      "limit": 10
    }
  }'
```

---

## 🐛 故障排除

### 问题 1: 连接超时

**症状**: 测试连接时显示「连接超时」

**可能原因**:
- IMAP 服务器地址错误
- 网络防火墙阻止
- 邮箱服务未开启 IMAP

**解决方法**:
1. 检查 IMAP 服务器地址和端口
2. 确认邮箱已开启 IMAP 服务
3. 检查防火墙设置,允许 993 端口

### 问题 2: 认证失败

**症状**: 显示「Invalid credentials」或「认证失败」

**可能原因**:
- QQ/163 邮箱使用了登录密码而非授权码
- 授权码输入错误
- 授权码已过期

**解决方法**:
1. 确认使用的是授权码,不是登录密码
2. 重新生成授权码
3. 检查邮箱地址是否正确

### 问题 3: 获取邮件失败

**症状**: 连接成功但无法获取邮件

**解决方法**:
- 检查后端日志 `/tmp/backend.log`
- 确认收件箱不为空
- 尝试减少 limit 数量

### 问题 4: 邮件内容显示异常

**症状**: 邮件正文乱码或格式错误

**可能原因**:
- HTML 邮件渲染问题
- 字符编码问题

**解决方法**:
- 查看文本版本 (text 字段)
- 检查 HTML 内容是否完整

---

## 🔮 未来扩展

### 计划功能

1. **邮箱账户管理**: 支持保存多个邮箱账户
2. **自动同步**: 定时自动同步新邮件
3. **邮件搜索**: 支持关键词搜索
4. **邮件标签**: 自定义标签分类
5. **附件下载**: 支持附件下载
6. **邮件发送**: SMTP 发送功能
7. **AI 分析**: 邮件内容智能分析
8. **任务提取**: 从邮件提取待办事项

### MAILAGENT 完整功能

OLORA 当前实现了 MAILAGENT 的核心邮件读取功能。完整的 MAILAGENT 项目还包括:

- 🤖 **AI 邮件分析**: 智能分析邮件重要性、分类
- 📋 **任务看板**: 从邮件提取待办事项到看板
- 🔔 **自动同步**: 1 分钟间隔自动同步
- 📊 **Token 统计**: AI 使用量统计
- 🎯 **邮箱分类**: 工作/个人/重要分类

如需完整功能,可访问 [MAILAGENT 项目](https://github.com/leijinglun/MAILAGENT)。

---

## ✅ 验收清单

- [x] 支持 6 种主流邮箱服务商
- [x] 邮箱连接测试功能
- [x] 邮件列表获取 (50 封)
- [x] 邮件详情查看
- [x] HTML 邮件渲染
- [x] 附件信息显示
- [x] 收件箱统计
- [x] 前端界面完整
- [x] API 文档完整
- [x] 错误处理

---

## 🙏 致谢

本功能集成自 [MAILAGENT](https://github.com/leijinglun/MAILAGENT) 项目:

- **项目作者**: leijinglun
- **项目简介**: AI 智能邮件助手
- **技术栈**: Electron + React + Node.js + IMAP
- **开源协议**: MIT License

感谢 MAILAGENT 项目提供的优秀邮件服务实现!

---

**文档版本**: 1.0
**最后更新**: 2026-01-17
**维护者**: OLORA Development Team
