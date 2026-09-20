import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';

import { JobRepository } from 'src/models/job/job.repository';
import { CompanyRepository } from 'src/models/company/company.repository';
import { Types } from 'mongoose';
import { FindJobsDto } from './dto/find-jobs.dto';
import { ApplicationRepository } from 'src/models/application/application.repository';
import { FindApplicationsDto } from './dto/find-applications.dto';
import cloudinary from 'src/config/cloudinary.config';
import { Readable } from 'stream';
import { APPLICATIONSTATUS } from 'src/common/types';
import { AppChangeStatus } from './dto/apllication-statues.dto';
import { UserRepository } from 'src/models/user/user.repository';
import { ACCEPT_APPLICATION_EMAIL, REJECT_APPLICATION_EMAIL } from 'src/common/constants/email.constants';
import { MailService } from '../mail/mail.service';
import { NotificationsGateway } from 'src/socket';

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly notificationsGateway: NotificationsGateway






  ) { }


  private uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Cloudinary upload failed'));
          }
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
  async create(createdJob: Job) {

    const company = await this.companyRepository.getOne(
      { _id: createdJob.companyId }
    );

    if (!company) {
      throw new NotFoundException('Company not found');
    }


    const isOwner =
      company.createdBy.toString() === createdJob.addedBy.toString();


    const isHR = company.HRs.some(
      (hrId) => hrId.toString() === createdJob.addedBy.toString(),
    );

    if (!isOwner && !isHR) {
      throw new ForbiddenException(
        'Only company owner or HR can add a job',
      );
    }


    return await this.jobRepository.create(createdJob);
  }

  async update(
    id: string,
    updateJobDto: UpdateJobDto,
    userId: Types.ObjectId,
  ) {

    const job = await this.jobRepository.getOne({ _id: id });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const company = await this.companyRepository.getOne({ _id: job.companyId });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const isOwner =
      company.createdBy.toString() === userId.toString();

    if (!isOwner) {
      throw new ForbiddenException(
        'Only the company owner can update this job',
      );
    }


    return await this.jobRepository.findOneAndUpdate(
      { _id: id },
      updateJobDto
    );
  }

  async findAll(query: FindJobsDto) {
    const {
      companyId,
      companyName,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobTitle,
      technicalSkills,
      page = '1',
      limit = '10',
      sort = '-createdAt',
    } = query;

    const filter: Record<string, any> = { deletedAt: { $exists: false } };

    if (companyId) filter.companyId = companyId;
    if (jobLocation) filter.jobLocation = jobLocation;
    if (workingTime) filter.workingTime = workingTime;
    if (seniorityLevel) filter.seniorityLevel = seniorityLevel;

    if (jobTitle) {
      filter.jobTitle = { $regex: jobTitle, $options: 'i' };
    }

    if (technicalSkills?.length) {
      filter.technicalSkills = { $in: technicalSkills };
    }

    if (companyName) {
      const companies = await this.companyRepository.getAll({
        companyName: { $regex: companyName, $options: 'i' },
      });
      filter.companyId = { $in: companies.map((c) => c._id) };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      this.jobRepository.getAll(filter, undefined, { skip, limit: limitNum, sort }),
      this.jobRepository.count(filter),
    ]);

    return {
      data: jobs,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }



  findOne(id: string) {
    return `This action returns a #${id} job`;
  }



  async remove(id: string, userId: Types.ObjectId) {


    const jobExist = await this.jobRepository.getOne({ _id: id })
    if (!jobExist) {
      throw new NotFoundException("Job Not Found")
    }

    const companyExist = await this.companyRepository.getOne({
      _id: jobExist.companyId,
    });

    if (!companyExist) {
      throw new NotFoundException('Company Not Found');
    }



    const isHR = companyExist.HRs.some(
      (hrId) => hrId.toString() === userId.toString(),
    );


    if (!isHR) {
      throw new ForbiddenException(
        'Only the company HR can update this job',
      );
    }


    return await this.jobRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { deletedAt: new Date() },
    );

  }
  async getApplicationsForJob(
    jobId: string,
    query: FindApplicationsDto,
    userId: Types.ObjectId,
  ) {
    const job = await this.jobRepository.getOne({ _id: jobId });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const company = await this.companyRepository.getOne({ _id: job.companyId });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const isOwner = company.createdBy.toString() === userId.toString();
    const isHR = company.HRs.some((hrId) => hrId.toString() === userId.toString());

    if (!isOwner && !isHR) {
      throw new ForbiddenException(
        'Only the company owner or HR can view applications for this job',
      );
    }

    const { page = '1', limit = '10', sort = '-createdAt' } = query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const jobWithDetails: any = await this.jobRepository
      .findOneQuery({ _id: jobId })
      .populate({
        path: 'companyId', // populate the job's own company reference
      })
      .populate({
        path: 'applications', // virtual populate
        options: { skip, limit: limitNum, sort },
        populate: {
          path: 'userId', // nested populate: full user, not just id
          select: '-password',
        },
      });

    const total = await this.applicationRepository.count({ jobId });

    const { applications, ...jobData } = jobWithDetails?.toObject
      ? jobWithDetails.toObject()
      : jobWithDetails;

    return {
      job: jobData,
      data: applications ?? [],
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async applyToJob(
    jobId: string,
    userId: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    const jobExist = await this.jobRepository.getOne({ _id: jobId });

    if (!jobExist) {
      throw new NotFoundException('job not found');
    }
    if (jobExist.closed) {
      throw new ForbiddenException('This job is no longer accepting applications');
    }

    const existingApplication = await this.applicationRepository.getOne({
      jobId: new Types.ObjectId(jobId),
      userId: new Types.ObjectId(userId),
    });
    
    if (existingApplication) {
      throw new ForbiddenException('You have already applied to this job');
    }

    if (!file) {
      throw new BadRequestException('CV file is required');
    }

    const uploadedCV = await this.uploadToCloudinary(file, 'application-cvs');

    const application = await this.applicationRepository.create({
      jobId: new Types.ObjectId(jobId),
      userId,
      userCV: uploadedCV,
      status: APPLICATIONSTATUS.PENDING,
    });

    const company = await this.companyRepository.getOne({ _id: jobExist.companyId });
    if (company) {
      const recipientIds = [
        company.createdBy.toString(),
        ...company.HRs.map((hrId) => hrId.toString()),
      ];

      this.notificationsGateway.notifyNewApplication(recipientIds, {
        jobId: jobExist._id,
        jobTitle: jobExist.jobTitle,
        applicationId: application._id,
        applicantId: userId,
        message: `New application received for "${jobExist.jobTitle}"`,
      });
    }

    return application;
  }
  async changeStatusApplication(userId: Types.ObjectId, appChangeStatus: AppChangeStatus) {

    const appExist = await this.applicationRepository.getOne({ _id: appChangeStatus.appID })
    if (!appExist) {
      throw new NotFoundException("This Application Not Found")
    }

    const jobExist = await this.jobRepository.getOne({ _id: appExist.jobId })

    if (!jobExist) {
      throw new NotFoundException("This Job Not Found")
    }

    const companyExist = await this.companyRepository.getOne({ _id: jobExist.companyId })

    if (!companyExist) {
      throw new NotFoundException("This Company Not Found")
    }

    const isHR = companyExist.HRs.some((HYBRID) => HYBRID.toString() === userId.toString())

    if (!isHR) {
      throw new UnauthorizedException("You Cant Do this service")
    }

    if (
      appChangeStatus.status !== APPLICATIONSTATUS.ACCEPTED &&
      appChangeStatus.status !== APPLICATIONSTATUS.REJECTED
    ) {
      throw new BadRequestException(
        'Application status must be accepted or rejected',
      );
    }

    appExist.status = appChangeStatus.status;
    await appExist.save();

    const userExist = await this.userRepository.getOne({ _id: appExist.userId })

    if (!userExist) {
      throw new NotFoundException("This User Not Found")
    }

    const email =
      appChangeStatus.status === APPLICATIONSTATUS.ACCEPTED
        ? ACCEPT_APPLICATION_EMAIL(
          userExist.firstName,
          jobExist.jobTitle,
          companyExist.companyName,
        )
        : REJECT_APPLICATION_EMAIL(
          userExist.firstName,
          jobExist.jobTitle,
          companyExist.companyName,
        );


    await this.mailService.sendMail(
      userExist.email,
      email.subject,
      email.html,
    );





    return {
      message: `Application ${appChangeStatus.status} successfully`,
    };






  }
}