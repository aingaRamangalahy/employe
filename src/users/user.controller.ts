import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get('/audit')
  getAllUsersAudit(): Promise<User[]> {
    return this.userService.getAllUsersAudit();
  }

  @Get('/:id')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  @UseGuards(AuthGuard(), new RoleGuard(new Reflector()))
  @Roles('admin')
  createUser(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.userService.createUser(createUserDto, user);
  }

  @Put('/:id')
  @UseGuards(AuthGuard(), new RoleGuard(new Reflector()))
  @Roles('admin')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
    @GetUser() user,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(), new RoleGuard(new Reflector()))
  @Roles('admin')
  deleteUser(
    @Param('id') id: string,
    @GetUser() user,
  ): Promise<{ message: string }> {
    return this.userService.deleteUser(id, user);
  }
}
