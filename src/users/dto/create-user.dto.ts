import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

class Company {
    @IsNotEmpty({message: 'id company is not empty'})
    _id: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({message: 'company name is not empty'})
    name: string;
}

export class RegisterUserDTO {
    @IsEmail({}, {message: 'email is not empty'}) email: string;
    @IsNotEmpty({message: 'pass  is not empty'}) password: string;
    @IsNotEmpty({message: 'name  is not empty'}) name: string;
    @IsNotEmpty({message: 'address  is not empty'}) address?: string;
    @IsNumber({}, {message: 'age  is not empty'}) age: number;
    gender?: string;
}

export class CreateUserDTO {
    @IsEmail({}, {message: 'email is not empty'}) email: string;
    @IsNotEmpty({message: 'pass  is not empty'}) password: string;
    @IsNotEmpty({message: 'name  is not empty'}) name: string;
    @IsNotEmpty({message: 'address  is not empty'}) address?: string;
    @IsNumber({}, {message: 'age  is not empty'}) age: number;
    gender?: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company) company: Company;
}