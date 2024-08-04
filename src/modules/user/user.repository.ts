import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async findById(id: number): Promise<User | null> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['role'],
    });
    return result;
  }
}
