import { IsNumberString, IsOptional, IsString, IsIn } from 'class-validator';

export class FindApplicationsDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  @IsIn(['createdAt', '-createdAt'])
  sort?: string;
}