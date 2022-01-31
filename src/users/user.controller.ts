import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
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

  @Get('/:id')
  // @Roles('admin')
  getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  // @Roles('admin')
  createUser(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user,
  ): Promise<User> {
    return this.userService.createUser(createUserDto, user);
  }

  @Put('/:id')
  // @Roles('admin')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
    @GetUser() user,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto, user);
  }

  @Delete('/:id')
  // @Roles('admin')
  deleteUser(
    @Param('id') id: string,
    @GetUser() user,
  ): Promise<{ message: string }> {
    return this.userService.deleteUser(id, user);
  }
}
