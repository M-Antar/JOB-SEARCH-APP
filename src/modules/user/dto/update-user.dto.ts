import { IsDateString, IsEnum, IsOptional, IsString, MinLength, Validate } from "class-validator";
import { GENDER } from "src/common/types";
import { IsAdultAndPastDateConstraint } from "src/modules/auth/dto/SignUp-Dto";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @IsOptional()
  @IsDateString({}, { message: 'DOB must be a valid date, format YYYY-MM-DD' })
  @Validate(IsAdultAndPastDateConstraint)
  DOB?: string;

  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @IsOptional()
  @IsEnum(GENDER, { message: 'gender must be Male or Female' })
  gender?: GENDER;
}