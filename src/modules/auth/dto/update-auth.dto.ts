import { PartialType } from '@nestjs/mapped-types';
import { SignUpDto } from './SignUp-Dto';

export class UpdateAuthDto extends PartialType(SignUpDto) {}
