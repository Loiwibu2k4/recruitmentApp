import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HelpersService } from './helpers/helpers.service';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
  ){}
  getHello(): string {
    return 'Hello World!';
  }
}