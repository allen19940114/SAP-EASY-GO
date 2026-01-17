# OLORA Bug 记录及修复方式

**文档说明**: 本文档记录测试过程中发现的所有缺陷、问题及其修复方案
**更新频率**: 发现问题立即记录
**负责人**: 测试专家 AI Agent

---

## Bug 统计概览

| 严重等级 | 未修复 | 已修复 | 总数 |
|---------|--------|--------|------|
| P0 - Blocker | 0 | 0 | 0 |
| P1 - Critical | 0 | 0 | 0 |
| P2 - Major | 0 | 0 | 0 |
| P3 - Minor | 0 | 0 | 0 |
| **总计** | **0** | **0** | **0** |

---

## Bug 记录模板

每个 Bug 包含以下信息:
- **Bug ID**: 唯一标识符
- **严重等级**: P0/P1/P2/P3
- **状态**: Open/In Progress/Fixed/Closed
- **发现时间**: YYYY-MM-DD HH:mm
- **发现于**: 功能模块/测试用例
- **影响范围**: 功能/性能/安全/体验
- **复现步骤**: 详细操作步骤
- **预期行为**: 正确的行为
- **实际行为**: 错误的行为
- **根本原因**: 问题分析
- **修复方案**: 解决方法
- **修复代码**: 代码变更
- **修复人**: 负责人
- **修复时间**: YYYY-MM-DD HH:mm
- **验证结果**: 修复后测试结果
- **关联测试用例**: 受影响的测试用例

---

## P0 - Blocker 级别 Bug

> 系统崩溃、数据丢失、核心功能完全不可用

### BUG-P0-001: [示例] 系统启动失败
- **严重等级**: P0
- **状态**: ❌ Open (示例)
- **发现时间**: 2026-01-17 10:00
- **发现于**: TC-SYSTEM-001
- **影响范围**: 整个系统无法使用

- **复现步骤**:
  1. 执行 `pnpm dev`
  2. 观察终端输出

- **预期行为**: 前后端服务正常启动
- **实际行为**: 后端启动失败,抛出数据库连接错误

- **错误信息**:
  ```
  Error: P1001 Can't reach database server at localhost:5432
  ```

- **根本原因**: PostgreSQL 容器未启动

- **修复方案**:
  1. 先执行 `docker-compose up -d`
  2. 等待数据库就绪
  3. 再执行 `pnpm dev`

- **修复代码**:
  ```bash
  # 更新 package.json scripts
  "dev:full": "docker-compose up -d && pnpm dev"
  ```

- **修复人**: 待分配
- **修复时间**: 待修复
- **验证结果**: 待验证
- **关联测试用例**: TC-SYSTEM-001

---

## P1 - Critical 级别 Bug

> 主要功能异常、数据错误、严重影响用户使用

### BUG-P1-001: (待发现)

_(示例条目,实际 Bug 在测试中发现后填写)_

---

## P2 - Major 级别 Bug

> 次要功能异常、体验问题、不影响核心流程

### BUG-P2-001: (待发现)

_(示例条目,实际 Bug 在测试中发现后填写)_

---

## P3 - Minor 级别 Bug

> UI 细节、文案错误、小的体验优化

### BUG-P3-001: (待发现)

_(示例条目,实际 Bug 在测试中发现后填写)_

---

## Bug 修复流程

```
发现 Bug
    ↓
记录到本文档 (状态: Open)
    ↓
分析根本原因
    ↓
制定修复方案
    ↓
实施修复 (状态: In Progress)
    ↓
更新修复代码到文档
    ↓
本地验证修复 (状态: Fixed)
    ↓
回归测试相关功能
    ↓
确认无副作用 (状态: Closed)
    ↓
更新测试结果文档
```

---

## 常见问题及解决方案

### 1. 数据库连接失败
**症状**: `Error: P1001 Can't reach database server`
**原因**: PostgreSQL 容器未启动或端口冲突
**解决**:
```bash
docker-compose up -d postgres
docker-compose ps  # 确认容器运行
```

---

### 2. 前端无法访问后端 API
**症状**: `Network Error` 或 `CORS Error`
**原因**:
- 后端未启动
- CORS 配置错误
- 环境变量配置错误
**解决**:
```bash
# 检查后端运行状态
curl http://localhost:3002/api/health

# 检查 CORS 配置
# apps/backend/src/main.ts
app.enableCors({
  origin: 'http://localhost:3001',
  credentials: true
})

# 检查前端环境变量
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3002
```

---

### 3. Prisma 迁移失败
**症状**: `Migration failed` 或 `Table already exists`
**原因**: 数据库状态不一致
**解决**:
```bash
# 重置数据库 (开发环境)
pnpm --filter @olora/backend prisma migrate reset

# 重新迁移
pnpm --filter @olora/backend prisma migrate dev
```

---

### 4. JWT Token 验证失败
**症状**: `401 Unauthorized` 或 `Invalid token`
**原因**:
- Token 过期
- JWT_SECRET 配置错误
- Token 格式错误
**解决**:
```bash
# 检查 .env 配置
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=7d

# 重新登录获取新 token
```

---

### 5. WebSocket 连接失败
**症状**: `WebSocket connection failed`
**原因**:
- Socket.IO 服务未启动
- CORS 配置不正确
- 端口冲突
**解决**:
```typescript
// 检查后端 Socket.IO 配置
// apps/backend/src/modules/chat/chat.gateway.ts
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
    credentials: true
  }
})

// 检查前端连接配置
// apps/web/src/lib/socket-client.ts
const socket = io('http://localhost:3002', {
  transports: ['websocket'],
  autoConnect: true
})
```

---

### 6. 文件上传失败
**症状**: `File too large` 或 `Unsupported file type`
**原因**:
- 文件大小超限
- 文件类型不支持
- Multer 配置错误
**解决**:
```typescript
// 检查后端 Multer 配置
// apps/backend/src/modules/rag/document.controller.ts
@UseInterceptors(
  FileInterceptor('file', {
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: (req, file, cb) => {
      const allowedTypes = /pdf|doc|docx|txt|md/
      if (allowedTypes.test(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error('不支持的文件类型'), false)
      }
    }
  })
)
```

---

### 7. Qdrant 向量搜索无结果
**症状**: 搜索返回空数组或相似度过低
**原因**:
- 文档未向量化
- Embedding 模型不一致
- Collection 不存在
**解决**:
```bash
# 检查 Qdrant 容器
docker-compose ps qdrant

# 访问 Qdrant UI
open http://localhost:6333/dashboard

# 检查 Collection
curl http://localhost:6333/collections/olora_documents

# 重新向量化文档
pnpm --filter @olora/backend seed:vectors
```

---

### 8. LLM API 调用失败
**症状**: `API key not valid` 或 `Rate limit exceeded`
**原因**:
- API Key 未配置或错误
- 配额不足
- 网络问题
**解决**:
```bash
# 检查环境变量
echo $OPENAI_API_KEY
echo $DEEPSEEK_API_KEY
echo $GEMINI_API_KEY

# 测试 API 连接
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

---

### 9. 前端页面样式错乱
**症状**: 组件显示异常、布局错乱
**原因**:
- Tailwind CSS 未编译
- 样式冲突
- 组件导入错误
**解决**:
```bash
# 重新构建 Tailwind
pnpm --filter @olora/web dev

# 清除缓存
rm -rf apps/web/.next
pnpm --filter @olora/web dev

# 检查 Tailwind 配置
# apps/web/tailwind.config.ts
```

---

### 10. 性能问题 (慢响应)
**症状**: API 响应时间 > 5 秒
**原因**:
- 数据库查询未优化
- N+1 查询问题
- 缺少索引
**解决**:
```sql
-- 添加索引
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_message_session ON "Message"("sessionId");
CREATE INDEX idx_message_created ON "Message"("createdAt");

-- 使用 Prisma 查询优化
// 使用 include 代替多次查询
const sessions = await prisma.chatSession.findMany({
  include: {
    messages: {
      orderBy: { createdAt: 'desc' },
      take: 50
    }
  }
})
```

---

## Bug 修复最佳实践

### 1. 修复前
- ✅ 充分复现 Bug
- ✅ 理解根本原因
- ✅ 制定修复方案
- ✅ 评估影响范围

### 2. 修复中
- ✅ 最小化代码变更
- ✅ 添加单元测试
- ✅ 添加防御性代码
- ✅ 更新文档和注释

### 3. 修复后
- ✅ 本地验证修复
- ✅ 回归测试相关功能
- ✅ 更新测试用例
- ✅ 提交代码并记录

---

## Bug 优先级定义

### P0 - Blocker (阻塞)
- 系统无法启动
- 核心功能完全不可用
- 数据丢失或损坏
- 安全漏洞 (SQL 注入、XSS等)
- **修复时限**: 立即修复 (< 4小时)

### P1 - Critical (严重)
- 主要功能无法使用
- 数据显示错误
- 用户无法完成核心流程
- **修复时限**: 1个工作日内

### P2 - Major (重要)
- 次要功能异常
- 体验问题
- 性能问题 (非核心功能)
- **修复时限**: 3个工作日内

### P3 - Minor (次要)
- UI 细节问题
- 文案错误
- 小的体验优化
- **修复时限**: 下个迭代

---

## 测试覆盖增强

发现 Bug 后,需要:
1. **添加测试用例**: 覆盖该 Bug 场景
2. **更新测试脚本**: 确保回归测试包含此场景
3. **记录测试数据**: 保存能复现 Bug 的数据
4. **更新文档**: 在相关功能文档中标注注意事项

---

**最后更新**: 2026-01-17
**待修复 Bug 总数**: 0
**本周修复 Bug 数**: 0
**累计修复 Bug 数**: 0
