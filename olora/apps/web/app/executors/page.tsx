'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';

interface ExecutorParameter {
  name: string;
  label: string;
  type: string;
  required: boolean;
  description?: string;
  default?: string;
  schema?: Record<string, string>;
}

interface Executor {
  id: string;
  name: string;
  description: string;
  tcode: string;
  api: string;
  method: string;
  keywords: string[];
  parameters: ExecutorParameter[];
  moduleId?: string;
  moduleName?: string;
  moduleIcon?: string;
}

interface Module {
  id: string;
  name: string;
  icon: string;
  description: string;
  executors: Executor[];
}

export default function ExecutorsPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedExecutor, setSelectedExecutor] = useState<Executor | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Executor[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [executeParams, setExecuteParams] = useState<Record<string, any>>({});
  const [executeResult, setExecuteResult] = useState<any>(null);

  useEffect(() => {
    loadModules();
    loadStats();
  }, []);

  const loadModules = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/executors/modules');
      const data = await response.json();
      if (data.success) {
        setModules(data.modules);
        if (data.modules.length > 0) {
          setSelectedModule(data.modules[0].id);
        }
      }
    } catch (error) {
      console.error('Load modules error:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/executors/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3002/api/executors/search/${encodeURIComponent(searchKeyword)}`);
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleExecute = async () => {
    if (!selectedExecutor) return;

    try {
      const response = await fetch('http://localhost:3002/api/executors/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          executorId: selectedExecutor.id,
          params: executeParams,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setExecuteResult(data.result);
        alert('✅ 执行成功!');
      } else {
        alert('❌ 执行失败: ' + data.message);
      }
    } catch (error) {
      console.error('Execute error:', error);
      alert('❌ 执行失败');
    }
  };

  const currentModule = modules.find((m) => m.id === selectedModule);
  const executorsToDisplay = searchKeyword.trim() ? searchResults : currentModule?.executors || [];

  return (
    <Layout>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#333', fontWeight: 600 }}>
            🔧 SAP Executors
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
            SAP BAPI 接口管理与执行
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px',
              borderRadius: '12px',
              color: 'white',
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalModules}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>SAP 模块</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '20px',
              borderRadius: '12px',
              color: 'white',
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalExecutors}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>可用接口</div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div style={{
          background: 'white',
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '12px',
        }}>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="搜索 Executor (名称、描述、T-Code...)"
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 24px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            🔍 搜索
          </button>
          {searchKeyword && (
            <button
              onClick={() => {
                setSearchKeyword('');
                setSearchResults([]);
              }}
              style={{
                padding: '10px 20px',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              清除
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Module Tabs (只在非搜索模式显示) */}
          {!searchKeyword.trim() && (
            <div style={{
              width: '240px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '16px',
              height: 'fit-content',
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>
                SAP 模块
              </h3>
              {modules.map((module) => (
                <div
                  key={module.id}
                  onClick={() => setSelectedModule(module.id)}
                  style={{
                    padding: '12px',
                    margin: '4px 0',
                    borderRadius: '8px',
                    background: selectedModule === module.id ? '#e6f7ff' : 'transparent',
                    border: selectedModule === module.id ? '1px solid #1890ff' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedModule !== module.id) {
                      e.currentTarget.style.background = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedModule !== module.id) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{module.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                    {module.id}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {module.executors.length} 个接口
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Executor List */}
          <div style={{ flex: 1 }}>
            {searchKeyword.trim() && (
              <div style={{
                padding: '12px 16px',
                background: '#f0f7ff',
                border: '1px solid #bae7ff',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px',
              }}>
                🔍 搜索结果: {searchResults.length} 个匹配项
              </div>
            )}

            {currentModule && !searchKeyword.trim() && (
              <div style={{
                padding: '20px',
                background: 'white',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{currentModule.icon}</div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 600 }}>
                  {currentModule.name}
                </h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                  {currentModule.description}
                </p>
              </div>
            )}

            <div style={{ display: 'grid', gap: '16px' }}>
              {executorsToDisplay.map((executor) => (
                <div
                  key={executor.id}
                  onClick={() => setSelectedExecutor(executor)}
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: selectedExecutor?.id === executor.id
                      ? '0 4px 12px rgba(24,144,255,0.3)'
                      : '0 1px 3px rgba(0,0,0,0.1)',
                    border: selectedExecutor?.id === executor.id ? '2px solid #1890ff' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedExecutor?.id !== executor.id) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedExecutor?.id !== executor.id) {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600 }}>
                        {executor.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                        {executor.description}
                      </p>
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      background: '#f0f0f0',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}>
                      {executor.tcode}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#999' }}>
                    <span>📡 {executor.api}</span>
                    <span>🔹 {executor.method}</span>
                    <span>📂 {executor.moduleId || '未分类'}</span>
                  </div>

                  {selectedExecutor?.id === executor.id && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <strong style={{ fontSize: '13px' }}>关键词:</strong>
                        <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {executor.keywords.map((keyword, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: '2px 8px',
                                background: '#e6f7ff',
                                border: '1px solid #91d5ff',
                                borderRadius: '4px',
                                fontSize: '11px',
                              }}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: '12px' }}>
                        <strong style={{ fontSize: '13px' }}>参数列表:</strong>
                        <div style={{ marginTop: '8px' }}>
                          {executor.parameters.map((param, idx) => (
                            <div
                              key={idx}
                              style={{
                                padding: '8px',
                                background: '#fafafa',
                                borderRadius: '4px',
                                marginBottom: '6px',
                                fontSize: '12px',
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>{param.label}</span>
                              {param.required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                              <span style={{ marginLeft: '8px', color: '#999' }}>
                                ({param.type})
                              </span>
                              {param.description && (
                                <div style={{ color: '#666', marginTop: '4px' }}>
                                  {param.description}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowExecuteDialog(true);
                          setExecuteParams({});
                          setExecuteResult(null);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: '#52c41a',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        ▶️ 执行此操作
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {executorsToDisplay.length === 0 && (
              <div style={{
                background: 'white',
                padding: '60px 20px',
                borderRadius: '12px',
                textAlign: 'center',
                color: '#999',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                <div>暂无数据</div>
              </div>
            )}
          </div>
        </div>

        {/* Execute Dialog */}
        {showExecuteDialog && selectedExecutor && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
            onClick={() => setShowExecuteDialog(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
            >
              <h2 style={{ margin: '0 0 20px 0', fontSize: '20px' }}>
                执行: {selectedExecutor.name}
              </h2>

              {selectedExecutor.parameters.map((param) => (
                <div key={param.name} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>
                    {param.label}
                    {param.required && <span style={{ color: 'red' }}> *</span>}
                  </label>
                  <input
                    type={param.type === 'number' ? 'number' : param.type === 'date' ? 'date' : 'text'}
                    value={executeParams[param.name] || ''}
                    onChange={(e) => setExecuteParams({ ...executeParams, [param.name]: e.target.value })}
                    placeholder={param.description || `请输入${param.label}`}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />
                </div>
              ))}

              {executeResult && (
                <div style={{
                  padding: '16px',
                  background: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '6px',
                  marginBottom: '16px',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>执行结果:</div>
                  <pre style={{ margin: 0, fontSize: '12px', overflow: 'auto' }}>
                    {JSON.stringify(executeResult, null, 2)}
                  </pre>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowExecuteDialog(false)}
                  style={{
                    padding: '10px 20px',
                    background: '#f0f0f0',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  取消
                </button>
                <button
                  onClick={handleExecute}
                  style={{
                    padding: '10px 20px',
                    background: '#1890ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  ▶️ 执行
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
