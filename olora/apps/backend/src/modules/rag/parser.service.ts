import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class ParserService {
  async parsePDF(filePath: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  async parseMarkdown(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
  }

  async parseText(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
  }

  chunkText(text: string, chunkSize = 1024, overlap = 200): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.slice(start, end));
      start += chunkSize - overlap;
    }

    return chunks;
  }
}
