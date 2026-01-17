'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { API_ENDPOINTS } from '@/config/env';

export default function SettingsPage() {
  const [llmConfig, setLlmConfig] = useState({
    provider: 'openai',
    openaiKey: '',
    deepseekKey: '',
    geminiKey: '',
    temperature: 0.7,
    maxTokens: 2000,
  });

  const [qdrantConfig, setQdrantConfig] = useState({
    url: 'http://localhost:6333',
    collectionName: 'olora_knowledge',
    embeddingModel: 'text-embedding-ada-002',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.settings.get());
      const data = await response.json();
      if (data.success && data.config) {
        setLlmConfig(data.config.llm);
        setQdrantConfig(data.config.qdrant);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(API_ENDPOINTS.settings.update(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          llm: llmConfig,
          qdrant: qdrantConfig,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ 配置已成功保存到 .env 文件！\n\n⚠️ 重要提示：\n配置已持久化保存，但需要重启后端服务才能生效。\n\n重启命令：\n1. 停止后端: lsof -ti:3002 | xargs kill\n2. 启动后端: cd apps/backend && node src/standalone-api.ts');
      } else {
        alert('❌ 保存失败: ' + data.message);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ 保存失败，请检查后端服务是否运行');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div style={{ padding: '32px' }}>
        {/* 标题栏 */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#333', fontWeight: 600 }}>
            ⚙️ 系统设置
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
            配置LLM模型、向量数据库等核心参数
          </p>
        </div>

        {/* LLM配置 */}
        <div style={{
          background: 'white',
          padding: '28px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#333', fontWeight: 600 }}>
            🤖 大语言模型配置
          </h3>

          {/* 模型选择 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#333' }}>
              模型提供商
            </label>
            <select
              value={llmConfig.provider}
              onChange={(e) => setLlmConfig({ ...llmConfig, provider: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            >
              <option value="openai">OpenAI (GPT-4 / GPT-3.5)</option>
              <option value="deepseek">DeepSeek (国产大模型)</option>
              <option value="gemini">Google Gemini</option>
            </select>
          </div>

          {/* API Key 配置 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#333' }}>
              OpenAI API Key
            </label>
            <input
              type="password"
              placeholder="sk-..."
              value={llmConfig.openaiKey}
              onChange={(e) => setLlmConfig({ ...llmConfig, openaiKey: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#999' }}>
              在 <a href="https://platform.openai.com/api-keys" target="_blank" style={{ color: '#1890ff' }}>OpenAI控制台</a> 获取API密钥
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#333' }}>
              DeepSeek API Key
            </label>
            <input
              type="password"
              placeholder="sk-..."
              value={llmConfig.deepseekKey}
              onChange={(e) => setLlmConfig({ ...llmConfig, deepseekKey: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#999' }}>
              在 <a href="https://platform.deepseek.com" target="_blank" style={{ color: '#1890ff' }}>DeepSeek控制台</a> 获取API密钥
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#333' }}>
              Google Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AI..."
              value={llmConfig.geminiKey}
              onChange={(e) => setLlmConfig({ ...llmConfig, geminiKey: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#999' }}>
              在 <a href="https://makersuite.google.com/app/apikey" target="_blank" style={{ color: '#1890ff' }}>Google AI Studio</a> 获取API密钥
            </p>
          </div>

          {/* 模型参数 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Temperature (创造性)
              </label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={llmConfig.temperature}
                onChange={(e) => setLlmConfig({ ...llmConfig, temperature: parseFloat(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
              <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#999' }}>
                0-2之间，越高越有创造性
              </p>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#333' }}>
                Max Tokens (最大长度)
              </label>
              <input
                type="number"
                value={llmConfig.maxTokens}
                onChange={(e) => setLlmConfig({ ...llmConfig, maxTokens: parseInt(e.target.value) })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
              <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#999' }}>
                生成内容的最大长度
              </p>
            </div>
          </div>
        </div>

        {/* Qdrant配置 */}
        <div style={{
          background: 'white',
          padding: '28px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#333', fontWeight: 600 }}>
            🗄️ 向量数据库配置 (Qdrant)
          </h3>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#333' }}>
              Qdrant服务地址
            </label>
            <input
              type="text"
              value={qdrantConfig.url}
              onChange={(e) => setQdrantConfig({ ...qdrantConfig, url: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#999' }}>
              启动命令: <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>docker run -d -p 6333:6333 qdrant/qdrant</code>
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#333' }}>
              Collection名称
            </label>
            <input
              type="text"
              value={qdrantConfig.collectionName}
              onChange={(e) => setQdrantConfig({ ...qdrantConfig, collectionName: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#333' }}>
              Embedding模型
            </label>
            <select
              value={qdrantConfig.embeddingModel}
              onChange={(e) => setQdrantConfig({ ...qdrantConfig, embeddingModel: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              <option value="text-embedding-ada-002">text-embedding-ada-002 (OpenAI)</option>
              <option value="text-embedding-3-small">text-embedding-3-small (OpenAI)</option>
              <option value="text-embedding-3-large">text-embedding-3-large (OpenAI)</option>
            </select>
          </div>
        </div>

        {/* 保存按钮 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              background: isSaving ? '#d9d9d9' : '#1890ff',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isSaving) e.currentTarget.style.background = '#096dd9';
            }}
            onMouseLeave={(e) => {
              if (!isSaving) e.currentTarget.style.background = '#1890ff';
            }}
          >
            {isSaving ? '💾 保存中...' : '💾 保存配置'}
          </button>
        </div>

        {/* 提示信息 */}
        <div style={{
          marginTop: '24px',
          padding: '16px 20px',
          background: '#fff7e6',
          border: '1px solid #ffd591',
          borderRadius: '8px',
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#d46b08', lineHeight: 1.6 }}>
            💡 <strong>提示</strong>：配置保存后，需要重启后端服务才能生效。<br />
            配置文件路径：<code style={{ background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>apps/backend/.env</code>
          </p>
        </div>
      </div>
    </Layout>
  );
}
