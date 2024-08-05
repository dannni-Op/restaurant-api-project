import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { RoleRepository } from '../role/role.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found.`);
    return user;
  }

  async create(request: CreateUserDto): Promise<User> {
    const emailExist = await this.userRepository.findByEmail(request.email);
    if (emailExist) throw new ConflictException(`Email must be unique.`);

    request.password = await bcrypt.hash(request.password, 10);
    const role = await this.roleRepository.findByName('cashier');
    if (!role) throw new NotFoundException(`Default role not found.`);
    const user = new User();
    user.name = request.name;
    user.email = request.email;
    user.password = request.password;
    user.role = role;
    const result = await this.userRepository.createUser(user);
    return result;
  }

  async getByIdWithToken(id: number): Promise<User> {
    const user = await this.userRepository.findByIdWithToken(id);
    if (!user || !user.refreshToken)
      throw new ForbiddenException(`Access denied.`);
    return user;
  }

  async updateRefreshToken(
    id: number,
    request: string | null,
  ): Promise<boolean> {
    await this.get(id);
    const result = await this.userRepository.updateRefreshToken(id, request);
    return result;
  }
}
