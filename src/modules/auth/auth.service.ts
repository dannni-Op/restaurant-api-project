import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from '../user/dto/createUser.dto';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private userService: UserService,
  ) {}

  async signup(request: CreateUserDto): Promise<any> {
    const result = this.userService.create(request);
    //jika selesai, buat tokens dan kembalikan
    return {
      acc: 'hehe',
      ref: 'hehe',
    };
  }

  async signin(request: SignInDto): Promise<any> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const passwordCheck = await bcrypt.compare(request.password, user.password);
    if (!passwordCheck)
      throw new UnauthorizedException('Invalid email or password');

    //jika benar, buat tokens dan kembalikan
    return {
      acc: 'hehe',
      ref: 'hehe',
    };
  }
}
