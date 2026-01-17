'use client';

import React, { ReactNode } from 'react';

interface PageHeaderProps {
  icon: string;
  title: string;
  description: string;
  rightContent?: ReactNode;
  gradient?: string;
}

export default function PageHeader({
  icon,
  title,
  description,
  rightContent,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}: PageHeaderProps) {
  return (
    <div
      className="fade-in"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(15px) saturate(180%)',
        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
        borderBottom: '1px solid rgba(102, 126, 234, 0.15)',
        padding: '24px 32px',
        boxShadow: '0 4px 12px 0 rgba(31, 38, 135, 0.08)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 700,
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '32px' }}>{icon}</span>
            {title}
          </h1>
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: '14px',
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            {description}
          </p>
        </div>
        {rightContent && <div>{rightContent}</div>}
      </div>
    </div>
  );
}
