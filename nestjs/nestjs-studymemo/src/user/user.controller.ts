import { Body, Controller, Get, Param, Put, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('user')
export class UserController {
  // GET /user
  @Get()
  getUser(@Query('name') name: string) {
    const users = [
      { id: 1, name: 'kimi' },
      { id: 2, name: 'grok' },
    ];
    return name ? users.filter((u) => u.name.includes(name)) : users;
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return { id, name: 'kimi' };
  }

  @Post() // Post/user
  createUser(@Body() createUserDto: CreateUserDto) {
    return { data: createUserDto, message: 'User created successfully' };
  }

  @Put(':id') // Put/user
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return {
      data: { id, ...updateUserDto },
      message: 'User update successfully',
    };
  }
}
