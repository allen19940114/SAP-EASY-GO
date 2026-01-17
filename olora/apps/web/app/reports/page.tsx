'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { API_ENDPOINTS } from '@/config/env';

type ReportType = 'financial' | 'project' | 'budget' | 'cost_center' | 'resource' | 'performance';

interface ReportData {
  reportType: string;
  reportName: string;
  generatedAt: string;
  summary?: any;
  details?: any;
  kpis?: any[];
  [key: string]: any;
}

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<ReportType>('financial');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const reportTypes = [
    { key: 'financial', label: '💰 财务报表', description: '收入、支出、利润分析' },
    { key: 'project', label: '📊 项目报表', description: '项目进度和预算执行' },
    { key: 'budget', label: '💵 预算报表', description: '预算分配和使用情况' },
    { key: 'cost_center', label: '🏢 成本中心', description: '成本中心分析' },
    { key: 'resource', label: '👥 资源报表', description: '人力资源利用率' },
    { key: 'performance', label: '📈 绩效报表', description: 'KPI 和绩效分析' },
  ];

  const loadReport = async (type: ReportType) => {
    setIsLoading(true);
    try {
      const endpoint = type === 'cost_center' ? 'cost-center' : type;
      const response = await fetch(API_ENDPOINTS.reports.generate(endpoint));
      const data = await response.json();

      if (data.success) {
        setReportData(data.report);
      } else {
        alert('生成报表失败: ' + data.message);
      }
    } catch (error) {
      console.error('Load report error:', error);
      alert('加载报表失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport(selectedType);
  }, [selectedType]);

  const exportReport = async (format: 'json' | 'csv') => {
    if (!reportData) return;

    try {
      const response = await fetch(API_ENDPOINTS.reports.export(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: reportData, format }),
      });

      const data = await response.json();
      if (data.success) {
        // Download file
        const blob = new Blob([data.data], { type: format === 'json' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${reportData.reportType}_${Date.now()}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('导出失败');
    }
  };

  return (
    <Layout>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#333', fontWeight: 600 }}>
            📊 报表中心
          </h1>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>
            生成和查看各类 SAP 业务报表
          </p>
        </div>

        {/* Report Type Selector */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>选择报表类型</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}>
            {reportTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key as ReportType)}
                style={{
                  padding: '16px',
                  border: selectedType === type.key ? '2px solid #1890ff' : '1px solid #e0e0e0',
                  borderRadius: '8px',
                  background: selectedType === type.key ? '#e6f7ff' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                  {type.label}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {type.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        {isLoading ? (
          <div style={{
            background: 'white',
            padding: '60px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p style={{ margin: 0, color: '#666' }}>正在生成报表...</p>
          </div>
        ) : reportData ? (
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            {/* Report Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '2px solid #f0f0f0',
            }}>
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 600 }}>
                  {reportData.reportName}
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#999' }}>
                  生成时间: {new Date(reportData.generatedAt).toLocaleString('zh-CN')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => exportReport('json')}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  导出 JSON
                </button>
                <button
                  onClick={() => exportReport('csv')}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  导出 CSV
                </button>
                <button
                  onClick={() => loadReport(selectedType)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #1890ff',
                    borderRadius: '6px',
                    background: '#1890ff',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  🔄 刷新
                </button>
              </div>
            </div>

            {/* Summary Section */}
            {reportData.summary && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>
                  📋 摘要信息
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}>
                  {Object.entries(reportData.summary).map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        padding: '16px',
                        background: '#f7f9fc',
                        borderRadius: '8px',
                        border: '1px solid #e8ecf1',
                      }}
                    >
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                        {formatFieldName(key)}
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 600, color: '#1890ff' }}>
                        {formatValue(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KPIs Section */}
            {reportData.kpis && reportData.kpis.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>
                  🎯 关键绩效指标
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                }}>
                  {reportData.kpis.map((kpi: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        padding: '16px',
                        background: '#fff',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <div>
                          <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                            {kpi.name || kpi.category}
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: 600, color: '#333' }}>
                            {kpi.value} {kpi.unit || ''}
                          </div>
                        </div>
                        {kpi.trend && (
                          <div style={{ fontSize: '24px' }}>
                            {kpi.trend === 'up' ? '📈' : kpi.trend === 'down' ? '📉' : '➡️'}
                          </div>
                        )}
                        {kpi.status && (
                          <div style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            background: kpi.status === 'excellent' ? '#d4edda' :
                                       kpi.status === 'good' ? '#d1ecf1' :
                                       kpi.status === 'warning' ? '#fff3cd' : '#f8d7da',
                            color: kpi.status === 'excellent' ? '#155724' :
                                  kpi.status === 'good' ? '#0c5460' :
                                  kpi.status === 'warning' ? '#856404' : '#721c24',
                          }}>
                            {kpi.status}
                          </div>
                        )}
                      </div>
                      {kpi.target && (
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                          目标: {kpi.target} {kpi.unit || ''}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Data Tables */}
            {renderDetailedData(reportData)}

            {/* Raw JSON View (Collapsible) */}
            <details style={{ marginTop: '32px' }}>
              <summary style={{
                cursor: 'pointer',
                padding: '12px',
                background: '#f5f5f5',
                borderRadius: '6px',
                fontWeight: 600,
              }}>
                🔍 查看完整 JSON 数据
              </summary>
              <pre style={{
                marginTop: '12px',
                padding: '16px',
                background: '#f9f9f9',
                borderRadius: '6px',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '400px',
              }}>
                {JSON.stringify(reportData, null, 2)}
              </pre>
            </details>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

function formatFieldName(key: string): string {
  const nameMap: Record<string, string> = {
    totalRevenue: '总收入',
    totalExpenses: '总支出',
    netProfit: '净利润',
    profitMargin: '利润率',
    cashFlow: '现金流',
    totalProjects: '项目总数',
    activeProjects: '进行中项目',
    completedProjects: '已完成项目',
    onHoldProjects: '暂停项目',
    totalBudget: '总预算',
    totalSpent: '已使用',
    totalAllocated: '已分配',
    remaining: '剩余',
    budgetUtilization: '预算使用率',
    utilizationRate: '使用率',
    variance: '差异',
    totalEmployees: '员工总数',
    utilizedEmployees: '在岗员工',
    totalCapacity: '总产能',
    usedCapacity: '已用产能',
    availableCapacity: '可用产能',
    totalCostCenters: '成本中心数',
    totalCost: '总成本',
    averageCostPerCenter: '平均成本',
  };
  return nameMap[key] || key;
}

function formatValue(value: any): string {
  if (typeof value === 'number') {
    if (value > 1000) {
      return value.toLocaleString('zh-CN');
    }
    return value.toString();
  }
  return String(value);
}

function renderDetailedData(reportData: ReportData) {
  const sections = [];

  // Render different sections based on report type
  if (reportData.details) {
    sections.push(
      <div key="details" style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>
          📊 详细数据
        </h3>
        {Object.entries(reportData.details).map(([key, value]) => {
          if (Array.isArray(value)) {
            return (
              <div key={key} style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  {formatFieldName(key)}
                </h4>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '13px',
                }}>
                  <thead>
                    <tr style={{ background: '#fafafa', borderBottom: '2px solid #e0e0e0' }}>
                      {value[0] && Object.keys(value[0]).map((header) => (
                        <th key={header} style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                          {formatFieldName(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {value.map((row: any, index: number) => (
                      <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        {Object.values(row).map((cell: any, cellIndex: number) => (
                          <td key={cellIndex} style={{ padding: '12px' }}>
                            {formatValue(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  }

  // Render project list
  if (reportData.projectList) {
    sections.push(
      <div key="projects" style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>
          📋 项目列表
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reportData.projectList.map((project: any) => (
            <div
              key={project.projectId}
              style={{
                padding: '16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                background: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <strong>{project.projectName}</strong>
                  <span style={{ marginLeft: '12px', color: '#666', fontSize: '13px' }}>
                    ({project.projectId})
                  </span>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  background: project.status === 'completed' ? '#d4edda' :
                             project.status === 'active' ? '#d1ecf1' : '#fff3cd',
                  color: project.status === 'completed' ? '#155724' :
                        project.status === 'active' ? '#0c5460' : '#856404',
                }}>
                  {project.status}
                </div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '8px',
                fontSize: '13px',
              }}>
                <div>进度: {project.progress}%</div>
                <div>预算: {project.budget?.toLocaleString()}</div>
                <div>已用: {project.spent?.toLocaleString()}</div>
                <div>负责人: {project.manager}</div>
                <div>团队: {project.teamSize} 人</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render department breakdown
  if (reportData.departmentBreakdown) {
    sections.push(
      <div key="departments" style={{ marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>
          🏢 部门明细
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#fafafa', borderBottom: '2px solid #e0e0e0' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>部门</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>预算</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>已用</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>剩余</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>使用率</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {reportData.departmentBreakdown.map((dept: any, index: number) => (
              <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>{dept.department}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{dept.budget?.toLocaleString()}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{dept.spent?.toLocaleString()}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{dept.remaining?.toLocaleString()}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>{dept.utilizationRate}%</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    background: dept.status === 'on_track' ? '#d4edda' :
                               dept.status === 'at_risk' ? '#fff3cd' : '#f8d7da',
                    color: dept.status === 'on_track' ? '#155724' :
                          dept.status === 'at_risk' ? '#856404' : '#721c24',
                  }}>
                    {dept.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return sections.length > 0 ? sections : null;
}
