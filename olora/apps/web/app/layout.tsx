import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OLORA - SAP AI Agent',
  description: 'Enterprise AI Assistant for SAP Business Operations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
