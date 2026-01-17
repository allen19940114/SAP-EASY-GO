'use client';

import { useState, useEffect, useRef } from 'react';

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

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    background: '#f5f5f5'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
    color: 'white',
    padding: '20px 40px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
          🤖 OLORA AI 助手
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', opacity: 0.95 }}>
          企业级 SAP 智能对话系统 · 数据安全 · 知识检索 · 智能执行
        </p>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '30px 40px',
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: '#666'
          }}>
            <div style={{ fontSize: '72px', marginBottom: '24px' }}>🤖</div>
            <h2 style={{ color: '#333', marginBottom: '16px', fontSize: '32px', fontWeight: 600 }}>
              欢迎使用 OLORA AI 助手
            </h2>
            <p style={{ fontSize: '18px', marginBottom: '40px', color: '#666', lineHeight: 1.6 }}>
              我可以帮您处理SAP业务操作、查询知识库、生成报表等
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              maxWidth: '1000px',
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
                    padding: '24px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: '1px solid #e8e8e8',
                    transition: 'all 0.3s',
                  }}
                >
                  <p style={{ margin: 0, color: '#333', fontSize: '15px' }}>{suggestion.text}</p>
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
              marginBottom: '24px',
            }}
          >
            <div style={{
              background: msg.role === 'user' ? '#e6f7ff' : 'white',
              padding: '16px 20px',
              borderRadius: '16px',
              maxWidth: '75%',
            }}>
              <div style={{
                color: '#333',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.content}
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                {msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading ? (
          <div style={{ padding: '16px 20px' }}>
            <span>正在思考...</span>
          </div>
        ) : null}

        <div ref={messagesEndRef} />
      </div>

      <div style={{
        background: 'white',
        borderTop: '1px solid #e8e8e8',
        padding: '24px 40px',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '12px' }}>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '14px 18px',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              resize: 'none',
              minHeight: '50px',
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            style={{
              background: isLoading || !inputValue.trim() ? '#ccc' : '#1890ff',
              color: 'white',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '8px',
              cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
              height: '50px',
            }}
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
        <div style={{
          maxWidth: '1400px',
          margin: '12px auto 0',
          fontSize: '13px',
          color: '#999',
          textAlign: 'center',
        }}>
          💡 后端API运行在 http://localhost:3002
        </div>
      </div>
    </div>
  );
}
