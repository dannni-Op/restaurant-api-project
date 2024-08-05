import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserRepository {
  private repository = this.dataSource.getRepository(User);

  constructor(private dataSource: DataSource) {}

  async findById(id: number): Promise<User | null> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      select: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
      relations: ['role'],
    });
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.repository.findOne({
      where: {
        email,
      },
      relations: ['role'],
    });
    return result;
  }

  async createUser(request: CreateUserDto): Promise<User> {
    const user = this.repository.create(request);
    const result = await this.repository.save(user);
    return result;
  }

  async updateRefreshToken(
    id: number,
    request: string | null,
  ): Promise<boolean> {
    await this.repository.update(id, { refreshToken: request });
    return true;
  }

  async findByIdWithToken(id: number): Promise<User | null> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['role'],
    });
    return result;
  }
}
