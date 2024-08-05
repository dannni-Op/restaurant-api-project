import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule],
  exports: [],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
