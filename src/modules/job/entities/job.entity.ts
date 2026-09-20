import { Types } from "mongoose";
import {
  JOBLEVEL,
  JOBLOCATION,
  WORKINGTIME,
} from "src/common/types";

export class Job {

  jobTitle!: string;

  jobLocation!: JOBLOCATION;

  workingTime!: WORKINGTIME;

  seniorityLevel!: JOBLEVEL;

  jobDescription!: string;

  technicalSkills!: string[];

  softSkills!: string[];

  addedBy!: Types.ObjectId;

  updatedBy!: Types.ObjectId;

  closed!: boolean;

  companyId!: Types.ObjectId;

}