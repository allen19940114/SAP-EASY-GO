'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { getSocket, disconnectSocket } from '@/lib/socket-client';
import type { Socket } from 'socket.io-client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const token = useAuthStore((state) => state.token);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (token) {
      // 初始化 Socket.IO
      socketRef.current = getSocket(token);

      // 监听流式响应
      socketRef.current.on('chat:stream', ({ chunk }) => {
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.role === 'assistant') {
            return [...prev.slice(0, -1), { ...lastMsg, content: lastMsg.content + chunk }];
          }
          return [...prev, { role: 'assistant', content: chunk }];
        });
      });

      socketRef.current.on('chat:complete', () => {
        setIsStreaming(false);
      });

      // 加载会话
      fetch('http://localhost:3000/api/chat/sessions', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.length > 0) {
            setSessionId(data[0].id);
            loadMessages(data[0].id);
          } else {
            createSession();
          }
        });
    }

    return () => {
      disconnectSocket();
    };
  }, [token]);

  const createSession = async () => {
    const res = await fetch('http://localhost:3000/api/chat/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'New Chat' }),
    });
    const data = await res.json();
    setSessionId(data.id);
  };

  const loadMessages = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/chat/sessions/${id}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = async () => {
    if (!input.trim() || !socketRef.current) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    // 通过 WebSocket 发送消息
    socketRef.current.emit('chat:message', {
      sessionId,
      content: userMessage.content,
      provider: 'openai', // 可以改为动态选择
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>OLORA Chat</h1>
      <div style={{ height: '500px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
        {isStreaming && <div style={{ color: '#999' }}>正在输入...</div>}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '10px', marginRight: '10px' }}
          disabled={isStreaming}
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px' }} disabled={isStreaming}>
          Send
        </button>
      </div>
    </div>
  );
}
