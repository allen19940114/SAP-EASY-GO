'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

export default function ChatPage() {
  const token = useAuthStore((state) => state.token);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (token) {
      fetch('/api/chat/sessions', {
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
  }, [token]);

  const createSession = async () => {
    const res = await fetch('/api/chat/sessions', {
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
    const res = await fetch(`/api/chat/sessions/${id}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    await fetch(`/api/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: input }),
    });

    // AI response would come here via LLM
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
      </div>
      <div style={{ display: 'flex' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '10px', marginRight: '10px' }}
        />
        <button onClick={sendMessage} style={{ padding: '10px 20px' }}>Send</button>
      </div>
    </div>
  );
}
