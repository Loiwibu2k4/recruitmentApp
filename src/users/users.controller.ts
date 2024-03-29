import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO, RegisterUserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/role/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { IUser } from './users.interface';
import { User } from 'src/decorators/user.decorator';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage('fetch user by id')
  @Public()
  @Get('/:id')
  findById(
    @Param('id') 
    id: string,
  ) {
    return this.usersService.findById(id);
  }

  @ResponseMessage('fetch user with paginate')
  @Get()
  async findByPaginate(
    @Query("current") page: number,
    @Query('pageSize') limit: number,
    @Query() qs: string
  ) {
    return await this.usersService.findByPaginate(page, limit, qs);
  }

  @ResponseMessage('create account with hight role')
  @Post()
  async createAccount(
    @Body() createUserDTO: CreateUserDTO,
    @User() user: IUser
  ) {
    return await this.usersService.create(createUserDTO, user);
  }

  @ResponseMessage('update user')
  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser
  ) {
    return this.usersService.update(updateUserDto, user);
  }

  @ResponseMessage('soft delete a user')
  @Delete('/:id')
  async delete(
    @Param('id')
    id: string,
    @User() user: IUser
  ) {
    return this.usersService.delete(id, user);
  }
}
