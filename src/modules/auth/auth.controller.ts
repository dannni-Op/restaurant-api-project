import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { SignInDto } from './dto/signIn.dto';
import { Public } from 'src/decorators/public.decorator';
import { RefreshToken } from 'src/decorators/refreshToken.decorator';
import { Tokens } from 'src/types/tokens.type';
import { RtGuard } from 'src/guards/rt.guard';
import { User } from 'src/decorators/user.decorator';
import { JwtPayloadType } from 'src/types/jwtPayload.type';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() requst: CreateUserDto): Promise<any> {
    const tokens = await this.authService.signup(requst);
    return tokens;
  }

  @Public()
  @Post('/signin')
  async signin(@Body() request: SignInDto): Promise<any> {
    const tokens = await this.authService.signin(request);
    return tokens;
  }

  @Delete('/logout')
  async logout(): Promise<boolean> {
    const result = await this.authService.logout(4);
    return result;
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  async refresh(
    @User() payload: JwtPayloadType,
    @RefreshToken() refreshToken: string,
  ): Promise<Tokens> {
    const tokens = await this.authService.refreshTheTokens(
      payload.sub,
      refreshToken,
    );
    return tokens;
  }
}
