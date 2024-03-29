import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';
export class UpdateUserDto extends PartialType(OmitType(CreateUserDTO, ["password"] as const)) {
    @IsNotEmpty({ message: 'id not empty' })
    _id?: string;
    refreshToken?: string;
}