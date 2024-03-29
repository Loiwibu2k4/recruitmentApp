import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
    @IsNotEmpty({
        message: 'name not empty'
    })
    name: string;
    @IsNotEmpty({
        message: 'address not empty'
    })
    address: string;
    @IsNotEmpty({
        message: 'description not empty'
    })
    description: string;
}
