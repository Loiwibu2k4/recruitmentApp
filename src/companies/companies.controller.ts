import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UseInterceptors, Version } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { IUser } from 'src/users/users.interface';
import { User } from 'src/decorators/user.decorator';
import mongoose from 'mongoose';
import { ResponseMessage } from 'src/decorators/responseMessage.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Version('1')
  @Post('/create')
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: IUser
  ) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @ResponseMessage('Fetch list companies with paginate')
  @Get()
  findAll(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string
  ) {
    return this.companiesService.findAll(pageSize, current, qs);
  }

  @Version('1')
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @Version('1')
  @Patch('/update/:id')
  update(
    @Param('id') id: mongoose.Schema.Types.ObjectId, 
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete('/delete/:id')
  remove(
    @Param('id') id: string,
    @User() user: IUser
  ) {
    return this.companiesService.remove(id, user);
  }
}