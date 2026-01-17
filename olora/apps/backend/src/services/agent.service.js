const llmService = require('./llm.service');
const executorService = require('./executor.service');
const knowledgeSearch = require('./knowledge-search.service');

/**
 * AI Agent 核心服务
 *
 * 功能：
 * 1. 意图识别 + Executor匹配
 * 2. 多源信息收集（知识库、邮件、SAP）
 * 3. 参数提取和转换
 * 4. 生成无幻觉的智能回答
 * 5. 友好拒绝不支持的功能
 */
class AgentService {
  /**
   * 主流程：处理用户对话
   * @param {string} userMessage - 用户输入
   * @param {Array} conversationHistory - 对话历史
   * @returns {Promise<Object>} Agent响应
   */
  async processConversation(userMessage, conversationHistory = []) {
    try {
      console.log('🤖 Agent processing:', userMessage);

      // 步骤1: 意图识别 + Executor匹配
      const matchedExecutor = await executorService.matchExecutorWithAI(
        userMessage,
        llmService
      );

      if (!matchedExecutor) {
        // 未匹配到 → 友好拒绝 + 建议
        console.log('❌ No executor matched, generating suggestions');
        return await this.generateSuggestions(userMessage);
      }

      console.log('✅ Matched executor:', matchedExecutor.id);

      // 步骤2: 多源信息收集
      const context = await this.gatherContext(userMessage, matchedExecutor);

      // 步骤3: 参数提取和转换
      const parameterExtraction = await this.extractAndConvertParameters(
        userMessage,
        matchedExecutor,
        context
      );

      // 步骤4: 生成智能回答
      return await this.generateResponse(
        matchedExecutor,
        context,
        parameterExtraction
      );
    } catch (error) {
      console.error('❌ Agent processing error:', error);
      throw error;
    }
  }

  /**
   * 步骤2: 多源信息收集
   * @param {string} userMessage - 用户消息
   * @param {Object} executor - 匹配的执行器
   * @returns {Promise<Object>} 收集的上下文信息
   */
  async gatherContext(userMessage, executor) {
    console.log('📚 Gathering context from multiple sources...');

    // 并行检索多个数据源
    const [knowledgeResult, emailResult, sapResult] = await Promise.all([
      this.searchKnowledge(userMessage),
      this.searchEmails(userMessage),
      this.querySAP(userMessage, executor)
    ]);

    return {
      knowledge: knowledgeResult,
      emails: emailResult,
      sap: sapResult
    };
  }

  /**
   * 知识库检索（Qdrant向量搜索）
   */
  async searchKnowledge(query) {
    try {
      const context = await knowledgeSearch.getContext(query);
      if (context && context.trim()) {
        console.log('✅ Knowledge base found relevant content');
        return context;
      }
      return null;
    } catch (error) {
      console.log('⚠️ Knowledge search failed:', error.message);
      return null;
    }
  }

  /**
   * 邮件检索（预留接口）
   * TODO: 实现IMAP邮件搜索
   */
  async searchEmails(query) {
    // 预留：将来实现邮件搜索
    // 示例：搜索包含关键词的邮件
    console.log('⚠️ Email search not yet implemented');
    return null;
  }

  /**
   * SAP数据查询（预留接口）
   * TODO: 实现SAP OData查询
   */
  async querySAP(query, executor) {
    // 预留：将来实现SAP数据查询
    // 示例：查询供应商、物料、客户等主数据
    console.log('⚠️ SAP query not yet implemented');
    return null;
  }

  /**
   * 步骤3: 参数提取和转换（核心逻辑）
   * @param {string} userMessage - 用户消息
   * @param {Object} executor - 执行器
   * @param {Object} context - 上下文信息
   * @returns {Promise<Object>} 提取结果
   */
  async extractAndConvertParameters(userMessage, executor, context) {
    const parameterSchema = executor.parameters;

    if (!parameterSchema || parameterSchema.length === 0) {
      return {
        extracted: {},
        missing: [],
        confidence: 1.0
      };
    }

    console.log('🔍 Extracting parameters from user message...');

    // 构建参数提取提示词
    const prompt = this.buildExtractionPrompt(userMessage, parameterSchema, context);

    try {
      const llmResponse = await llmService.chat(prompt, [], false);

      // 解析JSON（容错处理）
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('⚠️ LLM返回格式错误，无法解析JSON');
        return this.getEmptyExtraction(parameterSchema);
      }

      const result = JSON.parse(jsonMatch[0]);

      // 验证和类型转换
      const validatedParams = this.validateAndConvert(
        result.extracted || {},
        parameterSchema
      );

      // 检测缺失的必需参数
      const missingRequired = this.findMissingRequired(validatedParams, parameterSchema);

      const confidence = this.calculateConfidence(validatedParams, parameterSchema);

      console.log(`✅ Parameters extracted: ${Object.keys(validatedParams).length} found, ${missingRequired.length} missing`);
      console.log(`📊 Confidence: ${(confidence * 100).toFixed(0)}%`);

      return {
        extracted: validatedParams,
        missing: missingRequired,
        confidence
      };
    } catch (error) {
      console.error('❌ Parameter extraction failed:', error);
      return this.getEmptyExtraction(parameterSchema);
    }
  }

  /**
   * 构建参数提取提示词
   */
  buildExtractionPrompt(userMessage, parameterSchema, context) {
    let prompt = `你是一个SAP参数提取专家。从用户消息和上下文信息中提取参数。

用户消息: "${userMessage}"

`;

    // 添加上下文信息
    if (context.knowledge) {
      prompt += `知识库相关内容:\n${context.knowledge.substring(0, 300)}...\n\n`;
    }
    if (context.emails) {
      prompt += `邮件相关内容:\n${context.emails.substring(0, 300)}...\n\n`;
    }
    if (context.sap) {
      prompt += `SAP数据:\n${context.sap.substring(0, 300)}...\n\n`;
    }

    prompt += `需要提取的参数schema:
${JSON.stringify(parameterSchema, null, 2)}

提取规则:
1. 只提取用户明确提到或可从上下文推断的参数
2. 对于供应商、客户、物料等，优先使用编码（如果上下文中有）
3. 日期转换为YYYY-MM-DD格式
4. 数量提取为纯数字
5. 不要猜测用户未提及的信息
6. 返回JSON格式: {"extracted": {...}, "missing": [...]}

示例:
用户: "供应商华为，数量100"
返回: {
  "extracted": {"supplier": "华为", "quantity": 100},
  "missing": ["material", "deliveryDate"]
}

现在请提取参数，只返回JSON，不要额外说明:`;

    return prompt;
  }

  /**
   * 验证和类型转换
   */
  validateAndConvert(extractedParams, schema) {
    const validated = {};

    for (const param of schema) {
      const value = extractedParams[param.name];
      if (value === undefined || value === null || value === '') continue;

      try {
        switch (param.type) {
          case 'number':
            // 提取数字（支持"100台"、"一百"等）
            const numValue = this.extractNumber(value);
            if (numValue !== null) {
              validated[param.name] = numValue;
            }
            break;

          case 'date':
            // 转换为YYYY-MM-DD格式
            const dateValue = this.normalizeDate(value);
            if (dateValue) {
              validated[param.name] = dateValue;
            }
            break;

          case 'string':
          default:
            validated[param.name] = String(value).trim();
        }
      } catch (error) {
        console.warn(`⚠️ Type conversion failed for ${param.name}:`, error.message);
      }
    }

    return validated;
  }

  /**
   * 提取数字（支持"100台"、"一百"等格式）
   */
  extractNumber(value) {
    // 如果已经是数字
    if (typeof value === 'number') return value;

    const str = String(value);

    // 提取纯数字
    const numMatch = str.match(/\d+(\.\d+)?/);
    if (numMatch) {
      return parseFloat(numMatch[0]);
    }

    // 中文数字转换（简单实现）
    const chineseMap = {
      '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
      '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
      '百': 100, '千': 1000, '万': 10000
    };

    for (const [chinese, number] of Object.entries(chineseMap)) {
      if (str.includes(chinese)) {
        return number;
      }
    }

    return null;
  }

  /**
   * 日期格式标准化
   */
  normalizeDate(dateInput) {
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    } catch (error) {
      return null;
    }
  }

  /**
   * 查找缺失的必需参数
   */
  findMissingRequired(extracted, schema) {
    return schema
      .filter(p => p.required && !(p.name in extracted))
      .map(p => p.name);
  }

  /**
   * 计算提取置信度
   */
  calculateConfidence(extracted, schema) {
    const requiredParams = schema.filter(p => p.required);
    if (requiredParams.length === 0) return 1.0;

    const extractedRequired = requiredParams.filter(p =>
      extracted[p.name] !== undefined
    );

    return extractedRequired.length / requiredParams.length;
  }

  /**
   * 获取空的提取结果
   */
  getEmptyExtraction(schema) {
    return {
      extracted: {},
      missing: schema.filter(p => p.required).map(p => p.name),
      confidence: 0
    };
  }

  /**
   * 步骤4: 生成智能回答
   */
  async generateResponse(executor, context, parameterExtraction) {
    const { extracted, missing, confidence } = parameterExtraction;

    // 构建回答内容
    let message = `✨ 我理解您想要执行：**${executor.name}**\n\n`;

    // 显示已提取的参数
    if (Object.keys(extracted).length > 0) {
      message += `📋 已识别信息：\n`;
      for (const [key, value] of Object.entries(extracted)) {
        const paramDef = executor.parameters.find(p => p.name === key);
        message += `✅ ${paramDef?.label || key}: ${value}\n`;
      }
      message += '\n';
    }

    // 显示上下文增强信息（如果有）
    if (context.knowledge || context.emails || context.sap) {
      message += `💡 相关参考信息：\n`;
      if (context.knowledge) {
        const knowledgePreview = context.knowledge.substring(0, 150).replace(/\n/g, ' ');
        message += `📚 知识库: ${knowledgePreview}...\n`;
      }
      if (context.emails) {
        message += `📧 历史邮件: 找到相关邮件记录\n`;
      }
      if (context.sap) {
        message += `💼 SAP数据: 找到相关主数据\n`;
      }
      message += '\n';
    }

    // 显示缺失的参数
    if (missing.length > 0) {
      message += `⚠️ 还需要补充以下信息：\n`;
      for (const paramName of missing) {
        const paramDef = executor.parameters.find(p => p.name === paramName);
        message += `❌ ${paramDef?.label || paramName}`;
        if (paramDef?.description) {
          message += ` (${paramDef.description})`;
        }
        message += '\n';
      }
      message += '\n';
    }

    // 置信度提示
    if (confidence > 0 && confidence < 0.7) {
      message += `⚠️ 参数提取置信度: ${(confidence * 100).toFixed(0)}%，建议仔细核对\n\n`;
    }

    // 行动建议
    if (missing.length === 0 && Object.keys(extracted).length > 0) {
      message += `✅ 信息已完整，点击下方按钮即可执行`;
    } else if (missing.length > 0) {
      message += `💡 请补充缺失信息，或点击按钮前往表单页面填写`;
    } else {
      message += `💡 点击下方按钮前往表单页面填写完整信息`;
    }

    return {
      success: true,
      hasExecutor: true,
      executor: {
        ...executor,
        extractedParams: extracted,
        missingRequired: missing,
        extractionConfidence: confidence
      },
      context: {
        hasKnowledge: !!context.knowledge,
        hasEmails: !!context.emails,
        hasSapData: !!context.sap
      },
      message
    };
  }

  /**
   * 生成功能建议（当未匹配到Executor时）
   */
  async generateSuggestions(userMessage) {
    const allExecutors = executorService.getAllExecutors();
    const modules = executorService.getModules();

    let message = `抱歉，我暂时还不支持这个操作。\n\n`;
    message += `🎯 目前已支持的SAP操作包括：\n\n`;

    // 显示前3个模块
    for (const module of modules.slice(0, 3)) {
      const executors = allExecutors.filter(e => e.moduleId === module.id);
      if (executors.length === 0) continue;

      message += `${module.icon} **${module.name}**\n`;
      for (const exec of executors.slice(0, 3)) { // 每个模块显示3个
        message += `  • ${exec.name}\n`;
      }
      message += '\n';
    }

    message += `💡 您可以试试这些操作，或者告诉我您的具体需求，我会尽力帮您找到解决方案。`;

    return {
      success: true,
      hasExecutor: false,
      suggestions: allExecutors.slice(0, 6).map(e => ({
        id: e.id,
        name: e.name,
        description: e.description,
        moduleId: e.moduleId,
        moduleName: e.moduleName
      })),
      message
    };
  }
}

module.exports = new AgentService();
