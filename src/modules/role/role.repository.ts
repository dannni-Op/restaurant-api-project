import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/createRole.dto';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private typeormRepository: Repository<Role>,
  ) {}

  async createRole(request: CreateRoleDto): Promise<Role> {
    const role = this.typeormRepository.create(request);
    const result = await this.typeormRepository.save(role);
    return result;
  }

  async findByName(name: string): Promise<Role | null> {
    const result = await this.typeormRepository.findOneBy({
      name,
    });

    return result;
  }
}
