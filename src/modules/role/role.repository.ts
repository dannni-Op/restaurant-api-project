import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';

@Injectable()
export class RoleRepository {
  private repository: Repository<Role>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = dataSource.getRepository(Role);
  }

  async createRole(request: CreateRoleDto): Promise<Role> {
    const role = this.repository.create(request);
    const result = await this.repository.save(role);
    return result;
  }

  async findByName(name: string): Promise<Role | null> {
    const result = await this.repository.findOneBy({
      name,
    });

    return result;
  }

  async findById(id: number): Promise<Role | null> {
    const result = await this.repository.findOneBy({
      id,
    });

    return result;
  }

  async fingByIdWithRelation(id: number): Promise<Role> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['users'],
    });

    return result;
  }

  async getRoles(): Promise<Role[]> {
    const result = await this.repository.find();
    return result;
  }

  async updateRole(id: number, request: UpdateRoleDto): Promise<Role> {
    await this.repository.update({ id }, request);
    const result = await this.findById(id);
    return result;
  }

  async deleteRole(id: number): Promise<boolean> {
    await this.repository.delete({ id });
    return true;
  }
}
