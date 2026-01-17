'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { API_ENDPOINTS } from '@/config/env';

interface EmailProvider {
  name: string;
  imap_host: string;
  imap_port: number;
  use_ssl: boolean;
}

interface EmailConfig {
  email: string;
  password: string;
  username?: string;
  imap_host: string;
  imap_port: number;
  use_ssl: boolean;
}

interface Email {
  id: string;
  subject: string;
  from: string;
  fromName: string;
  date: string;
  text: string;
  html: string;
  isRead: boolean;
  hasAttachments: boolean;
}

export default function MailPage() {
  const [providers, setProviders] = useState<Record<string, EmailProvider>>({});
  const [selectedProvider, setSelectedProvider] = useState<string>('qq');
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    email: '',
    password: '',
    imap_host: '',
    imap_port: 993,
    use_ssl: true,
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [stats, setStats] = useState<{ total: number; unread: number } | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (selectedProvider && providers[selectedProvider]) {
      const provider = providers[selectedProvider];
      setEmailConfig((prev) => ({
        ...prev,
        imap_host: provider.imap_host,
        imap_port: provider.imap_port,
        use_ssl: provider.use_ssl,
      }));
    }
  }, [selectedProvider, providers]);

  const loadProviders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.mail.providers());
      const data = await response.json();
      if (data.success) {
        setProviders(data.providers);
      }
    } catch (error) {
      console.error('Load providers error:', error);
    }
  };

  const testConnection = async () => {
    if (!emailConfig.email || !emailConfig.password) {
      alert('请填写邮箱地址和密码/授权码');
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch(API_ENDPOINTS.mail.testConnection(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailConfig),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ 连接成功！');
        setIsConnected(true);
        loadInboxStats();
      } else {
        alert('❌ 连接失败: ' + (data.error || '未知错误'));
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Test connection error:', error);
      alert('❌ 连接失败，请检查网络');
      setIsConnected(false);
    } finally {
      setIsTesting(false);
    }
  };

  const loadInboxStats = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.mail.inboxStats(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailConfig),
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Load inbox stats error:', error);
    }
  };

  const fetchEmails = async () => {
    if (!isConnected) {
      alert('请先测试连接');
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch(API_ENDPOINTS.mail.fetchEmails(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: emailConfig,
          options: { limit: 50 },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEmails(data.emails);
        alert(`✅ 成功获取 ${data.count} 封邮件`);
      } else {
        alert('❌ 获取邮件失败: ' + data.message);
      }
    } catch (error) {
      console.error('Fetch emails error:', error);
      alert('❌ 获取邮件失败');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Layout>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#333', fontWeight: 600 }}>
            📧 邮件管理
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
            连接和读取邮箱邮件
          </p>
        </div>

        {/* Connection Setup */}
        {!isConnected && (
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 600 }}>
              📮 邮箱连接设置
            </h3>

            {/* Provider Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                邮箱服务商
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                {Object.entries(providers).map(([key, provider]) => (
                  <option key={key} value={key}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Email Address */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                邮箱地址
              </label>
              <input
                type="email"
                value={emailConfig.email}
                onChange={(e) => setEmailConfig({ ...emailConfig, email: e.target.value })}
                placeholder="your-email@example.com"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                密码/授权码
              </label>
              <input
                type="password"
                value={emailConfig.password}
                onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                placeholder="密码或授权码"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
                ⚠️ QQ/163/126 邮箱需要使用授权码，不是登录密码
              </p>
            </div>

            {/* Advanced Settings */}
            <details style={{ marginBottom: '20px' }}>
              <summary style={{
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                color: '#666',
                padding: '8px 0',
              }}>
                高级设置
              </summary>
              <div style={{ marginTop: '12px', paddingLeft: '16px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>
                    IMAP 服务器
                  </label>
                  <input
                    type="text"
                    value={emailConfig.imap_host}
                    onChange={(e) => setEmailConfig({ ...emailConfig, imap_host: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '13px',
                    }}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>
                    IMAP 端口
                  </label>
                  <input
                    type="number"
                    value={emailConfig.imap_port}
                    onChange={(e) => setEmailConfig({ ...emailConfig, imap_port: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '13px',
                    }}
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={emailConfig.use_ssl}
                    onChange={(e) => setEmailConfig({ ...emailConfig, use_ssl: e.target.checked })}
                  />
                  使用 SSL/TLS
                </label>
              </div>
            </details>

            {/* Test Button */}
            <button
              onClick={testConnection}
              disabled={isTesting}
              style={{
                width: '100%',
                padding: '12px',
                background: isTesting ? '#ccc' : '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: isTesting ? 'not-allowed' : 'pointer',
              }}
            >
              {isTesting ? '⏳ 测试连接中...' : '🔌 测试连接'}
            </button>
          </div>
        )}

        {/* Connected View */}
        {isConnected && (
          <>
            {/* Stats Card */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px',
              color: 'white',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', opacity: 0.9 }}>
                    ✅ 已连接: {emailConfig.email}
                  </h3>
                  {stats && (
                    <div style={{ fontSize: '14px', opacity: 0.85 }}>
                      📬 总邮件: {stats.total} 封 | 📫 未读: {stats.unread} 封
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={fetchEmails}
                    disabled={isFetching}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                      cursor: isFetching ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isFetching ? '⏳ 获取中...' : '📨 获取邮件'}
                  </button>
                  <button
                    onClick={() => setIsConnected(false)}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    🔌 断开连接
                  </button>
                </div>
              </div>
            </div>

            {/* Email List */}
            <div style={{ display: 'flex', gap: '24px' }}>
              {/* List Panel */}
              <div style={{
                flex: 1,
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                maxHeight: '600px',
                overflow: 'auto',
              }}>
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #f0f0f0',
                  fontWeight: 600,
                  fontSize: '16px',
                  position: 'sticky',
                  top: 0,
                  background: 'white',
                }}>
                  📬 收件箱 ({emails.length})
                </div>

                {emails.length === 0 ? (
                  <div style={{
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: '#999',
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                    <div>点击「获取邮件」按钮加载邮件</div>
                  </div>
                ) : (
                  emails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        background: selectedEmail?.id === email.id ? '#f0f7ff' : 'white',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedEmail?.id !== email.id) {
                          e.currentTarget.style.background = '#fafafa';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedEmail?.id !== email.id) {
                          e.currentTarget.style.background = 'white';
                        }
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                      }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: email.isRead ? 400 : 600,
                          color: '#333',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}>
                          {email.fromName || email.from}
                        </div>
                        <div style={{ fontSize: '12px', color: '#999', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                          {new Date(email.date).toLocaleDateString('zh-CN')}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: email.isRead ? '#666' : '#333',
                        fontWeight: email.isRead ? 400 : 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '4px',
                      }}>
                        {email.subject}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#999',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {email.text.substring(0, 100)}...
                      </div>
                      {email.hasAttachments && (
                        <div style={{ fontSize: '11px', color: '#1890ff', marginTop: '6px' }}>
                          📎 有附件
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Detail Panel */}
              {selectedEmail && (
                <div style={{
                  flex: 1,
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  maxHeight: '600px',
                  overflow: 'auto',
                }}>
                  <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #f0f0f0',
                    position: 'sticky',
                    top: 0,
                    background: 'white',
                  }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 600 }}>
                      {selectedEmail.subject}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                      <strong>发件人:</strong> {selectedEmail.fromName || selectedEmail.from}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      <strong>时间:</strong> {new Date(selectedEmail.date).toLocaleString('zh-CN')}
                    </div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    {selectedEmail.html ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                    ) : (
                      <pre style={{
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: '#333',
                      }}>
                        {selectedEmail.text}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
