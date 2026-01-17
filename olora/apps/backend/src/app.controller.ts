import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      message: 'OLORA API Server is running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('api/chat')
  async chat(@Body() body: { message: string }) {
    // 模拟AI回复
    const response = this.generateResponse(body.message);
    return {
      message: response,
      timestamp: new Date().toISOString(),
    };
  }

  private generateResponse(userMessage: string): string {
    const lower = userMessage.toLowerCase();

    if (lower.includes('你好') || lower.includes('hello')) {
      return '你好！我是OLORA AI助手。我现在处于演示模式，后端API已经运行。完整功能需要配置LLM API密钥。';
    }

    if (lower.includes('功能')) {
      return '✅ 后端API已启动\n✅ 数据库已连接\n⏳ LLM集成需要配置API密钥\n⏳ RAG知识库需要配置Qdrant';
    }

    return `收到您的消息："${userMessage}"\n\n当前系统状态：\n- 后端API：运行中 ✅\n- 数据库：PostgreSQL已连接 ✅\n- LLM：需要配置API密钥 ⏳\n- 向量库：需要启动Qdrant ⏳`;
  }
}
