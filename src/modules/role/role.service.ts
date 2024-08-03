import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { CreateRoleDto } from './dto/createRole.dto';
import { Role } from 'src/entities/role.entity';
import { UpdateRoleDto } from './dto/updateRole.dto';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async create(request: CreateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findByName(request.name);
    if (role) throw new ConflictException('Role name already exist.');

    const result = await this.roleRepository.createRole(request);
    return result;
  }

  async get(id: number): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) throw new NotFoundException(`Role with id ${id} not found.`);
    return role;
  }

  async getAll(): Promise<Role[]> {
    const roles = await this.roleRepository.getRoles();
    return roles;
  }

  async update(id: number, request: UpdateRoleDto): Promise<Role> {
    const role = await this.get(id);

    const result = await this.roleRepository.updateRole(id, request);
    return result;
  }

  async delete(id: number): Promise<boolean> {
    const role = await this.get(id);

    const result = await this.roleRepository.deleteRole(id);
    return result;
  }
}
