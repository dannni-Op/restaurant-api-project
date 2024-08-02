import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private typeormRepository: Repository<Role>,
  ) {}
}
