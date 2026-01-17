import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActionService } from './action.service';
import { ExecuteActionDto } from './dto/execute-action.dto';

@Controller('api/actions')
@UseGuards(JwtAuthGuard)
export class ActionController {
  constructor(private actionService: ActionService) {}

  @Post('execute')
  async execute(@Body() dto: ExecuteActionDto, @Request() req) {
    return this.actionService.executeAction(dto, req.user.userId);
  }

  @Get('history')
  async getHistory(@Request() req) {
    return this.actionService.getActionHistory(req.user.userId);
  }
}
