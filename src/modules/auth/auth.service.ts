import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from 'src/types/tokens.type';
import { JwtPayloadType } from 'src/types/jwtPayload.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(request: CreateUserDto): Promise<Tokens> {
    const user = await this.userService.create(request);
    //jika selesai, buat tokens dan kembalikan
    const result = await this.generateTokens(user.id, user.email);
    await this.updateRefreshTokeknWithHash(user.id, result.refreshToken);
    return result;
  }

  async signin(request: SignInDto): Promise<Tokens> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const passwordCheck = await bcrypt.compare(request.password, user.password);
    if (!passwordCheck)
      throw new UnauthorizedException('Invalid email or password');

    //jika benar, buat tokens dan kembalikan
    //sebelum dikembalikan hash refresh dan simpan di db
    const result = await this.generateTokens(user.id, user.email);
    await this.updateRefreshTokeknWithHash(user.id, result.refreshToken);
    return result;
  }

  async generateTokens(id: number, email: string): Promise<Tokens> {
    const payload: JwtPayloadType = {
      sub: id,
      email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async updateRefreshTokeknWithHash(
    id: number,
    refreshToken: string,
  ): Promise<void> {
    const rtHash = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(id, rtHash);
  }

  async refreshTheTokens(id: number, refreshToken: string): Promise<Tokens> {
    const user = await this.userService.getByIdWithToken(id);
    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatches) throw new ForbiddenException('Access deined.');

    const result = await this.generateTokens(user.id, user.email);
    await this.updateRefreshTokeknWithHash(user.id, result.refreshToken);
    return result;
  }

  async logout(id: number): Promise<boolean> {
    await this.userService.getByIdWithToken(id);
    await this.userService.updateRefreshToken(id, null);
    return true;
  }
}
