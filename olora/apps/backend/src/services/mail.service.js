/**
 * OLORA Mail Service
 * Email connection and reading service integrated from MAILAGENT
 *
 * Features:
 * - IMAP connection testing
 * - Email fetching and parsing
 * - Multi-account support
 * - Popular email providers (QQ, 163, Gmail, Outlook, etc.)
 */

const Imap = require('imap');
const { simpleParser } = require('mailparser');
const { v4: uuidv4 } = require('uuid');

class MailService {
  constructor() {
    this.connections = new Map(); // 存储活跃连接
    this.providers = {
      qq: {
        name: 'QQ 邮箱',
        imap_host: 'imap.qq.com',
        imap_port: 993,
        use_ssl: true,
        smtp_host: 'smtp.qq.com',
        smtp_port: 465,
      },
      '163': {
        name: '163 邮箱',
        imap_host: 'imap.163.com',
        imap_port: 993,
        use_ssl: true,
        smtp_host: 'smtp.163.com',
        smtp_port: 465,
      },
      '126': {
        name: '126 邮箱',
        imap_host: 'imap.126.com',
        imap_port: 993,
        use_ssl: true,
        smtp_host: 'smtp.126.com',
        smtp_port: 465,
      },
      gmail: {
        name: 'Gmail',
        imap_host: 'imap.gmail.com',
        imap_port: 993,
        use_ssl: true,
        smtp_host: 'smtp.gmail.com',
        smtp_port: 465,
      },
      outlook: {
        name: 'Outlook',
        imap_host: 'outlook.office365.com',
        imap_port: 993,
        use_ssl: true,
        smtp_host: 'smtp.office365.com',
        smtp_port: 587,
      },
      aliyun: {
        name: '阿里云邮箱',
        imap_host: 'imap.aliyun.com',
        imap_port: 993,
        use_ssl: true,
        smtp_host: 'smtp.aliyun.com',
        smtp_port: 465,
      },
    };
  }

  /**
   * Create IMAP connection
   */
  createConnection(config) {
    return new Imap({
      user: config.username || config.email,
      password: config.password,
      host: config.imap_host,
      port: config.imap_port || 993,
      tls: config.use_ssl !== false,
      tlsOptions: { rejectUnauthorized: false },
      connTimeout: 30000,
      authTimeout: 30000,
    });
  }

  /**
   * Test email account connection
   * @param {Object} config - Email configuration
   * @returns {Promise<Object>} - { success: boolean, error?: string }
   */
  async testConnection(config) {
    return new Promise((resolve) => {
      const imap = this.createConnection(config);
      const timeout = setTimeout(() => {
        try {
          imap.end();
        } catch (e) {}
        resolve({ success: false, error: '连接超时' });
      }, 30000);

      imap.once('ready', () => {
        clearTimeout(timeout);
        imap.end();
        resolve({ success: true });
      });

      imap.once('error', (err) => {
        clearTimeout(timeout);
        resolve({ success: false, error: err.message });
      });

      imap.connect();
    });
  }

  /**
   * Get provider configuration
   * @param {string} provider - Provider key (qq, 163, gmail, etc.)
   * @returns {Object} - Provider configuration
   */
  getProviderConfig(provider) {
    return this.providers[provider] || null;
  }

  /**
   * List all supported providers
   * @returns {Object} - All provider configurations
   */
  getAllProviders() {
    return this.providers;
  }

  /**
   * Fetch emails from account
   * @param {Object} config - Email configuration
   * @param {Object} options - Fetch options { limit, since }
   * @returns {Promise<Array>} - Array of email objects
   */
  async fetchEmails(config, options = {}) {
    const limit = options.limit || 50;
    const since = options.since || null;

    return new Promise((resolve, reject) => {
      const imap = this.createConnection(config);
      const timeout = setTimeout(() => {
        try {
          imap.end();
        } catch (e) {}
        reject(new Error('连接超时'));
      }, 60000);

      imap.once('ready', () => {
        clearTimeout(timeout);

        imap.openBox('INBOX', true, async (err, box) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          const total = box.messages.total;
          if (total === 0) {
            imap.end();
            return resolve([]);
          }

          // 计算要获取的邮件范围
          const start = Math.max(1, total - limit + 1);
          const end = total;

          console.log(`[MailService] 获取邮件: ${start}:${end} (共 ${total} 封)`);

          try {
            const emails = await this.fetchEmailRange(imap, start, end, since);
            imap.end();
            resolve(emails);
          } catch (error) {
            imap.end();
            reject(error);
          }
        });
      });

      imap.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });

      imap.connect();
    });
  }

  /**
   * Fetch email range
   * @private
   */
  async fetchEmailRange(imap, start, end, since) {
    return new Promise((resolve, reject) => {
      const emails = [];
      const range = `${start}:${end}`;

      const fetch = imap.seq.fetch(range, {
        bodies: '',
        struct: true,
      });

      fetch.on('message', (msg, seqno) => {
        let buffer = '';
        let attrs = null;

        msg.on('body', (stream) => {
          stream.on('data', (chunk) => {
            buffer += chunk.toString();
          });
        });

        msg.once('attributes', (a) => {
          attrs = a;
        });

        msg.once('end', async () => {
          try {
            const parsed = await simpleParser(buffer);

            // 如果设置了时间过滤
            if (since && parsed.date && parsed.date < since) {
              return;
            }

            const email = {
              id: uuidv4(),
              messageId: parsed.messageId || `seq-${seqno}-${Date.now()}`,
              subject: parsed.subject || '(无主题)',
              from: parsed.from?.value?.[0]?.address || '',
              fromName: parsed.from?.value?.[0]?.name || '',
              to: parsed.to?.value?.map((t) => t.address) || [],
              date: parsed.date?.toISOString() || new Date().toISOString(),
              text: (parsed.text || '').substring(0, 10000),
              html: (parsed.html || '').substring(0, 20000),
              isRead: attrs?.flags?.includes('\\Seen') || false,
              isImportant: attrs?.flags?.includes('\\Flagged') || false,
              hasAttachments: parsed.attachments?.length > 0 || false,
              attachments: parsed.attachments?.map((att) => ({
                filename: att.filename,
                contentType: att.contentType,
                size: att.size,
              })) || [],
            };

            emails.push(email);
          } catch (error) {
            console.error(`[MailService] 解析邮件 ${seqno} 失败:`, error.message);
          }
        });
      });

      fetch.once('error', (err) => {
        reject(err);
      });

      fetch.once('end', () => {
        // 按日期倒序排序（最新的在前）
        emails.sort((a, b) => new Date(b.date) - new Date(a.date));
        resolve(emails);
      });
    });
  }

  /**
   * Get email detail by message ID
   * @param {Object} config - Email configuration
   * @param {string} messageId - Message ID
   * @returns {Promise<Object>} - Email detail
   */
  async getEmailDetail(config, messageId) {
    return new Promise((resolve, reject) => {
      const imap = this.createConnection(config);
      const timeout = setTimeout(() => {
        try {
          imap.end();
        } catch (e) {}
        reject(new Error('连接超时'));
      }, 30000);

      imap.once('ready', () => {
        clearTimeout(timeout);

        imap.openBox('INBOX', true, (err) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          // 搜索邮件
          imap.search([['HEADER', 'MESSAGE-ID', messageId]], (err, results) => {
            if (err || !results || results.length === 0) {
              imap.end();
              return reject(new Error('邮件未找到'));
            }

            const seqno = results[0];
            const fetch = imap.seq.fetch(seqno, { bodies: '' });

            let buffer = '';
            fetch.on('message', (msg) => {
              msg.on('body', (stream) => {
                stream.on('data', (chunk) => {
                  buffer += chunk.toString();
                });
              });

              msg.once('end', async () => {
                imap.end();
                try {
                  const parsed = await simpleParser(buffer);
                  resolve({
                    messageId: parsed.messageId,
                    subject: parsed.subject,
                    from: parsed.from?.value?.[0],
                    to: parsed.to?.value,
                    cc: parsed.cc?.value,
                    date: parsed.date?.toISOString(),
                    text: parsed.text,
                    html: parsed.html,
                    attachments: parsed.attachments?.map((att) => ({
                      filename: att.filename,
                      contentType: att.contentType,
                      size: att.size,
                      content: att.content,
                    })),
                  });
                } catch (error) {
                  reject(error);
                }
              });
            });

            fetch.once('error', (err) => {
              imap.end();
              reject(err);
            });
          });
        });
      });

      imap.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });

      imap.connect();
    });
  }

  /**
   * Get inbox stats
   * @param {Object} config - Email configuration
   * @returns {Promise<Object>} - { total, unread }
   */
  async getInboxStats(config) {
    return new Promise((resolve, reject) => {
      const imap = this.createConnection(config);
      const timeout = setTimeout(() => {
        try {
          imap.end();
        } catch (e) {}
        reject(new Error('连接超时'));
      }, 30000);

      imap.once('ready', () => {
        clearTimeout(timeout);

        imap.openBox('INBOX', true, (err, box) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          const stats = {
            total: box.messages.total,
            unread: box.messages.unseen || 0,
          };

          imap.end();
          resolve(stats);
        });
      });

      imap.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });

      imap.connect();
    });
  }
}

module.exports = new MailService();
