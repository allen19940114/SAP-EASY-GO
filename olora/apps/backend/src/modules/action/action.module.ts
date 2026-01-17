import { Module } from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { ValidatorService } from './validator.service';
import { ExecutorService } from './executor.service';
import { PermissionService } from './permission.service';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ActionController],
  providers: [
    ActionService,
    ValidatorService,
    ExecutorService,
    PermissionService,
  ],
  exports: [ActionService],
})
export class ActionModule {}
