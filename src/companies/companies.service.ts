import { HttpException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { HelpersService } from 'src/helpers/helpers.service';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Company, CompanyDocument } from './shemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: SoftDeleteModel<CompanyDocument>,
    private readonly helpersService: HelpersService
  ){}

  async create(
    createCompanyDto: CreateCompanyDto,
    user: IUser
    ) {
    try {
      const newCompany = new this.companyModel({
        ...createCompanyDto, createdBy: {
          _id: user._id,
          email: user.email
        }
      });
      await newCompany.save();
      return newCompany;
    } catch (error) {
      return error;
    }
  }

  async findAll(limit: number, page: number, qs: string) {
    try {
      const { filter , sort, projection, population } = aqp(qs);
      delete filter.current;
      delete filter.pageSize;
      const totalItem = await this.companyModel.countDocuments(filter);
      const result = await this.companyModel.find(filter)
      .skip(limit*(page - 1))
      .limit(limit)
      .sort(sort as any)
      .select(projection)
      .populate(population)
      .exec();
      return {
        meta: {
          current: page,
          pageSize: result.length,
          pages: Math.ceil(totalItem/limit),
          total: totalItem
        },
        result
      };
    } catch (error) {
      throw new HttpException('cannot fetch companies', 400);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: mongoose.Schema.Types.ObjectId, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    try {
      console.log(user);
      return await this.companyModel.updateOne(
        {
          _id: id,
          isDeleted: false
        },
        {
          ...updateCompanyDto,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      )
    } catch (error) {
      throw new HttpException('cannot update company', 400);
    }
  }

  async remove(id: string, user: IUser) {
    try {
      await this.companyModel.updateOne(
        { 
          _id: id ,
        },
        { 
          deletedBy: {
            _id: user._id,
            email: user.email
          },
          deletedAt: new Date()
        }
      )
      return this.companyModel.softDelete({_id: id});  
    } catch (error) {
      throw new HttpException('cannot delete campany', 400);
    }
  }
}