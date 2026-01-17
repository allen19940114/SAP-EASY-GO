/**
 * SAP Report Generation Service
 * Inspired by SAP Crystal Reports and SAP Analytics Cloud
 *
 * TODO: 当前使用演示数据,生产环境应该:
 * 1. 从PostgreSQL数据库读取实际的财务/项目/预算数据
 * 2. 集成SAP API获取实时业务数据
 * 3. 使用真实的用户权限控制数据访问
 * 4. 实现数据缓存以提高性能
 */

const XLSX = require('xlsx');

class ReportService {
  constructor() {
    this.reportTypes = [
      'financial',      // 财务报表
      'project',        // 项目报表
      'budget',         // 预算报表
      'cost_center',    // 成本中心
      'resource',       // 资源使用
      'performance'     // 绩效报表
    ];
  }

  /**
   * Generate Financial Report (财务报表)
   * Includes: Revenue, Expenses, Profit/Loss, Cash Flow
   */
  async generateFinancialReport(params = {}) {
    const { startDate, endDate, period = 'monthly' } = params;

    // Simulate SAP FI module data
    const report = {
      reportType: 'financial',
      reportName: '财务报表 (Financial Report)',
      generatedAt: new Date().toISOString(),
      period: period,
      dateRange: { startDate, endDate },

      summary: {
        totalRevenue: 15680000,      // 总收入
        totalExpenses: 12340000,     // 总支出
        netProfit: 3340000,          // 净利润
        profitMargin: 21.3,          // 利润率 (%)
        cashFlow: 2890000,           // 现金流
      },

      details: {
        revenue: [
          { category: '项目收入', amount: 12500000, percentage: 79.7 },
          { category: '服务收入', amount: 2180000, percentage: 13.9 },
          { category: '其他收入', amount: 1000000, percentage: 6.4 },
        ],
        expenses: [
          { category: '人力成本', amount: 6800000, percentage: 55.1 },
          { category: '项目成本', amount: 3200000, percentage: 25.9 },
          { category: '运营费用', amount: 1540000, percentage: 12.5 },
          { category: '其他费用', amount: 800000, percentage: 6.5 },
        ],
        monthlyTrend: this.generateMonthlyTrend(12),
      },

      kpis: [
        { name: 'ROI (投资回报率)', value: 27.1, unit: '%', trend: 'up' },
        { name: '运营利润率', value: 21.3, unit: '%', trend: 'up' },
        { name: '现金周转天数', value: 45, unit: '天', trend: 'down' },
        { name: '应收账款周转率', value: 8.2, unit: '次', trend: 'up' },
      ]
    };

    return report;
  }

  /**
   * Generate Project Report (项目报表)
   * Based on SAP PS (Project System) module
   */
  async generateProjectReport(params = {}) {
    const { projectId, status } = params;

    const report = {
      reportType: 'project',
      reportName: '项目管理报表 (Project Report)',
      generatedAt: new Date().toISOString(),

      summary: {
        totalProjects: 24,
        activeProjects: 15,
        completedProjects: 7,
        onHoldProjects: 2,
        totalBudget: 45000000,
        totalSpent: 32500000,
        budgetUtilization: 72.2,
      },

      projectList: [
        {
          projectId: 'P001',
          projectName: '华为5G基站部署',
          status: 'active',
          progress: 65,
          budget: 5000000,
          spent: 3250000,
          remaining: 1750000,
          startDate: '2025-01-15',
          endDate: '2025-06-30',
          manager: '张三',
          teamSize: 12,
          milestones: {
            completed: 4,
            total: 6
          }
        },
        {
          projectId: 'P002',
          projectName: 'SAP S/4HANA 升级',
          status: 'active',
          progress: 40,
          budget: 8000000,
          spent: 3200000,
          remaining: 4800000,
          startDate: '2025-02-01',
          endDate: '2025-08-31',
          manager: '李四',
          teamSize: 18,
          milestones: {
            completed: 2,
            total: 8
          }
        },
        {
          projectId: 'P003',
          projectName: '数字化转型咨询',
          status: 'completed',
          progress: 100,
          budget: 3500000,
          spent: 3420000,
          remaining: 80000,
          startDate: '2024-10-01',
          endDate: '2025-01-10',
          manager: '王五',
          teamSize: 8,
          milestones: {
            completed: 5,
            total: 5
          }
        }
      ],

      statusDistribution: [
        { status: '进行中', count: 15, percentage: 62.5 },
        { status: '已完成', count: 7, percentage: 29.2 },
        { status: '暂停', count: 2, percentage: 8.3 },
      ],

      riskAnalysis: [
        { projectId: 'P002', risk: '预算超支风险', level: 'high', mitigation: '优化资源配置' },
        { projectId: 'P005', risk: '进度延迟', level: 'medium', mitigation: '增加人力投入' },
      ]
    };

    return report;
  }

  /**
   * Generate Budget Report (预算报表)
   * Based on SAP CO (Controlling) module
   */
  async generateBudgetReport(params = {}) {
    const { department, year = 2025 } = params;

    const report = {
      reportType: 'budget',
      reportName: '预算执行报表 (Budget Report)',
      generatedAt: new Date().toISOString(),
      fiscalYear: year,

      summary: {
        totalBudget: 50000000,
        totalAllocated: 45000000,
        totalSpent: 32500000,
        remaining: 12500000,
        utilizationRate: 72.2,
        variance: -12500000,  // 负数表示节省
      },

      departmentBreakdown: [
        {
          department: '研发部',
          budget: 15000000,
          allocated: 14500000,
          spent: 10200000,
          remaining: 4300000,
          utilizationRate: 70.3,
          status: 'on_track'
        },
        {
          department: '销售部',
          budget: 12000000,
          allocated: 11800000,
          spent: 9800000,
          remaining: 2000000,
          utilizationRate: 83.1,
          status: 'at_risk'
        },
        {
          department: '运营部',
          budget: 10000000,
          allocated: 9500000,
          spent: 6500000,
          remaining: 3000000,
          utilizationRate: 68.4,
          status: 'on_track'
        },
        {
          department: '市场部',
          budget: 8000000,
          allocated: 7200000,
          spent: 4800000,
          remaining: 2400000,
          utilizationRate: 66.7,
          status: 'on_track'
        },
        {
          department: '行政部',
          budget: 5000000,
          allocated: 5000000,
          spent: 1200000,
          remaining: 3800000,
          utilizationRate: 24.0,
          status: 'under_utilized'
        }
      ],

      quarterlyTrend: [
        { quarter: 'Q1', budget: 12500000, spent: 8200000, variance: 4300000 },
        { quarter: 'Q2', budget: 12500000, spent: 10500000, variance: 2000000 },
        { quarter: 'Q3', budget: 12500000, spent: 9800000, variance: 2700000 },
        { quarter: 'Q4', budget: 12500000, spent: 4000000, variance: 8500000 },
      ],

      alerts: [
        { department: '销售部', message: '预算使用率超过80%，建议控制开支', severity: 'warning' },
        { department: '行政部', message: '预算使用率过低，建议加快执行', severity: 'info' },
      ]
    };

    return report;
  }

  /**
   * Generate Cost Center Report (成本中心报表)
   */
  async generateCostCenterReport(params = {}) {
    const { costCenterId } = params;

    const report = {
      reportType: 'cost_center',
      reportName: '成本中心分析报表 (Cost Center Report)',
      generatedAt: new Date().toISOString(),

      summary: {
        totalCostCenters: 15,
        totalCost: 32500000,
        averageCostPerCenter: 2166667,
      },

      costCenters: [
        {
          costCenterId: 'CC001',
          name: '研发中心',
          totalCost: 10200000,
          breakdown: {
            personnel: 6800000,
            materials: 2100000,
            overhead: 1300000,
          },
          headcount: 85,
          costPerHead: 120000,
        },
        {
          costCenterId: 'CC002',
          name: '销售中心',
          totalCost: 9800000,
          breakdown: {
            personnel: 5200000,
            marketing: 3100000,
            overhead: 1500000,
          },
          headcount: 62,
          costPerHead: 158065,
        },
        {
          costCenterId: 'CC003',
          name: '运营中心',
          totalCost: 6500000,
          breakdown: {
            personnel: 3900000,
            infrastructure: 1800000,
            overhead: 800000,
          },
          headcount: 45,
          costPerHead: 144444,
        }
      ],

      costTrend: this.generateMonthlyTrend(12),
    };

    return report;
  }

  /**
   * Generate Resource Utilization Report (资源使用报表)
   */
  async generateResourceReport(params = {}) {
    const report = {
      reportType: 'resource',
      reportName: '资源使用情况报表 (Resource Utilization Report)',
      generatedAt: new Date().toISOString(),

      summary: {
        totalEmployees: 245,
        utilizedEmployees: 198,
        utilizationRate: 80.8,
        totalCapacity: 49000,  // 工时
        usedCapacity: 39584,
        availableCapacity: 9416,
      },

      byDepartment: [
        {
          department: '研发部',
          headcount: 85,
          utilized: 72,
          utilizationRate: 84.7,
          averageHoursPerWeek: 42,
        },
        {
          department: '销售部',
          headcount: 62,
          utilized: 55,
          utilizationRate: 88.7,
          averageHoursPerWeek: 45,
        },
        {
          department: '运营部',
          headcount: 45,
          utilized: 38,
          utilizationRate: 84.4,
          averageHoursPerWeek: 40,
        },
        {
          department: '市场部',
          headcount: 33,
          utilized: 23,
          utilizationRate: 69.7,
          averageHoursPerWeek: 38,
        },
        {
          department: '行政部',
          headcount: 20,
          utilized: 10,
          utilizationRate: 50.0,
          averageHoursPerWeek: 35,
        }
      ],

      topPerformers: [
        { name: '张三', department: '研发部', utilizationRate: 95, projects: 3 },
        { name: '李四', department: '销售部', utilizationRate: 92, projects: 5 },
        { name: '王五', department: '运营部', utilizationRate: 90, projects: 2 },
      ]
    };

    return report;
  }

  /**
   * Generate Performance Report (绩效报表)
   */
  async generatePerformanceReport(params = {}) {
    const report = {
      reportType: 'performance',
      reportName: '绩效分析报表 (Performance Report)',
      generatedAt: new Date().toISOString(),

      kpis: [
        {
          category: '财务绩效',
          metrics: [
            { name: '收入增长率', value: 18.5, target: 15.0, unit: '%', status: 'excellent' },
            { name: '利润率', value: 21.3, target: 20.0, unit: '%', status: 'excellent' },
            { name: 'ROI', value: 27.1, target: 25.0, unit: '%', status: 'excellent' },
          ]
        },
        {
          category: '项目绩效',
          metrics: [
            { name: '按时交付率', value: 78.3, target: 85.0, unit: '%', status: 'warning' },
            { name: '预算达成率', value: 92.5, target: 90.0, unit: '%', status: 'good' },
            { name: '客户满意度', value: 4.2, target: 4.5, unit: '/5', status: 'warning' },
          ]
        },
        {
          category: '运营绩效',
          metrics: [
            { name: '员工利用率', value: 80.8, target: 75.0, unit: '%', status: 'excellent' },
            { name: '流程效率', value: 85.2, target: 80.0, unit: '%', status: 'excellent' },
            { name: '质量达标率', value: 96.7, target: 95.0, unit: '%', status: 'excellent' },
          ]
        }
      ],

      departmentRanking: [
        { rank: 1, department: '研发部', overallScore: 92.5 },
        { rank: 2, department: '销售部', overallScore: 88.3 },
        { rank: 3, department: '运营部', overallScore: 85.7 },
        { rank: 4, department: '市场部', overallScore: 82.1 },
        { rank: 5, department: '行政部', overallScore: 78.9 },
      ]
    };

    return report;
  }

  /**
   * Helper: Generate monthly trend data
   */
  generateMonthlyTrend(months = 12) {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const trend = [];

    for (let i = 0; i < months; i++) {
      trend.push({
        month: monthNames[i],
        value: Math.floor(Math.random() * 2000000) + 1000000,
        growth: (Math.random() * 30 - 10).toFixed(1)  // -10% to +20%
      });
    }

    return trend;
  }

  /**
   * Export report to different formats
   */
  async exportReport(report, format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      case 'csv':
        return this.convertToCSV(report);
      case 'excel':
        return this.convertToExcel(report);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Convert report data to Excel format (XLSX)
   */
  convertToExcel(report) {
    // 创建新的工作簿
    const workbook = XLSX.utils.book_new();

    // 创建摘要工作表
    const summaryData = [];
    summaryData.push(['报表类型', report.reportName]);
    summaryData.push(['生成时间', report.generatedAt]);
    summaryData.push([]);

    if (report.summary) {
      summaryData.push(['摘要数据']);
      Object.entries(report.summary).forEach(([key, value]) => {
        summaryData.push([this.formatFieldName(key), value]);
      });
    }

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, '摘要');

    // 如果有详细数据,创建详细数据工作表
    if (report.details) {
      Object.entries(report.details).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          // 将数组数据转换为工作表
          const detailSheet = XLSX.utils.json_to_sheet(value);
          XLSX.utils.book_append_sheet(workbook, detailSheet, this.formatFieldName(key).substring(0, 31)); // Excel sheet name limit
        }
      });
    }

    // 如果有KPI数据,创建KPI工作表
    if (report.kpis && Array.isArray(report.kpis)) {
      const kpiSheet = XLSX.utils.json_to_sheet(report.kpis);
      XLSX.utils.book_append_sheet(workbook, kpiSheet, 'KPI指标');
    }

    // 生成Excel文件buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return excelBuffer;
  }

  /**
   * Convert report data to CSV format
   */
  convertToCSV(report) {
    // Simple CSV conversion for demonstration
    let csv = `Report Type,${report.reportType}\n`;
    csv += `Report Name,${report.reportName}\n`;
    csv += `Generated At,${report.generatedAt}\n\n`;

    if (report.summary) {
      csv += 'Summary\n';
      Object.entries(report.summary).forEach(([key, value]) => {
        csv += `${key},${value}\n`;
      });
    }

    return csv;
  }
}

module.exports = new ReportService();
