import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  private repository = this.dataSource.getRepository(User);

  constructor(private dataSource: DataSource) {}

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
