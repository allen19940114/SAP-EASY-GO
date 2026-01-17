'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { API_ENDPOINTS } from '@/config/env';

interface Executor {
  id: string;
  name: string;
  description: string;
  tcode: string;
  api: string;
  moduleId: string;
  moduleName: string;
  parameters: any[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  executor?: Executor;  // Optional executor data
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [llmMode, setLlmMode] = useState<'demo' | 'production'>('demo');
  const [llmProvider, setLlmProvider] = useState<string>('Demo Mode');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.chat(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      const data = await response.json();

      // Update LLM mode and provider
      if (data.mode) setLlmMode(data.mode);
      if (data.provider) setLlmProvider(data.provider);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        executor: data.hasExecutor && data.executor ? data.executor : undefined,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，连接后端服务失败。请检查后端服务是否正常运行。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickSuggestions = [
    {
      icon: '👋',
      text: '你好，介绍一下你的功能',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: '📝',
      text: '如何创建一个SAP项目？',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: '💰',
      text: '查询当前预算情况',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: '📚',
      text: '知识库有什么功能？',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  return (
    <Layout>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: 'transparent'
      }}>
        {/* 顶部标题栏 - 玻璃质感 */}
        <div className="fade-in" style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(15px) saturate(180%)',
          WebkitBackdropFilter: 'blur(15px) saturate(180%)',
          borderBottom: '1px solid rgba(102, 126, 234, 0.15)',
          padding: '24px 32px',
          boxShadow: '0 4px 12px 0 rgba(31, 38, 135, 0.08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
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
                gap: '10px',
              }}>
                <span style={{ fontSize: '32px' }}>💬</span>
                AI 智能对话
              </h1>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '14px',
                color: '#64748b',
                fontWeight: 500,
              }}>
                与OLORA AI助手对话，处理SAP业务、查询知识库、生成报表
              </p>
            </div>

            {/* LLM 模式指示器 - 玻璃卡片 */}
            <div style={{
              background: llmMode === 'production'
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(245, 158, 11, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: llmMode === 'production'
                ? '1px solid rgba(16, 185, 129, 0.3)'
                : '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '14px',
              padding: '12px 20px',
              boxShadow: llmMode === 'production'
                ? '0 4px 15px rgba(16, 185, 129, 0.15)'
                : '0 4px 15px rgba(245, 158, 11, 0.15)',
            }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>
                LLM 模式
              </div>
              <div style={{
                fontSize: '15px',
                fontWeight: 700,
                color: llmMode === 'production' ? '#10b981' : '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: llmMode === 'production' ? '#10b981' : '#f59e0b',
                  boxShadow: llmMode === 'production'
                    ? '0 0 10px rgba(16, 185, 129, 0.6)'
                    : '0 0 10px rgba(245, 158, 11, 0.6)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }} />
                {llmMode === 'production' ? '正式模式' : '演示模式'}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontWeight: 500 }}>
                {llmProvider}
              </div>
            </div>
          </div>
        </div>

        {/* 消息区域 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px',
        }}>
          {messages.length === 0 ? (
            /* 欢迎屏幕 */
            <div className="fade-in" style={{
              textAlign: 'center',
              padding: '60px 20px',
              maxWidth: '1000px',
              margin: '0 auto',
            }}>
              {/* AI 机器人图标 - 浮动动画 */}
              <div style={{
                fontSize: '96px',
                marginBottom: '24px',
                filter: 'drop-shadow(0 8px 16px rgba(102, 126, 234, 0.3))',
                animation: 'float 3s ease-in-out infinite',
              }}>
                🤖
              </div>

              <h2 style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '16px',
                fontSize: '36px',
                fontWeight: 700,
              }}>
                欢迎使用 OLORA AI 助手
              </h2>

              <p style={{
                fontSize: '16px',
                marginBottom: '48px',
                color: '#64748b',
                lineHeight: 1.8,
                fontWeight: 500,
              }}>
                我可以帮您处理SAP业务操作、查询知识库、生成报表等
              </p>

              {/* 快速建议卡片 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
                maxWidth: '960px',
                margin: '0 auto'
              }}>
                {quickSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => setInputValue(suggestion.text)}
                    className={`glass-card fade-in delay-${(idx + 1) * 100}`}
                    style={{
                      padding: '24px',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 16px 48px 0 rgba(102, 126, 234, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.15)';
                    }}
                  >
                    {/* 渐变装饰 */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: suggestion.gradient,
                    }} />

                    <div style={{
                      fontSize: '36px',
                      marginBottom: '12px',
                      filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2))',
                    }}>
                      {suggestion.icon}
                    </div>
                    <p style={{
                      margin: 0,
                      color: '#334155',
                      fontSize: '15px',
                      lineHeight: 1.6,
                      fontWeight: 500,
                    }}>
                      {suggestion.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* 消息列表 */}
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`fade-in delay-${Math.min(index, 5) * 50}`}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '24px',
              }}
            >
              <div style={{
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                  : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(15px) saturate(180%)',
                WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                padding: '16px 20px',
                borderRadius: '16px',
                maxWidth: '70%',
                boxShadow: msg.role === 'user'
                  ? '0 4px 15px rgba(102, 126, 234, 0.2)'
                  : '0 4px 15px rgba(31, 38, 135, 0.1)',
                border: msg.role === 'user'
                  ? '1px solid rgba(102, 126, 234, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.4)',
                position: 'relative',
              }}>
                {/* 角色标签 */}
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: msg.role === 'user' ? '#667eea' : '#64748b',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <span style={{ fontSize: '14px' }}>
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </span>
                  {msg.role === 'user' ? '您' : 'OLORA AI'}
                </div>

                {/* 消息内容 */}
                <div style={{
                  color: '#1e293b',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '15px',
                  fontWeight: 450,
                }}>
                  {msg.content}
                </div>

                {/* Executor 执行卡片 */}
                {msg.executor && (
                  <div style={{
                    marginTop: '16px',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#667eea',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span style={{ fontSize: '18px' }}>🔧</span>
                      SAP 操作执行卡片
                    </div>

                    <div style={{
                      background: 'white',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '12px',
                      fontSize: '13px',
                    }}>
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#667eea' }}>操作名称：</strong>
                        <span style={{ color: '#1e293b' }}>{msg.executor.name}</span>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#667eea' }}>T-Code：</strong>
                        <span style={{ color: '#1e293b', fontFamily: 'monospace' }}>{msg.executor.tcode}</span>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#667eea' }}>BAPI：</strong>
                        <span style={{ color: '#1e293b', fontFamily: 'monospace', fontSize: '12px' }}>{msg.executor.api}</span>
                      </div>
                      <div>
                        <strong style={{ color: '#667eea' }}>所属模块：</strong>
                        <span style={{ color: '#1e293b' }}>{msg.executor.moduleName}</span>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                    }}>
                      <button
                        onClick={() => window.location.href = '/executors'}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '10px 16px',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                        }}
                      >
                        ✨ 前往执行器页面
                      </button>
                      <button
                        onClick={() => setInputValue(`查看 ${msg.executor!.id} 的详细参数`)}
                        style={{
                          flex: 1,
                          background: 'white',
                          color: '#667eea',
                          border: '2px solid #667eea',
                          borderRadius: '8px',
                          padding: '10px 16px',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f0f4ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                        }}
                      >
                        📋 查看参数
                      </button>
                    </div>
                  </div>
                )}

                {/* 时间戳 */}
                <div style={{
                  fontSize: '11px',
                  color: '#94a3b8',
                  marginTop: '10px',
                  fontWeight: 500,
                }}>
                  {msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* 加载动画 */}
          {isLoading ? (
            <div className="fade-in" style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '24px',
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(15px) saturate(180%)',
                WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                padding: '16px 20px',
                borderRadius: '16px',
                boxShadow: '0 4px 15px rgba(31, 38, 135, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
                  <span style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>
                    AI 正在思考...
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 - 玻璃质感 */}
        <div className="fade-in" style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(15px) saturate(180%)',
          WebkitBackdropFilter: 'blur(15px) saturate(180%)',
          borderTop: '1px solid rgba(102, 126, 234, 0.15)',
          padding: '24px 32px',
          boxShadow: '0 -4px 12px 0 rgba(31, 38, 135, 0.08)',
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', maxWidth: '1400px', margin: '0 auto' }}>
            {/* 输入框 */}
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题... (Enter发送，Shift+Enter换行)"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '14px 18px',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '14px',
                resize: 'none',
                minHeight: '52px',
                maxHeight: '200px',
                fontSize: '15px',
                fontFamily: 'inherit',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#1e293b',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(31, 38, 135, 0.08)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#667eea';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1), 0 4px 12px rgba(102, 126, 234, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(31, 38, 135, 0.08)';
              }}
            />

            {/* 发送按钮 - 渐变设计 */}
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="btn-primary"
              style={{
                background: isLoading || !inputValue.trim()
                  ? 'rgba(203, 213, 225, 0.5)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '14px',
                cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                height: '52px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isLoading || !inputValue.trim()
                  ? 'none'
                  : '0 4px 15px rgba(102, 126, 234, 0.3)',
                opacity: isLoading || !inputValue.trim() ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading && inputValue.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && inputValue.trim()) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                  发送中...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  发送
                  <span style={{ fontSize: '16px' }}>✨</span>
                </span>
              )}
            </button>
          </div>

          {/* 提示文字 */}
          <div style={{
            marginTop: '12px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#94a3b8',
            fontWeight: 500,
          }}>
            💡 按 <kbd style={{
              padding: '2px 6px',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '11px',
            }}>Enter</kbd> 发送消息，<kbd style={{
              padding: '2px 6px',
              background: 'rgba(102, 126, 234, 0.1)',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '11px',
            }}>Shift + Enter</kbd> 换行
          </div>
        </div>
      </div>
    </Layout>
  );
}
