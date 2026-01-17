'use client';

import Layout from '@/components/Layout';

export default function ReportsPage() {
  return (
    <Layout>
      <div style={{ padding: '32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#333', fontWeight: 600 }}>
            📊 报表中心
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
            生成和查看各类业务报表
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '60px 40px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#333' }}>报表功能开发中</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>
            即将支持：财务报表、项目进度、成本分析等
          </p>
        </div>
      </div>
    </Layout>
  );
}
