/**
 * 环境配置模块
 * 统一管理所有环境变量和API配置
 */

export const ENV_CONFIG = {
  // API配置
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002',

  // 环境信息
  ENV: process.env.NEXT_PUBLIC_ENV || 'development',
  IS_DEV: process.env.NEXT_PUBLIC_ENV !== 'production',
  IS_PROD: process.env.NEXT_PUBLIC_ENV === 'production',
} as const;

/**
 * API端点构建器
 */
export const API_ENDPOINTS = {
  // Chat相关
  chat: () => `${ENV_CONFIG.API_URL}/api/chat`,

  // 知识库相关
  knowledge: {
    documents: () => `${ENV_CONFIG.API_URL}/api/knowledge/documents`,
    upload: () => `${ENV_CONFIG.API_URL}/api/knowledge/upload`,
    document: (id: string) => `${ENV_CONFIG.API_URL}/api/knowledge/documents/${id}`,
  },

  // 报表相关
  reports: {
    generate: (endpoint: string) => `${ENV_CONFIG.API_URL}/api/reports/${endpoint}`,
    export: () => `${ENV_CONFIG.API_URL}/api/reports/export`,
  },

  // 设置相关
  settings: {
    get: () => `${ENV_CONFIG.API_URL}/api/settings`,
    update: () => `${ENV_CONFIG.API_URL}/api/settings`,
  },

  // 邮件相关
  mail: {
    providers: () => `${ENV_CONFIG.API_URL}/api/mail/providers`,
    testConnection: () => `${ENV_CONFIG.API_URL}/api/mail/test-connection`,
    inboxStats: () => `${ENV_CONFIG.API_URL}/api/mail/inbox-stats`,
    fetchEmails: () => `${ENV_CONFIG.API_URL}/api/mail/fetch-emails`,
  },

  // 认证相关
  auth: {
    register: () => `${ENV_CONFIG.API_URL}/api/auth/register`,
    login: () => `${ENV_CONFIG.API_URL}/api/auth/login`,
  },
} as const;

/**
 * 获取完整的API URL
 */
export function getApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${ENV_CONFIG.API_URL}${normalizedPath}`;
}

/**
 * 获取完整的WebSocket URL
 */
export function getWsUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${ENV_CONFIG.WS_URL}${normalizedPath}`;
}
