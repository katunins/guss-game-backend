import { Controller, ForbiddenException, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findOne(
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    if (!username || !password) {
      throw new ForbiddenException('unknown password or username');
    }
    return this.usersService.get({ username, password });
  }
}
