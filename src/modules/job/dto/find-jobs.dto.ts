import {
  IsIn,
  IsMongoId,
  IsNumberString,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
} from "class-validator";
import { Transform } from "class-transformer";
import { JOBLOCATION, WORKINGTIME, JOBLEVEL } from "src/common/types";

export class FindJobsDto {
  @IsOptional()
  @IsMongoId()
  companyId?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsEnum(JOBLOCATION)
  jobLocation?: JOBLOCATION;

  @IsOptional()
  @IsEnum(WORKINGTIME)
  workingTime?: WORKINGTIME;

  @IsOptional()
  @IsEnum(JOBLEVEL)
  seniorityLevel?: JOBLEVEL;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : value?.split(',')))
  @IsArray()
  @IsString({ each: true })
  technicalSkills?: string[];

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  @IsIn(['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'jobTitle', '-jobTitle'])
  sort?: string;
}