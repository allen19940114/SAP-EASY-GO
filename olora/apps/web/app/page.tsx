'use client';

export default function HomePage() {
  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', background: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px', color: '#1890ff' }}>
        🤖 OLORA
      </h1>
      <p style={{ fontSize: '20px', color: '#666', marginBottom: '40px' }}>
        企业级 AI Agent for SAP - 智能对话、知识库管理、数据安全网关
      </p>

      <div
        style={{
          background: '#f0f9ff',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '2px solid #1890ff'
        }}
      >
        <h2 style={{ marginBottom: '10px', color: '#1890ff', fontSize: '20px' }}>✅ 项目状态</h2>
        <div style={{ color: '#333' }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>功能完成度:</strong> 32/32 (100%)
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>代码状态:</strong> 已推送到远程仓库
          </p>
          <p>
            <strong>技术栈:</strong> NestJS + Next.js + PostgreSQL + Redis + Qdrant
          </p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '15px' }}>✅ 已完成功能 (32/32)</h3>
        <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', border: '1px solid #d9d9d9' }}>
          <ul style={{ lineHeight: '2', color: '#333', listStyle: 'none', paddingLeft: 0 }}>
            <li>✅ <strong>Phase 1:</strong> 基础框架 (Monorepo + Prisma + JWT认证)</li>
            <li>✅ <strong>Phase 2:</strong> AI对话与RAG (WebSocket + LLM + 知识库)</li>
            <li>✅ <strong>Phase 3:</strong> 数据安全网关 (PII检测脱敏 + 数据还原)</li>
            <li>✅ <strong>Phase 4:</strong> Action执行 (意图识别 + 权限校验 + 审计)</li>
            <li>✅ <strong>Phase 5-9:</strong> 报表/接口/前端/部署 (全部完成)</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
        <h3 style={{ color: '#0050b3', marginBottom: '10px' }}>🚀 核心特性</h3>
        <ul style={{ color: '#333', lineHeight: '1.8' }}>
          <li>🔒 <strong>数据安全</strong>: PII检测脱敏，敏感数据永不发送云端LLM</li>
          <li>🤖 <strong>多模型LLM</strong>: 支持 OpenAI + DeepSeek + Gemini</li>
          <li>📚 <strong>RAG知识库</strong>: 向量检索 + 语义搜索 (Qdrant)</li>
          <li>⚡ <strong>实时通信</strong>: WebSocket 流式响应</li>
          <li>🔍 <strong>意图识别</strong>: LLM驱动的智能参数提取</li>
        </ul>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', background: '#fff7e6', borderRadius: '8px', border: '1px solid #ffa940' }}>
        <h3 style={{ color: '#d46b08', marginBottom: '10px' }}>📚 查看文档</h3>
        <ul style={{ color: '#333', lineHeight: '1.8' }}>
          <li><strong>README.md</strong> - 完整项目文档与部署指南</li>
          <li><strong>FINAL_REPORT.md</strong> - 32个功能完成报告</li>
          <li><strong>IMPLEMENTATION_SUMMARY.md</strong> - 技术架构总结</li>
          <li><strong>QUICK_START.md</strong> - 快速启动指南</li>
        </ul>
      </div>
    </div>
  );
}
