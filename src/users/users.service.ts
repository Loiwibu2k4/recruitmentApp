import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { CreateUserDTO, RegisterUserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/User.schema';
import mongoose, { Error } from 'mongoose';
import { HelpersService } from 'src/helpers/helpers.service';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly helpersService: HelpersService
  ) {} 

  async emailExist (email: string, id?: string) {
    email = email.toLowerCase();
    const user = await this.userModel.findOne({email, isDeleted: false});
    if (!user || id == user.id) return true;
    else return false; 
  }

  async register(registerUserDto: RegisterUserDTO) {
    if(!await this.emailExist(registerUserDto.email))  throw new HttpException('User Had Been Exist', HttpStatus.CONFLICT);
    registerUserDto.email = registerUserDto.email.toLowerCase();
    registerUserDto.password = await this.helpersService.hashingPassword(registerUserDto.password);
    const createUser = new this.userModel(registerUserDto);
    createUser.role = 'USER';
    await createUser.save();
    return {
      _id: createUser._id,
      createdAt: createUser.createdAt
    }
  }

  async create(createUserDTO: CreateUserDTO, user: IUser) {
    if(await this.emailExist(createUserDTO.email)) {
      createUserDTO.email = createUserDTO.email.toLowerCase();
      createUserDTO.password = await this.helpersService.hashingPassword(createUserDTO.password);
      const createUser = new this.userModel({...createUserDTO, 
        createdBy: {
          _id: user._id,
          email: user.email
        }
      });
      await createUser.save();
      return {
        _id: createUser._id,
        createdAt: createUser.createdAt
      }
    } else {
      throw new HttpException('User Had Been Exist', HttpStatus.CONFLICT);
    }
  }

  async findById(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))  throw new HttpException('id invalid', 400);
    const user = await this.userModel.findOne({
      _id: id,
      isDeleted: false
    }).select("-password");
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({
      email: email,
      isDeleted: false
    }).select("-createdAt");
    return user;
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    try {
      if(await this.emailExist(updateUserDto.email, updateUserDto._id)) {
        return await this.userModel.updateOne(
          { _id: updateUserDto._id, isDeleted: false },
          { $set: {...updateUserDto, updatedBy: { _id: user._id, email: user.email }}}
        )
      } else throw new HttpException('Email had exist', 400);
    } catch (error) {
      throw new HttpException('Update user has been error', 400);
    }
  }

  async delete(id: string, user: IUser) {
    try {
      if(!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('id invalid', 400);
      await this.userModel.updateOne(
        { _id: id},
        { $set: { deletedBy : { _id: user._id, email: user.email }} }
      )
      return this.userModel.softDelete(
        { _id: id }
      )
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async findByPaginate(page: number, limit: number, qs: string) {
    const { filter , sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    const totalItem = await this.userModel.countDocuments(filter);
    const result = await this.userModel.find(filter)
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
  }

  updateUserToken = async (refresh_token: string, _id: string) => {
    try {
      await this.userModel.updateOne(
        { _id: _id },
        {$set: { refreshToken: refresh_token }}
      );
    } catch (error) {
      throw new HttpException('cannot set refresh token', 400);
    }
  }
 
  findByRefreshToken = async (refresh_token: string) => {
    try {
      return await this.userModel.findOne({
          refreshToken: refresh_token,
          isDeleted: false
        }
      );
    } catch (error) {
      throw new HttpException('Cannot find user by refresh token', 400);
    }
  }
}