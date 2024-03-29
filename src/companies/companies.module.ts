import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './shemas/company.schema';
import { HelpersModule } from 'src/helpers/helpers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    HelpersModule
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService]
})
export class CompaniesModule {}