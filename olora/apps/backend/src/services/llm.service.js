const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const knowledgeSearch = require('./knowledge-search.service');

class LLMService {
  constructor() {
    this.provider = process.env.LLM_PROVIDER || 'openai';
    this.temperature = parseFloat(process.env.LLM_TEMPERATURE || '0.7');
    this.maxTokens = parseInt(process.env.LLM_MAX_TOKENS || '2000');
  }

  /**
   * Send a chat message to the configured LLM provider
   * @param {string} message - User message
   * @param {Array} conversationHistory - Previous messages (optional)
   * @param {boolean} useKnowledgeBase - Whether to search knowledge base (default: true)
   * @returns {Promise<string>} - AI response
   */
  async chat(message, conversationHistory = [], useKnowledgeBase = true) {
    try {
      // Search knowledge base for relevant context
      let knowledgeContext = null;
      if (useKnowledgeBase) {
        knowledgeContext = await knowledgeSearch.getContext(message);
      }

      const provider = this.provider.toLowerCase();

      switch (provider) {
        case 'openai':
          return await this.chatWithOpenAI(message, conversationHistory, knowledgeContext);
        case 'deepseek':
          return await this.chatWithDeepSeek(message, conversationHistory, knowledgeContext);
        case 'gemini':
          return await this.chatWithGemini(message, conversationHistory, knowledgeContext);
        default:
          throw new Error(`Unsupported LLM provider: ${provider}`);
      }
    } catch (error) {
      console.error('LLM chat error:', error);
      throw error;
    }
  }

  /**
   * OpenAI GPT integration
   */
  async chatWithOpenAI(message, conversationHistory, knowledgeContext) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === '') {
      throw new Error('OpenAI API key not configured. Please configure it in Settings.');
    }

    const openai = new OpenAI({ apiKey });

    const systemPrompt = `You are OLORA AI Assistant, a professional SAP business operations assistant.

You help users with:
- Creating and managing SAP projects
- Budget queries and analysis
- Business report generation
- Knowledge base retrieval
- Data security consulting
- System feature guidance

Respond in Chinese (中文) unless the user asks in another language.
Be professional, concise, and helpful.`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory
    ];

    // Add knowledge base context if available
    if (knowledgeContext) {
      messages.push({
        role: 'system',
        content: knowledgeContext
      });
    }

    messages.push({
      role: 'user',
      content: message
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    });

    return response.choices[0].message.content;
  }

  /**
   * DeepSeek integration (compatible with OpenAI API)
   */
  async chatWithDeepSeek(message, conversationHistory) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === '') {
      throw new Error('DeepSeek API key not configured. Please configure it in Settings.');
    }

    const messages = [
      {
        role: 'system',
        content: `你是 OLORA AI 助手，专业的 SAP 业务操作助手。

你可以帮助用户：
- 创建和管理 SAP 项目
- 预算查询与分析
- 业务报表生成
- 知识库检索
- 数据安全咨询
- 系统功能指导

请用中文回复，保持专业、简洁、有帮助。`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: messages,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  /**
   * Google Gemini integration
   */
  async chatWithGemini(message, conversationHistory) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === '') {
      throw new Error('Gemini API key not configured. Please configure it in Settings.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const systemPrompt = `You are OLORA AI Assistant, a professional SAP business operations assistant.

You help users with:
- Creating and managing SAP projects
- Budget queries and analysis
- Business report generation
- Knowledge base retrieval
- Data security consulting
- System feature guidance

Respond in Chinese (中文) unless the user asks in another language.
Be professional, concise, and helpful.`;

    // Gemini doesn't have native conversation history support in the same way
    // Combine history into a single prompt
    let fullPrompt = systemPrompt + '\n\n';
    conversationHistory.forEach(msg => {
      fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    fullPrompt += `User: ${message}\nAssistant: `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  }

  /**
   * Check if LLM is properly configured
   */
  isConfigured() {
    const provider = this.provider.toLowerCase();

    switch (provider) {
      case 'openai':
        return !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== '');
      case 'deepseek':
        return !!(process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== '');
      case 'gemini':
        return !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== '');
      default:
        return false;
    }
  }

  /**
   * Get current provider name
   */
  getProviderName() {
    const provider = this.provider.toLowerCase();
    const names = {
      'openai': 'OpenAI GPT',
      'deepseek': 'DeepSeek',
      'gemini': 'Google Gemini'
    };
    return names[provider] || provider;
  }
}

module.exports = new LLMService();
