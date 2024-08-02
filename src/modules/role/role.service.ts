import { ConflictException, Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { CreateRoleDto } from './dto/createRole.dto';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  async create(request: CreateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findByName(request.name);
    if (role) throw new ConflictException('Role name already exist.');

    const result = await this.roleRepository.createRole(request);
    return result;
  }
}
