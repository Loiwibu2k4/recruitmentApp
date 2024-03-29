import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, ValidateNested, isNumber } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty({message: 'id company is not empty'})
    _id: mongoose.Schema.Types.ObjectId;
    @IsNotEmpty({message: 'company name is not empty'})
    name: string;
}

export class CreateJobDto {
    @IsNotEmpty({
        message: 'name not empty'
    })
    name: string;
    @IsNotEmpty({
        message: 'location not empty'
    })
    location: string;
    @IsNotEmpty({
        message: 'description not empty'
    })
    description: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company) company: Company;

    @IsNumber()
    salary: number;

    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    level: string;

    @IsBoolean()
    isActive: boolean;

    @IsDate()
    startDate: Date

    @IsDate()
    endDate: Date
}
