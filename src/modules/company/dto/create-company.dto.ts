import {
IsEmail,
IsEnum,
IsNotEmpty,
IsString,
MinLength,
} from "class-validator";


export class CreateCompanyDto {

@IsNotEmpty()
@IsString()
@MinLength(2)
companyName!: string;

@IsNotEmpty()
@IsString()
@MinLength(10)
description!: string;

@IsNotEmpty()
@IsString()
@MinLength(2)
industry!: string;

@IsNotEmpty()
@IsString()
@MinLength(5)
address!: string;

@IsNotEmpty()
@IsString()
numberOfEmployees!: string;

@IsNotEmpty()
@IsEmail({}, {
message: 'companyEmail must be a valid email',
})
companyEmail!: string;
}
