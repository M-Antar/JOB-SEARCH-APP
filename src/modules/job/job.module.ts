import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { JobController } from './job.controller';
import { JobService } from './job.service';
import { JobFactoryService } from './factory';

import { Job, JobSchema } from 'src/models/job/job.schema';
import { JobRepository } from 'src/models/job/job.repository';

import {
  Company,
  CompanySchema,
} from 'src/models/company/company.schema';
import { CompanyRepository } from 'src/models/company/company.repository';

import {
  Application,
  ApplicationSchema,
} from 'src/models/application/application';
import { ApplicationRepository } from 'src/models/application/application.repository';

import { User, UserSchema } from 'src/models/user/user.schema';
import { UserRepository } from 'src/models/user/user.repository';

import { MailService } from '../mail/mail.service';
import { NotificationsGateway } from 'src/socket';
import { ChatModule } from '../chat/chat.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Job.name,
        schema: JobSchema,
      },
      {
        name: Company.name,
        schema: CompanySchema,
      },
      {
        name: Application.name,
        schema: ApplicationSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),

    JwtModule.register({}),
    ChatModule,
  ],

  controllers: [JobController],

  providers: [
    JobService,
    JobFactoryService,
    JobRepository,
    CompanyRepository,
    ApplicationRepository,
    UserRepository,
    MailService,
    NotificationsGateway,
  ],

  exports: [
    JobService,
    JobRepository,
  ],
})
export class JobModule {}