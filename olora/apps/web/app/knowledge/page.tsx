'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function KnowledgePage() {
  const [documents, setDocuments] = useState([
    { id: '1', name: 'SAP操作手册.pdf', size: '2.5 MB', uploadTime: '2026-01-15', status: '已处理' },
    { id: '2', name: '项目管理流程.docx', size: '1.2 MB', uploadTime: '2026-01-14', status: '已处理' },
    { id: '3', name: '预算审批规范.pdf', size: '850 KB', uploadTime: '2026-01-13', status: '已处理' },
  ]);

  const handleFileUpload = () => {
    alert('文件上传功能：请选择PDF、Word或TXT文件。上传后将自动解析并向量化存储到Qdrant。');
  };

  return (
    <Layout>
      <div style={{ padding: '32px' }}>
        {/* 标题栏 */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#333', fontWeight: 600 }}>
            📚 知识库管理
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
            上传业务文档，支持智能检索和问答
          </p>
        </div>

        {/* 操作栏 */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#333', fontWeight: 600 }}>
                文档列表
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#999' }}>
                共 {documents.length} 个文档
              </p>
            </div>
            <button
              onClick={handleFileUpload}
              style={{
                background: '#1890ff',
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#096dd9'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#1890ff'}
            >
              📤 上传文档
            </button>
          </div>

          {/* 文档表格 */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#666' }}>文档名称</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#666' }}>大小</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#666' }}>上传时间</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#666' }}>状态</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#666' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '16px 12px', fontSize: '14px', color: '#333' }}>
                      📄 {doc.name}
                    </td>
                    <td style={{ padding: '16px 12px', fontSize: '14px', color: '#666' }}>{doc.size}</td>
                    <td style={{ padding: '16px 12px', fontSize: '14px', color: '#666' }}>{doc.uploadTime}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <span style={{
                        background: '#f6ffed',
                        color: '#52c41a',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}>
                        ✓ {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <button style={{
                        background: 'transparent',
                        border: '1px solid #d9d9d9',
                        padding: '6px 16px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        marginRight: '8px',
                      }}>
                        查看
                      </button>
                      <button style={{
                        background: 'transparent',
                        border: '1px solid #ff4d4f',
                        color: '#ff4d4f',
                        padding: '6px 16px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}>
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 功能说明 */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#333', fontWeight: 600 }}>
            💡 知识库功能说明
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', background: '#f6ffed', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>📤</div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 600, color: '#333' }}>文档上传</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                支持PDF、Word、TXT等格式，自动解析文档内容并分块存储
              </p>
            </div>
            <div style={{ padding: '16px', background: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🔍</div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 600, color: '#333' }}>语义搜索</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                基于Qdrant向量数据库，支持语义相似度检索，找到最相关的文档片段
              </p>
            </div>
            <div style={{ padding: '16px', background: '#fff7e6', borderRadius: '8px', border: '1px solid #ffd591' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>💬</div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 600, color: '#333' }}>智能问答</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.5 }}>
                在AI对话中自动检索相关文档，提供精准的上下文信息
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
