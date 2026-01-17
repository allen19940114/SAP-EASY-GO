'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.error('Failed to fetch health:', err));
  }, []);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
        OLORA
      </h1>
      <p style={{ fontSize: '20px', color: '#666', marginBottom: '40px' }}>
        Enterprise AI Assistant for SAP Business Operations
      </p>

      <div
        style={{
          background: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ marginBottom: '10px' }}>System Status</h2>
        {health ? (
          <pre style={{ background: '#fff', padding: '15px', borderRadius: '4px' }}>
            {JSON.stringify(health, null, 2)}
          </pre>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Features (0/32 completed)</h3>
        <ul style={{ lineHeight: '2' }}>
          <li>✅ F001: Project Initialization & Monorepo Setup</li>
          <li>⏳ F002: Database Design & Prisma Integration</li>
          <li>⏳ F003: User Authentication (JWT)</li>
          <li>⏳ F007: LLM Integration (OpenAI + DeepSeek + Gemini)</li>
        </ul>
      </div>
    </div>
  );
}
