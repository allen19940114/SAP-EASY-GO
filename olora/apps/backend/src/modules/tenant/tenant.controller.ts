import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantService, CreateTenantDto } from './tenant.service';

@Controller('api/interface/tenants')
@UseGuards(JwtAuthGuard)
export class TenantController {
  constructor(private tenantService: TenantService) {}

  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.tenantService.create(dto);
  }

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @Post('subscribe')
  subscribe(@Body() body: { tenantId: string; actionId: string }) {
    return this.tenantService.subscribe(body.tenantId, body.actionId);
  }

  @Post('unsubscribe')
  unsubscribe(@Body() body: { tenantId: string; actionId: string }) {
    return this.tenantService.unsubscribe(body.tenantId, body.actionId);
  }
}
