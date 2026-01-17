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
    { path: '/', icon: '💬', label: 'AI对话', description: '智能助手聊天', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { path: '/executors', icon: '🔧', label: 'SAP Executors', description: 'BAPI接口管理', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
    { path: '/knowledge', icon: '📚', label: '知识库', description: '文档管理', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { path: '/mail', icon: '📧', label: '邮件管理', description: '邮箱连接读取', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { path: '/settings', icon: '⚙️', label: '系统设置', description: 'LLM配置', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { path: '/reports', icon: '📊', label: '报表中心', description: '数据分析', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { path: '/audit', icon: '📝', label: '审计日志', description: '操作记录', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
  ];

  const sidebarStyle: React.CSSProperties = {
    width: sidebarOpen ? '280px' : '80px',
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(25px) saturate(200%)',
    WebkitBackdropFilter: 'blur(25px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderLeft: 'none',
    height: '100vh',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000,
    boxShadow: '4px 0 24px 0 rgba(31, 38, 135, 0.1)',
  };

  const mainStyle: React.CSSProperties = {
    marginLeft: sidebarOpen ? '280px' : '80px',
    transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    minHeight: '100vh',
    background: 'transparent',
  };

  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      {/* 侧边栏 */}
      <div style={sidebarStyle} className="fade-in">
        {/* Logo区域 - 玻璃质感 */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(102, 126, 234, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        }}>
          {sidebarOpen ? (
            <div style={{ flex: 1 }}>
              <h1 style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  fontSize: '32px',
                  filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))',
                }}>🤖</span>
                OLORA
              </h1>
              <p style={{
                margin: '6px 0 0 0',
                fontSize: '12px',
                color: '#667eea',
                fontWeight: 500,
                letterSpacing: '0.5px',
              }}>
                ✨ 企业级 AI 智能助手
              </p>
            </div>
          ) : (
            <div style={{
              fontSize: '36px',
              filter: 'drop-shadow(0 2px 8px rgba(102, 126, 234, 0.4))',
              animation: 'float 3s ease-in-out infinite',
            }}>🤖</div>
          )}

          {/* 展开/收起按钮 */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(102, 126, 234, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              color: '#667eea',
              padding: '10px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.15)';
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* 菜单项 - 玻璃卡片设计 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px 0',
          scrollbarWidth: 'thin',
        }}>
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`fade-in delay-${(index + 1) * 100}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: sidebarOpen ? '16px 16px' : '16px 0',
                  margin: sidebarOpen ? '8px 12px' : '8px 20px',
                  borderRadius: '14px',
                  background: isActive
                    ? 'rgba(102, 126, 234, 0.15)'
                    : 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: isActive
                    ? '1px solid rgba(102, 126, 234, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.5)',
                  color: isActive ? '#667eea' : '#64748b',
                  textDecoration: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isActive
                    ? '0 4px 15px rgba(102, 126, 234, 0.2)'
                    : '0 2px 8px rgba(31, 38, 135, 0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px) scale(1.02)';
                  e.currentTarget.style.background = isActive
                    ? 'rgba(102, 126, 234, 0.2)'
                    : 'rgba(255, 255, 255, 0.6)';
                  e.currentTarget.style.boxShadow = isActive
                    ? '0 8px 20px rgba(102, 126, 234, 0.3)'
                    : '0 4px 12px rgba(31, 38, 135, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0) scale(1)';
                  e.currentTarget.style.background = isActive
                    ? 'rgba(102, 126, 234, 0.15)'
                    : 'rgba(255, 255, 255, 0.4)';
                  e.currentTarget.style.boxShadow = isActive
                    ? '0 4px 15px rgba(102, 126, 234, 0.2)'
                    : '0 2px 8px rgba(31, 38, 135, 0.08)';
                }}
              >
                {/* 渐变装饰条 */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: item.gradient,
                    borderRadius: '0 4px 4px 0',
                  }} />
                )}

                {/* 图标 */}
                <span style={{
                  fontSize: '26px',
                  minWidth: '26px',
                  filter: isActive
                    ? 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))'
                    : 'none',
                  transition: 'all 0.3s ease',
                }}>{item.icon}</span>

                {/* 文字内容 */}
                {sidebarOpen && (
                  <div style={{ marginLeft: '14px', flex: 1 }}>
                    <div style={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '15px',
                      marginBottom: '2px',
                      color: isActive ? '#667eea' : '#334155',
                    }}>{item.label}</div>
                    <div style={{
                      fontSize: '11px',
                      color: isActive ? '#8b9cef' : '#94a3b8',
                      fontWeight: 400,
                    }}>
                      {item.description}
                    </div>
                  </div>
                )}

                {/* 活跃指示器 */}
                {isActive && sidebarOpen && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: item.gradient,
                    boxShadow: '0 0 10px rgba(102, 126, 234, 0.5)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* 底部状态信息 - 玻璃卡片 */}
        <div style={{
          padding: sidebarOpen ? '16px' : '12px',
          borderTop: '1px solid rgba(102, 126, 234, 0.15)',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
        }}>
          {sidebarOpen ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderRadius: '12px',
              padding: '12px',
            }}>
              <div style={{ marginBottom: '10px' }}>
                <div style={{
                  fontSize: '12px',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#10b981',
                  fontWeight: 500,
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    marginRight: '8px',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }} />
                  后端API 运行中
                </div>
                <div style={{
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#10b981',
                  fontWeight: 500,
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    marginRight: '8px',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }} />
                  数据库已连接
                </div>
              </div>
              <div style={{
                fontSize: '11px',
                color: '#94a3b8',
                fontWeight: 500,
                paddingTop: '8px',
                borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span>v1.0.0</span>
                <span style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 600,
                }}>2026-01-17</span>
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#10b981',
                margin: '0 auto',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }} />
            </div>
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
