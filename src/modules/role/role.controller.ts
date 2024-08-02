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
  getRole(@Param('id', ParseIntPipe) id: number): string {
    return 'get role by id';
  }

  @Get()
  getAllRole(): string {
    return 'get all role';
  }

  @Put('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateRoleDto,
  ): string {
    return 'update role';
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): string {
    return 'delete role';
  }
}
