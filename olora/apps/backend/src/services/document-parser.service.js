const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

class DocumentParserService {
  /**
   * Parse document based on file type
   * @param {string} filePath - Path to the document
   * @param {string} fileType - File extension (.pdf, .docx, .txt, .md)
   * @returns {Promise<string>} - Extracted text content
   */
  async parseDocument(filePath, fileType) {
    try {
      switch (fileType.toLowerCase()) {
        case '.pdf':
          return await this.parsePDF(filePath);
        case '.doc':
        case '.docx':
          return await this.parseWord(filePath);
        case '.txt':
        case '.md':
          return await this.parseText(filePath);
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error('Document parsing error:', error);
      throw new Error(`Failed to parse document: ${error.message}`);
    }
  }

  /**
   * Parse PDF document
   */
  async parsePDF(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  /**
   * Parse Word document (.doc, .docx)
   */
  async parseWord(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  /**
   * Parse text file (.txt, .md)
   */
  async parseText(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * Split text into chunks for vector storage
   * @param {string} text - Full document text
   * @param {number} chunkSize - Maximum characters per chunk (default: 1000)
   * @param {number} chunkOverlap - Characters overlap between chunks (default: 200)
   * @returns {Array<string>} - Array of text chunks
   */
  splitIntoChunks(text, chunkSize = 1000, chunkOverlap = 200) {
    const chunks = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      const endIndex = Math.min(startIndex + chunkSize, text.length);
      let chunk = text.substring(startIndex, endIndex);

      // Try to break at sentence boundary
      if (endIndex < text.length) {
        const lastPeriod = chunk.lastIndexOf('。');
        const lastNewline = chunk.lastIndexOf('\n');
        const lastBreak = Math.max(lastPeriod, lastNewline);

        if (lastBreak > chunkSize * 0.5) {
          chunk = chunk.substring(0, lastBreak + 1);
          startIndex += lastBreak + 1;
        } else {
          startIndex += chunkSize - chunkOverlap;
        }
      } else {
        startIndex = text.length;
      }

      if (chunk.trim().length > 0) {
        chunks.push(chunk.trim());
      }
    }

    return chunks;
  }

  /**
   * Process uploaded document: parse and chunk
   * @param {string} filePath - Path to uploaded file
   * @param {string} fileType - File extension
   * @param {string} fileName - Original file name
   * @returns {Promise<Object>} - Parsed document with chunks
   */
  async processDocument(filePath, fileType, fileName) {
    try {
      // Parse document
      const fullText = await this.parseDocument(filePath, fileType);

      // Split into chunks
      const chunks = this.splitIntoChunks(fullText);

      return {
        fileName,
        fileType,
        fullText,
        chunks,
        chunkCount: chunks.length,
        totalCharacters: fullText.length,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Document processing error:', error);
      throw error;
    }
  }

  /**
   * Extract metadata from document
   */
  extractMetadata(text) {
    const lines = text.split('\n').filter(line => line.trim());
    const firstLines = lines.slice(0, 5).join(' ');

    return {
      preview: firstLines.substring(0, 200),
      lineCount: lines.length,
      hasHeaders: lines.some(line => line.startsWith('#') || line.match(/^[A-Z][^a-z]{10,}$/)),
      language: this.detectLanguage(text),
    };
  }

  /**
   * Simple language detection
   */
  detectLanguage(text) {
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const totalChars = text.length;
    return chineseChars / totalChars > 0.3 ? 'zh' : 'en';
  }
}

module.exports = new DocumentParserService();
