'use client';

import Layout from '@/components/Layout';

export default function AuditPage() {
  const logs = [
    { id: '1', user: '张三', action: '创建项目', resource: '华为5G项目', time: '2026-01-17 14:30:25', status: 'success' },
    { id: '2', user: '李四', action: '修改预算', resource: '项目A', time: '2026-01-17 13:15:10', status: 'success' },
    { id: '3', user: '王五', action: '删除文档', resource: 'doc_123.pdf', time: '2026-01-17 11:20:45', status: 'warning' },
  ];

  return (
    <Layout>
      <div style={{ padding: '32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#333', fontWeight: 600 }}>
            📝 审计日志
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
            查看所有用户操作记录，确保合规性
          </p>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#666' }}>时间</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#666' }}>用户</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#666' }}>操作</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#666' }}>资源</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#666' }}>状态</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '14px 12px', fontSize: '13px', color: '#666' }}>{log.time}</td>
                  <td style={{ padding: '14px 12px', fontSize: '14px', color: '#333' }}>{log.user}</td>
                  <td style={{ padding: '14px 12px', fontSize: '14px', color: '#333' }}>{log.action}</td>
                  <td style={{ padding: '14px 12px', fontSize: '14px', color: '#666' }}>{log.resource}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{
                      background: log.status === 'success' ? '#f6ffed' : '#fff7e6',
                      color: log.status === 'success' ? '#52c41a' : '#fa8c16',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}>
                      {log.status === 'success' ? '✓ 成功' : '⚠ 警告'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
