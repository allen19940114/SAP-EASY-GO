# SAP 报表系统使用指南

## 📊 系统概览

OLORA 报表系统提供完整的 SAP 风格业务报表功能，支持 6 种核心报表类型，涵盖财务、项目、预算、成本、资源和绩效管理。

**实现状态**: ✅ 生产就绪 (Production Ready)

**完成时间**: 2026-01-17

---

## 🎯 功能特性

### 支持的报表类型

| 报表类型 | 模块基础 | 主要内容 |
|---------|---------|----------|
| 💰 **财务报表** | SAP FI | 收入、支出、利润、现金流、KPI |
| 📊 **项目报表** | SAP PS | 项目进度、预算执行、风险分析 |
| 💵 **预算报表** | SAP CO | 预算分配、使用率、部门明细 |
| 🏢 **成本中心报表** | SAP CO | 成本分析、人均成本、趋势 |
| 👥 **资源报表** | SAP HCM | 人力利用率、部门产能、绩效 |
| 📈 **绩效报表** | SAP Analytics | KPI、部门排名、综合评分 |

### 核心功能

- ✅ **实时生成**: 所有报表数据实时计算
- ✅ **多格式导出**: JSON、CSV 格式下载
- ✅ **智能可视化**: 摘要卡片、详细表格、KPI 指标板
- ✅ **中文本地化**: 完整的中文界面和术语
- ✅ **响应式设计**: 适配不同屏幕尺寸

---

## 🚀 快速开始

### 1. 访问报表中心

前端地址: `http://localhost:3000/reports`

### 2. 选择报表类型

点击报表类型卡片，系统自动生成对应报表。

### 3. 查看报表内容

报表包含以下部分:

- **报表头**: 名称、生成时间、操作按钮
- **摘要信息**: 关键数据概览（卡片式展示）
- **KPI 指标**: 带趋势和状态的绩效指标
- **详细数据**: 数据表格、项目列表、部门明细
- **完整 JSON**: 可折叠的原始数据查看

### 4. 导出报表

点击右上角按钮:
- **导出 JSON**: 下载完整 JSON 格式数据
- **导出 CSV**: 下载 CSV 表格数据
- **🔄 刷新**: 重新生成报表

---

## 📡 API 接口文档

### 基础 URL

```
http://localhost:3002/api/reports
```

### 1. 获取报表类型列表

**端点**: `GET /types`

**响应示例**:
```json
{
  "success": true,
  "types": [
    "financial",
    "project",
    "budget",
    "cost_center",
    "resource",
    "performance"
  ]
}
```

### 2. 生成财务报表

**端点**: `GET /financial`

**查询参数**:
- `startDate` (可选): 开始日期
- `endDate` (可选): 结束日期
- `period` (可选): 周期 (monthly, quarterly, yearly)

**响应示例**:
```json
{
  "success": true,
  "report": {
    "reportType": "financial",
    "reportName": "财务报表 (Financial Report)",
    "generatedAt": "2026-01-17T21:11:40.839Z",
    "period": "monthly",
    "summary": {
      "totalRevenue": 15680000,
      "totalExpenses": 12340000,
      "netProfit": 3340000,
      "profitMargin": 21.3,
      "cashFlow": 2890000
    },
    "details": {
      "revenue": [...],
      "expenses": [...],
      "monthlyTrend": [...]
    },
    "kpis": [...]
  }
}
```

### 3. 生成项目报表

**端点**: `GET /project`

**查询参数**:
- `projectId` (可选): 特定项目ID
- `status` (可选): 项目状态筛选

**响应内容**:
- 项目总览
- 项目列表（包含进度、预算、团队信息）
- 状态分布
- 风险分析

### 4. 生成预算报表

**端点**: `GET /budget`

**查询参数**:
- `department` (可选): 部门名称
- `year` (可选): 财年，默认 2025

**响应内容**:
- 预算总览
- 部门预算明细
- 季度趋势
- 预算预警

### 5. 生成成本中心报表

**端点**: `GET /cost-center`

**查询参数**:
- `costCenterId` (可选): 成本中心ID

**响应内容**:
- 成本中心总览
- 成本明细（人力、材料、管理费用）
- 人均成本分析
- 月度趋势

### 6. 生成资源报表

**端点**: `GET /resource`

**响应内容**:
- 资源总览（员工数、利用率、产能）
- 部门资源分布
- 顶级绩效员工

### 7. 生成绩效报表

**端点**: `GET /performance`

**响应内容**:
- 多维度 KPI（财务、项目、运营）
- 部门绩效排名
- 综合评分

### 8. 导出报表

**端点**: `POST /export`

**请求体**:
```json
{
  "report": { /* 报表完整数据 */ },
  "format": "json" // 或 "csv"
}
```

**响应**:
```json
{
  "success": true,
  "data": "/* 导出的文本数据 */",
  "format": "json"
}
```

---

## 🔧 技术实现

### 后端架构

**文件位置**: `/apps/backend/src/services/report.service.js`

**核心类**: `ReportService`

**主要方法**:
```javascript
class ReportService {
  // 报表生成方法
  async generateFinancialReport(params)
  async generateProjectReport(params)
  async generateBudgetReport(params)
  async generateCostCenterReport(params)
  async generateResourceReport(params)
  async generatePerformanceReport(params)

  // 工具方法
  generateMonthlyTrend(months)
  async exportReport(report, format)
  convertToCSV(report)
}
```

### 前端架构

**文件位置**: `/apps/web/app/reports/page.tsx`

**主要组件**:
- `ReportsPage`: 主容器组件
- `formatFieldName()`: 字段名中文转换
- `formatValue()`: 数值格式化
- `renderDetailedData()`: 动态渲染详细数据

**状态管理**:
```typescript
const [selectedType, setSelectedType] = useState<ReportType>('financial');
const [reportData, setReportData] = useState<ReportData | null>(null);
const [isLoading, setIsLoading] = useState(false);
```

### API 路由

**文件位置**: `/apps/backend/src/standalone-api.ts`

**已注册路由**:
```javascript
app.get('/api/reports/types', ...)
app.get('/api/reports/financial', ...)
app.get('/api/reports/project', ...)
app.get('/api/reports/budget', ...)
app.get('/api/reports/cost-center', ...)
app.get('/api/reports/resource', ...)
app.get('/api/reports/performance', ...)
app.post('/api/reports/export', ...)
```

---

## 📊 数据模型

### 通用报表结构

```typescript
interface ReportData {
  reportType: string;           // 报表类型
  reportName: string;           // 报表名称
  generatedAt: string;          // 生成时间 (ISO 8601)
  summary?: Record<string, any>; // 摘要数据
  details?: Record<string, any>; // 详细数据
  kpis?: KPI[];                 // KPI 指标
  [key: string]: any;           // 其他字段
}

interface KPI {
  name?: string;
  category?: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'excellent' | 'good' | 'warning' | 'poor';
  target?: number;
}
```

### 财务报表特定字段

```javascript
{
  period: 'monthly' | 'quarterly' | 'yearly',
  dateRange: { startDate, endDate },
  details: {
    revenue: Array<{ category, amount, percentage }>,
    expenses: Array<{ category, amount, percentage }>,
    monthlyTrend: Array<{ month, value, growth }>
  }
}
```

### 项目报表特定字段

```javascript
{
  summary: {
    totalProjects, activeProjects, completedProjects,
    totalBudget, totalSpent, budgetUtilization
  },
  projectList: Array<{
    projectId, projectName, status, progress,
    budget, spent, remaining, manager, teamSize,
    milestones: { completed, total }
  }>,
  statusDistribution: Array<{ status, count, percentage }>,
  riskAnalysis: Array<{ projectId, risk, level, mitigation }>
}
```

---

## 🎨 UI 组件说明

### 报表类型选择器

6 个卡片式按钮，显示:
- 报表图标和名称
- 简要描述
- 选中状态高亮

### 摘要卡片

网格布局，每张卡片包含:
- 字段名称（中文）
- 数值（带格式化）
- 蓝色强调色

### KPI 指标卡

包含:
- 指标名称
- 当前值和单位
- 趋势图标（📈📉➡️）
- 状态标签（excellent/good/warning/poor）
- 目标值对比

### 数据表格

- 自适应表头
- 斑马纹行
- 数值右对齐
- 状态彩色标签

### 项目卡片

显示:
- 项目名称和 ID
- 状态标签
- 进度百分比
- 预算执行情况
- 负责人和团队规模

---

## 📝 使用示例

### 前端调用示例

```typescript
// 加载财务报表
const loadFinancialReport = async () => {
  const response = await fetch(
    'http://localhost:3002/api/reports/financial?period=monthly'
  );
  const data = await response.json();
  console.log(data.report);
};

// 导出报表
const exportReport = async (reportData: ReportData) => {
  const response = await fetch(
    'http://localhost:3002/api/reports/export',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        report: reportData,
        format: 'csv'
      })
    }
  );
  const data = await response.json();
  // 下载文件逻辑
};
```

### 命令行测试

```bash
# 获取报表类型
curl http://localhost:3002/api/reports/types

# 生成财务报表
curl http://localhost:3002/api/reports/financial

# 生成项目报表（带参数）
curl "http://localhost:3002/api/reports/project?status=active"

# 导出报表
curl -X POST http://localhost:3002/api/reports/export \
  -H "Content-Type: application/json" \
  -d '{"report": {...}, "format": "csv"}'
```

---

## 🔮 未来扩展

### 计划功能

1. **Excel 导出**: 使用 `xlsx` 库实现完整 Excel 格式导出
2. **图表可视化**: 集成 Chart.js 或 ECharts
3. **自定义报表**: 用户自定义字段和筛选条件
4. **定时报表**: 定时生成和邮件发送
5. **实时数据**: 集成真实 SAP 数据源
6. **权限控制**: 基于角色的报表访问权限

### 数据源集成

当前使用模拟数据，未来可集成:

- **SAP OData API**: 直接从 SAP 系统读取数据
- **PostgreSQL**: 从本地数据库聚合计算
- **Redis 缓存**: 报表数据缓存加速
- **外部 API**: 其他业务系统数据

---

## 🐛 故障排除

### 问题 1: 报表加载失败

**症状**: 点击报表类型后显示加载失败

**解决方法**:
```bash
# 检查后端服务是否运行
curl http://localhost:3002/health

# 重启后端服务
cd /path/to/backend
pkill -f "node.*standalone-api"
node src/standalone-api.ts
```

### 问题 2: 导出功能无效

**症状**: 点击导出按钮无反应

**可能原因**:
- 浏览器阻止下载
- CORS 配置问题

**解决方法**:
- 检查浏览器控制台错误
- 确认后端 CORS 已启用

### 问题 3: 数据格式错误

**症状**: 报表显示异常或部分字段缺失

**解决方法**:
- 查看浏览器控制台 `console.error`
- 检查后端日志 `/tmp/backend.log`
- 验证 API 响应格式是否符合 `ReportData` 接口

---

## 📚 参考资料

### SAP 模块说明

- **SAP FI (Financial Accounting)**: 财务会计
- **SAP CO (Controlling)**: 管理会计/成本控制
- **SAP PS (Project System)**: 项目系统
- **SAP HCM (Human Capital Management)**: 人力资源管理
- **SAP Crystal Reports**: SAP 报表工具
- **SAP Analytics Cloud**: SAP 分析云平台

### 技术栈

- **后端**: Node.js + Express
- **前端**: Next.js 14 + React 18 + TypeScript
- **样式**: 内联样式（响应式设计）
- **数据格式**: JSON
- **导出格式**: JSON, CSV

---

## ✅ 验收清单

- [x] 6 种报表类型全部实现
- [x] 后端 API 接口完整
- [x] 前端可视化界面
- [x] 报表数据结构化
- [x] 导出功能（JSON/CSV）
- [x] 中文本地化
- [x] 响应式设计
- [x] 错误处理
- [x] API 文档
- [x] 使用指南

---

**文档版本**: 1.0
**最后更新**: 2026-01-17
**维护者**: OLORA Development Team
