'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { path: '/', icon: '💬', label: 'AI对话', description: '智能助手聊天' },
    { path: '/knowledge', icon: '📚', label: '知识库', description: '文档管理' },
    { path: '/settings', icon: '⚙️', label: '系统设置', description: 'LLM配置' },
    { path: '/reports', icon: '📊', label: '报表中心', description: '数据分析' },
    { path: '/audit', icon: '📝', label: '审计日志', description: '操作记录' },
  ];

  const sidebarStyle = {
    width: sidebarOpen ? '280px' : '80px',
    background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
    color: 'white',
    height: '100vh',
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'fixed' as const,
    left: 0,
    top: 0,
    zIndex: 1000,
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
  };

  const mainStyle = {
    marginLeft: sidebarOpen ? '280px' : '80px',
    transition: 'margin-left 0.3s ease',
    minHeight: '100vh',
    background: '#f5f5f5',
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* 侧边栏 */}
      <div style={sidebarStyle}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {sidebarOpen ? (
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                🤖 OLORA
              </h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
                企业级 AI 助手
              </p>
            </div>
          ) : (
            <div style={{ fontSize: '28px' }}>🤖</div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              padding: '8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* 菜单项 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: sidebarOpen ? '14px 20px' : '14px 0',
                  margin: '4px 12px',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '24px', minWidth: '24px' }}>{item.icon}</span>
                {sidebarOpen && (
                  <div style={{ marginLeft: '12px' }}>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{item.label}</div>
                    <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
                      {item.description}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* 底部信息 */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          fontSize: '12px',
          opacity: 0.7,
        }}>
          {sidebarOpen && (
            <>
              <div style={{ marginBottom: '8px' }}>
                <div>✅ 后端API: 运行中</div>
                <div>✅ 数据库: 已连接</div>
              </div>
              <div style={{ fontSize: '11px', opacity: 0.6 }}>
                v1.0.0 | 2026-01-17
              </div>
            </>
          )}
        </div>
      </div>

      {/* 主内容区 */}
      <div style={mainStyle}>
        {children}
      </div>
    </div>
  );
}
