import { Types } from "mongoose";

import { CreateJobDto } from "../dto/create-job.dto";
import { Job } from "../entities/job.entity";

export class JobFactoryService {

createJob(
  createJobDto: CreateJobDto,
  addedBy: Types.ObjectId,
) {
  const job = new Job();

  job.jobTitle = createJobDto.jobTitle;
  job.jobLocation = createJobDto.jobLocation;
  job.workingTime = createJobDto.workingTime;
  job.seniorityLevel = createJobDto.seniorityLevel;
  job.jobDescription = createJobDto.jobDescription;
  job.technicalSkills = createJobDto.technicalSkills;
  job.softSkills = createJobDto.softSkills;

  job.addedBy = addedBy;
  job.updatedBy = addedBy;

  job.companyId = new Types.ObjectId(createJobDto.companyId);

  job.closed = false;

  return job;
}
}