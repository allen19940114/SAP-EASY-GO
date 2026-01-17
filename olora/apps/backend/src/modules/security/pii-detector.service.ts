import { Injectable } from '@nestjs/common';

export interface PIIMatch {
  type: 'CLIENT' | 'AMOUNT' | 'PHONE' | 'EMAIL' | 'ID_NUMBER';
  value: string;
  placeholder: string;
  start: number;
  end: number;
}

@Injectable()
export class PIIDetectorService {
  private clientPatterns = ['华为', '中兴', '阿里', '腾讯', '字节', '小米'];
  private amountPattern = /(\d+(?:\.\d+)?)(万|亿|元)/g;
  private phonePattern = /1[3-9]\d{9}/g;
  private emailPattern = /[\w.-]+@[\w.-]+\.\w+/g;
  private idNumberPattern = /\d{17}[\dXx]/g;

  detectPII(text: string): PIIMatch[] {
    const matches: PIIMatch[] = [];
    let counter = { client: 0, amount: 0, phone: 0, email: 0, id: 0 };

    // 检测客户名
    this.clientPatterns.forEach((client) => {
      const index = text.indexOf(client);
      if (index !== -1) {
        matches.push({
          type: 'CLIENT',
          value: client,
          placeholder: `[CLIENT_${String(++counter.client).padStart(3, '0')}]`,
          start: index,
          end: index + client.length,
        });
      }
    });

    // 检测金额
    const amountMatches = text.matchAll(this.amountPattern);
    for (const match of amountMatches) {
      matches.push({
        type: 'AMOUNT',
        value: match[0],
        placeholder: `[AMOUNT_${String(++counter.amount).padStart(3, '0')}]`,
        start: match.index!,
        end: match.index! + match[0].length,
      });
    }

    // 检测手机号
    const phoneMatches = text.matchAll(this.phonePattern);
    for (const match of phoneMatches) {
      matches.push({
        type: 'PHONE',
        value: match[0],
        placeholder: `[PHONE_${String(++counter.phone).padStart(3, '0')}]`,
        start: match.index!,
        end: match.index! + match[0].length,
      });
    }

    // 检测邮箱
    const emailMatches = text.matchAll(this.emailPattern);
    for (const match of emailMatches) {
      matches.push({
        type: 'EMAIL',
        value: match[0],
        placeholder: `[EMAIL_${String(++counter.email).padStart(3, '0')}]`,
        start: match.index!,
        end: match.index! + match[0].length,
      });
    }

    // 检测身份证号
    const idMatches = text.matchAll(this.idNumberPattern);
    for (const match of idMatches) {
      matches.push({
        type: 'ID_NUMBER',
        value: match[0],
        placeholder: `[ID_${String(++counter.id).padStart(3, '0')}]`,
        start: match.index!,
        end: match.index! + match[0].length,
      });
    }

    // 按位置排序
    return matches.sort((a, b) => a.start - b.start);
  }
}
