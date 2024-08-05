import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';

@Module({
  imports: [],
  exports: [RoleRepository],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
})
export class RoleModule {}
