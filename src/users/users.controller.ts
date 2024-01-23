import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor() {}

  @Get('/:id')
  getUser() {}

  @Post()
  createUser() {}

  @Delete('/:id')
  deleteUser() {}
}
