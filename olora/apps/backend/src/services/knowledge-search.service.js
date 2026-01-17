const fs = require('fs');
const path = require('path');

class KnowledgeSearchService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../../../uploads');
  }

  /**
   * Search for relevant document chunks based on query
   * @param {string} query - User search query
   * @param {number} topK - Number of top results to return (default: 3)
   * @returns {Array<Object>} - Array of relevant chunks with scores
   */
  async search(query, topK = 3) {
    try {
      const allChunks = await this.loadAllChunks();

      if (allChunks.length === 0) {
        return [];
      }

      // Simple keyword-based scoring
      const scoredChunks = allChunks.map(chunk => {
        const score = this.calculateRelevanceScore(query, chunk.text);
        return {
          ...chunk,
          score
        };
      });

      // Sort by score and return top K
      return scoredChunks
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .filter(chunk => chunk.score > 0);
    } catch (error) {
      console.error('Knowledge search error:', error);
      return [];
    }
  }

  /**
   * Load all document chunks from storage
   */
  async loadAllChunks() {
    const chunks = [];

    try {
      const files = fs.readdirSync(this.uploadsDir);
      const chunkFiles = files.filter(file => file.endsWith('_chunks.json'));

      for (const file of chunkFiles) {
        const filePath = path.join(this.uploadsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);

        data.chunks.forEach((text, index) => {
          chunks.push({
            documentId: data.documentId,
            fileName: data.fileName,
            chunkIndex: index,
            text: text,
            metadata: data.metadata,
          });
        });
      }
    } catch (error) {
      console.error('Error loading chunks:', error);
    }

    return chunks;
  }

  /**
   * Calculate relevance score between query and chunk
   * Simple keyword matching algorithm
   */
  calculateRelevanceScore(query, text) {
    const queryTerms = this.tokenize(query.toLowerCase());
    const textTerms = this.tokenize(text.toLowerCase());

    if (queryTerms.length === 0) return 0;

    // Count matching terms
    let matchCount = 0;
    let exactMatchBonus = 0;

    queryTerms.forEach(term => {
      if (textTerms.includes(term)) {
        matchCount++;
      }

      // Bonus for exact phrase match
      if (text.toLowerCase().includes(query.toLowerCase())) {
        exactMatchBonus = 5;
      }
    });

    // Calculate score (percentage of query terms found + exact match bonus)
    const score = (matchCount / queryTerms.length) * 100 + exactMatchBonus;
    return score;
  }

  /**
   * Tokenize text into terms (simple Chinese and English word splitting)
   */
  tokenize(text) {
    // Split by whitespace and punctuation
    const terms = text
      .replace(/[，。！？；：、,.!?;:]/g, ' ')
      .split(/\s+/)
      .filter(term => term.length > 0);

    // For Chinese, also split into characters if term is too long
    const expandedTerms = [];
    terms.forEach(term => {
      expandedTerms.push(term);

      // If term contains Chinese characters and is longer than 2 chars
      if (term.match(/[\u4e00-\u9fa5]/) && term.length > 2) {
        // Split into 2-character chunks
        for (let i = 0; i < term.length - 1; i++) {
          expandedTerms.push(term.substring(i, i + 2));
        }
      }
    });

    return [...new Set(expandedTerms)]; // Remove duplicates
  }

  /**
   * Get document context for LLM
   * @param {string} query - User query
   * @param {number} topK - Number of chunks to retrieve
   * @returns {string} - Formatted context for LLM
   */
  async getContext(query, topK = 3) {
    const relevantChunks = await this.search(query, topK);

    if (relevantChunks.length === 0) {
      return null;
    }

    let context = '以下是相关的知识库内容：\n\n';

    relevantChunks.forEach((chunk, index) => {
      context += `【文档${index + 1}】来源：${chunk.fileName}\n`;
      context += `${chunk.text}\n\n`;
    });

    context += '请基于以上知识库内容回答用户的问题。如果知识库中没有相关信息，请诚实告知。';

    return context;
  }
}

module.exports = new KnowledgeSearchService();
