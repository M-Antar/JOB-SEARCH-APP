import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsEnum,
  IsDateString,
  IsMobilePhone,
  Validate,
} from 'class-validator';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { GENDER } from 'src/common/types';

@ValidatorConstraint({ name: 'isAdultAndPastDate', async: false })
export class IsAdultAndPastDateConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const dob = new Date(value);
    const now = new Date();

    if (dob >= now) return false;

    const age = (now.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return age >= 18;
  }

  defaultMessage(args: ValidationArguments) {
    return 'DOB must be a past date and user must be at least 18 years old';
  }
}

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(GENDER)
  gender!: GENDER;

  @IsDateString()
  @Validate(IsAdultAndPastDateConstraint)
  DOB!: string;

  @IsMobilePhone()
  mobileNumber!: string;
}