/**
 * SAP Executor Service
 * Manages SAP BAPI executors and AI-driven intent matching
 */

const executorsConfig = require('../config/sap-executors.json');

class ExecutorService {
  constructor() {
    this.modules = executorsConfig.modules;
    this.executorsMap = this.buildExecutorsMap();
  }

  /**
   * Build executor ID to executor mapping
   */
  buildExecutorsMap() {
    const map = new Map();
    this.modules.forEach((module) => {
      module.executors.forEach((executor) => {
        map.set(executor.id, {
          ...executor,
          moduleId: module.id,
          moduleName: module.name,
          moduleIcon: module.icon,
        });
      });
    });
    return map;
  }

  /**
   * Get all modules with executors
   */
  getAllModules() {
    return this.modules;
  }

  /**
   * Get executors by module ID
   */
  getExecutorsByModule(moduleId) {
    const module = this.modules.find((m) => m.id === moduleId);
    return module ? module.executors : [];
  }

  /**
   * Get executor by ID
   */
  getExecutorById(executorId) {
    return this.executorsMap.get(executorId) || null;
  }

  /**
   * Match user intent to executor using keywords
   */
  matchExecutor(userMessage) {
    const message = userMessage.toLowerCase();
    const matches = [];

    this.executorsMap.forEach((executor, id) => {
      let score = 0;

      // Check if any keyword matches
      executor.keywords.forEach((keyword) => {
        if (message.includes(keyword.toLowerCase())) {
          score += 10;
        }
      });

      // Bonus for exact name match
      if (message.includes(executor.name.toLowerCase())) {
        score += 20;
      }

      // Bonus for T-Code match
      if (executor.tcode && message.includes(executor.tcode.toLowerCase())) {
        score += 15;
      }

      if (score > 0) {
        matches.push({
          executor,
          score,
        });
      }
    });

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return matches.length > 0 ? matches[0].executor : null;
  }

  /**
   * AI-enhanced intent matching
   * Uses LLM to understand user intent and match to executor
   */
  async matchExecutorWithAI(userMessage, llmService) {
    // First try keyword matching
    const keywordMatch = this.matchExecutor(userMessage);
    if (keywordMatch && keywordMatch.score > 15) {
      return keywordMatch.executor;
    }

    // If no strong keyword match, use AI
    try {
      const executorsList = Array.from(this.executorsMap.values())
        .map((e) => `- ${e.id}: ${e.name} (${e.description})`)
        .join('\n');

      const prompt = `用户说: "${userMessage}"

以下是可用的 SAP 操作列表:
${executorsList}

请分析用户意图，返回最匹配的操作ID。只返回ID，不要其他内容。如果没有匹配的，返回 "NONE"。`;

      const response = await llmService.chat(prompt, [], false);
      const executorId = response.trim();

      if (executorId !== 'NONE' && this.executorsMap.has(executorId)) {
        return this.executorsMap.get(executorId);
      }
    } catch (error) {
      console.error('AI executor matching error:', error);
    }

    return keywordMatch;
  }

  /**
   * Get executor parameters schema
   */
  getExecutorParameters(executorId) {
    const executor = this.getExecutorById(executorId);
    return executor ? executor.parameters : [];
  }

  /**
   * Validate executor parameters
   */
  validateParameters(executorId, params) {
    const executor = this.getExecutorById(executorId);
    if (!executor) {
      return { valid: false, error: 'Executor not found' };
    }

    const errors = [];
    executor.parameters.forEach((param) => {
      if (param.required && !params[param.name]) {
        errors.push(`缺少必填参数: ${param.label} (${param.name})`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Execute SAP BAPI (placeholder - will connect to real SAP later)
   */
  async executeExecutor(executorId, params) {
    const executor = this.getExecutorById(executorId);
    if (!executor) {
      throw new Error('Executor not found');
    }

    // Validate parameters
    const validation = this.validateParameters(executorId, params);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // TODO: Connect to real SAP system via OData/RFC
    // For now, return mock response
    return {
      success: true,
      executorId,
      executorName: executor.name,
      api: executor.api,
      method: executor.method,
      params,
      result: {
        message: `[模拟执行] ${executor.name} 已提交`,
        documentNumber: `DOC${Date.now()}`,
        status: 'SUCCESS',
        details: '这是模拟响应。实际环境将调用真实的 SAP BAPI。',
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Search executors by keyword
   */
  searchExecutors(keyword) {
    const results = [];
    const lowerKeyword = keyword.toLowerCase();

    this.executorsMap.forEach((executor) => {
      if (
        executor.name.toLowerCase().includes(lowerKeyword) ||
        executor.description.toLowerCase().includes(lowerKeyword) ||
        executor.keywords.some((k) => k.toLowerCase().includes(lowerKeyword)) ||
        (executor.tcode && executor.tcode.toLowerCase().includes(lowerKeyword))
      ) {
        results.push(executor);
      }
    });

    return results;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalModules: this.modules.length,
      totalExecutors: this.executorsMap.size,
      moduleStats: this.modules.map((m) => ({
        id: m.id,
        name: m.name,
        executorCount: m.executors.length,
      })),
    };
  }
}

module.exports = new ExecutorService();
