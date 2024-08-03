import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';

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

  async findById(id: number): Promise<Role | null> {
    const result = await this.typeormRepository.findOneBy({
      id,
    });

    return result;
  }

  async getRoles(): Promise<Role[]> {
    const result = await this.typeormRepository.find();
    return result;
  }

  async updateRole(id: number, request: UpdateRoleDto): Promise<Role> {
    await this.typeormRepository.update({ id }, request);
    const result = await this.findById(id);
    return result;
  }

  async deleteRole(id: number): Promise<boolean> {
    await this.typeormRepository.delete({ id });
    return true;
  }
}
