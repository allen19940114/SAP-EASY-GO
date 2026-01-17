'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { API_ENDPOINTS } from '@/config/env';

interface Document {
  id: string;
  name: string;
  size: string;
  uploadTime: string;
  status: string;
}

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.knowledge.documents());
      const data = await response.json();
      if (data.success) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const response = await fetch(API_ENDPOINTS.knowledge.upload(), {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert('文件上传成功！');
        loadDocuments();
      } else {
        alert('上传失败: ' + data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传失败，请检查后端服务是否运行');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个文档吗？')) return;

    try {
      const response = await fetch(API_ENDPOINTS.knowledge.document(id), {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        alert('删除成功');
        loadDocuments();
      } else {
        alert('删除失败: ' + data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('删除失败，请检查后端服务是否运行');
    }
  };

  const handleView = async (id: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.knowledge.document(id));
      const data = await response.json();
      if (data.success && data.document.content) {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`<pre>${data.document.content}</pre>`);
          newWindow.document.title = data.document.name;
        }
      } else {
        alert('此文件类型暂不支持预览');
      }
    } catch (error) {
      console.error('View error:', error);
      alert('查看失败');
    }
  };

  return (
    <Layout>
      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#333', fontWeight: 600 }}>
              📚 知识库管理
            </h1>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
              上传和管理业务文档，支持智能检索和问答
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.md"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              onClick={handleFileUpload}
              disabled={isUploading}
              style={{
                background: isUploading ? '#d9d9d9' : '#1890ff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: isUploading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isUploading) e.currentTarget.style.background = '#096dd9';
              }}
              onMouseLeave={(e) => {
                if (!isUploading) e.currentTarget.style.background = '#1890ff';
              }}
            >
              {isUploading ? '⏳ 上传中...' : '📤 上传文档'}
            </button>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              <p>加载中...</p>
            </div>
          ) : documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📁</div>
              <p>暂无文档，点击"上传文档"开始添加</p>
            </div>
          ) : (
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
                    <td style={{ padding: '14px 12px', fontSize: '14px', color: '#333' }}>
                      📄 {doc.name}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#666' }}>{doc.size}</td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#666' }}>{doc.uploadTime}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{
                        background: doc.status === '已处理' ? '#f6ffed' : '#fff7e6',
                        color: doc.status === '已处理' ? '#52c41a' : '#fa8c16',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}>
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <button
                        onClick={() => handleView(doc.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#1890ff',
                          cursor: 'pointer',
                          marginRight: '16px',
                          fontSize: '13px',
                        }}
                      >
                        查看
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ff4d4f',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{
          marginTop: '24px',
          padding: '16px 20px',
          background: '#e6f7ff',
          border: '1px solid #91d5ff',
          borderRadius: '8px',
        }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#0050b3', lineHeight: 1.6 }}>
            💡 <strong>支持的文件格式</strong>：PDF、Word (.doc/.docx)、文本文件 (.txt/.md)<br />
            📁 <strong>文件大小限制</strong>：单个文件最大 50 MB<br />
            🔍 <strong>智能检索</strong>：上传的文档将自动建立索引，可在AI对话中直接引用
          </p>
        </div>
      </div>
    </Layout>
  );
}
