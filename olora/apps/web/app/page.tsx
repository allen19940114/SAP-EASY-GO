'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await fetch('http://localhost:3002/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，连接后端服务失败。请确保后端服务运行在 http://localhost:3002',
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

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* 顶部标题栏 */}
        <div style={{
          background: 'white',
          padding: '20px 32px',
          borderBottom: '1px solid #e8e8e8',
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333', fontWeight: 600 }}>
            💬 AI 智能对话
          </h1>
          <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#666' }}>
            与OLORA AI助手对话，处理SAP业务、查询知识库、生成报表
          </p>
        </div>

        {/* 消息区域 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px',
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: '#666'
            }}>
              <div style={{ fontSize: '72px', marginBottom: '24px' }}>🤖</div>
              <h2 style={{ color: '#333', marginBottom: '16px', fontSize: '28px', fontWeight: 600 }}>
                欢迎使用 OLORA AI 助手
              </h2>
              <p style={{ fontSize: '16px', marginBottom: '40px', color: '#666', lineHeight: 1.6 }}>
                我可以帮您处理SAP业务操作、查询知识库、生成报表等
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                maxWidth: '900px',
                margin: '0 auto'
              }}>
                {[
                  { text: '你好，介绍一下你的功能' },
                  { text: '如何创建一个SAP项目？' },
                  { text: '查询当前预算情况' },
                  { text: '知识库有什么功能？' }
                ].map((suggestion, idx) => (
                  <div
                    key={idx}
                    onClick={() => setInputValue(suggestion.text)}
                    style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: '1px solid #e8e8e8',
                      transition: 'all 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#1890ff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(24,144,255,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e8e8e8';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                    }}
                  >
                    <p style={{ margin: 0, color: '#333', fontSize: '14px', lineHeight: 1.5 }}>
                      {suggestion.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '20px',
              }}
            >
              <div style={{
                background: msg.role === 'user' ? '#e6f7ff' : 'white',
                padding: '14px 18px',
                borderRadius: '12px',
                maxWidth: '70%',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                border: '1px solid ' + (msg.role === 'user' ? '#91d5ff' : '#e8e8e8'),
              }}>
                <div style={{
                  color: '#333',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontSize: '14px',
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '6px' }}>
                  {msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isLoading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '20px',
            }}>
              <div style={{
                background: 'white',
                padding: '14px 18px',
                borderRadius: '12px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                border: '1px solid #e8e8e8',
              }}>
                <span style={{ fontSize: '14px', color: '#666' }}>正在思考...</span>
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div style={{
          background: 'white',
          borderTop: '1px solid #e8e8e8',
          padding: '20px 32px',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题... (Enter发送，Shift+Enter换行)"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                resize: 'none',
                minHeight: '46px',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#1890ff'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#d9d9d9'}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              style={{
                background: isLoading || !inputValue.trim() ? '#d9d9d9' : '#1890ff',
                color: 'white',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                height: '46px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isLoading && inputValue.trim()) {
                  e.currentTarget.style.background = '#096dd9';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && inputValue.trim()) {
                  e.currentTarget.style.background = '#1890ff';
                }
              }}
            >
              {isLoading ? '发送中...' : '发送'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
