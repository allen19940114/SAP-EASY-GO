import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TemplateService } from './template.service';
import { CreateTemplateDto } from './dto/create-template.dto';

@Controller('api/templates')
@UseGuards(JwtAuthGuard)
export class TemplateController {
  constructor(private templateService: TemplateService) {}

  @Post()
  create(@Body() dto: CreateTemplateDto, @Request() req) {
    return this.templateService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.templateService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.templateService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateTemplateDto>, @Request() req) {
    return this.templateService.update(id, req.user.userId, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.templateService.delete(id, req.user.userId);
  }

  @Post(':id/execute')
  execute(@Param('id') id: string, @Body() body: { parameters: Record<string, any> }, @Request() req) {
    return this.templateService.execute(id, req.user.userId, body.parameters);
  }
}
