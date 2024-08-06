import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/role.decorator';

@Roles('admin')
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}
}
