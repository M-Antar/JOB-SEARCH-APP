import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from "class-validator";

import {
  JOBLEVEL,
  JOBLOCATION,
  WORKINGTIME,
} from "src/common/types";

export class CreateJobDto {

  @IsString()
  @IsNotEmpty()
  jobTitle!: string;


  @IsEnum(JOBLOCATION)
  jobLocation!: JOBLOCATION;


  @IsEnum(WORKINGTIME)
  workingTime!: WORKINGTIME;


  @IsEnum(JOBLEVEL)
  seniorityLevel!: JOBLEVEL;


  @IsString()
  @IsNotEmpty()
  jobDescription!: string;


  @IsArray()
  @IsString({ each: true })
  technicalSkills!: string[];


  @IsArray()
  @IsString({ each: true })
  softSkills!: string[];


  @IsMongoId()
  @IsNotEmpty()
  companyId!: string;
}