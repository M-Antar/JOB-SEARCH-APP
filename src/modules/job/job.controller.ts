import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { FindJobsDto } from './dto/find-jobs.dto';
import { AuthGuard } from '@nestjs/passport';
import { JobFactoryService } from './factory';
import { FindApplicationsDto } from './dto/find-applications.dto';
import { Roles, ROLES } from 'src/common/decorators/roles.decorator';
import { multerCVOptions, multerMemoryOptions, ROLE } from 'src/common/types';
import { RolesGuard } from 'src/gurads/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppChangeStatus } from './dto/apllication-statues.dto';

@Controller('job')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly JobFactoryService: JobFactoryService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createJobDto: CreateJobDto, @Req() req: any) {
    const createdJob = this.JobFactoryService.createJob(createJobDto, req.user.sub);
    return this.jobService.create(createdJob);
  }

  @Get()
  findAll(@Query() query: FindJobsDto) {
    return this.jobService.findAll(query);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Req() req: any) {
    return this.jobService.update(id, updateJobDto, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: any) {
    return this.jobService.remove(id, req.user.sub);
  }

  @Get(':id/applications')
@UseGuards(AuthGuard('jwt'))
getApplications(
  @Param('id') id: string,
  @Query() query: FindApplicationsDto,
  @Req() req: any,
) {
  return this.jobService.getApplicationsForJob(id, query, req.user.sub);
}
 

@Post(':id/apply')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles([ROLE.USER])
@UseInterceptors(FileInterceptor('cv', multerCVOptions))  // <-- swap here too
applyToJob(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Req() req: any,
) {
  return this.jobService.applyToJob(id, req.user.sub, file);
}


@Post('/status')
@UseGuards(AuthGuard('jwt'))
changeStatusApplication( @Req() req: any,@Body() appChangeStatus:AppChangeStatus){
  return this.jobService.changeStatusApplication(req.user.sub,appChangeStatus)
}



}