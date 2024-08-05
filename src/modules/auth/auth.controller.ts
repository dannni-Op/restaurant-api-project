import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { SignInDto } from './dto/signIn.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() requst: CreateUserDto): Promise<any> {
    const tokens = await this.authService.signup(requst);
    return tokens;
  }

  @Post('/signin')
  async signin(@Body() request: SignInDto): Promise<any> {
    const tokens = await this.authService.signin(request);
    return tokens;
  }
}
