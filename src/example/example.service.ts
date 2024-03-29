import { Inject, Injectable } from '@nestjs/common';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { AsyncConfigOptions } from './example.module';
import { MY_PROVIDER } from './provider.token';


@Injectable()
export class ExampleService {
  constructor(
    @Inject(MY_PROVIDER) private options: any,
  ){
    console.log(this.options.subscribe(value => console.log('cmd', value)));
  }
  create(createExampleDto: CreateExampleDto) {
    return 'This action adds a new example';
  }

  findAll() {
    return `This action returns all example`;
  }

  findOne(id: number) {
    return `This action returns a #${id} example`;
  }

  update(id: number, updateExampleDto: UpdateExampleDto) {
    return `This action updates a #${id} example`;
  }

  remove(id: number) {
    return `This action removes a #${id} example`;
  }
}
