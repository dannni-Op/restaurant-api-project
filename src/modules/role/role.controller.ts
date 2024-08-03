import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { Role } from 'src/entities/role.entity';
import { RoleService } from './role.service';

@Controller('/roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  async create(@Body() request: CreateRoleDto): Promise<Role> {
    const role = await this.roleService.create(request);
    return role;
  }

  @Get('/:id')
  async getRole(@Param('id', ParseIntPipe) id: number): Promise<Role> {
    const role = await this.roleService.get(id);
    return role;
  }

  @Get()
  async getAll(): Promise<Role[]> {
    const roles = await this.roleService.getAll();
    return roles;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateRoleDto,
  ): Promise<Role> {
    const role = await this.roleService.update(id, request);
    return role;
  }

  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    const result = await this.roleService.delete(id);
    return result;
  }
}
