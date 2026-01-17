import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    return this.appService.getHealth();
  }

  @Get()
  @ApiOperation({ summary: 'Get API info' })
  getInfo() {
    return {
      name: 'OLORA API',
      version: '1.0.0',
      description: 'SAP AI Agent - Enterprise AI Assistant for SAP Business Operations',
      status: 'running',
    };
  }
}
