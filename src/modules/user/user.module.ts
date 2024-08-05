import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { RoleModule } from '../role/role.module';
import { UserController } from './user.controller';

@Module({
  imports: [RoleModule],
  exports: [UserService, UserRepository],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
