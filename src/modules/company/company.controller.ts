import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyFactoryService } from './factory';
import { SearchWithNameDto } from './dto/search-with-name-Dto';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyFactoryService: CompanyFactoryService,
  ) {}

@Post()
@UseGuards(AuthGuard('jwt'))
async create(
  @Body() createCompanyDto: CreateCompanyDto,
  @Req() req: any,
) {
  console.log('USER FROM JWT:', req.user);

  const createdCompany =
    this.companyFactoryService.createCompany(
      createCompanyDto,
      req.user.sub,
    );

  const savedCompany =
    await this.companyService.create(createdCompany);

  return {
    message: 'Company created successfully',
    savedCompany,
  };
}

 @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: any,
  ) {
    return this.companyService.update(
      id,
      updateCompanyDto,
      req.user.sub,
    );
  }

   @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async softDelete(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.companyService.softDelete(
      id,
      req.user.sub,
    );
  }

  
  @Get()
@UseGuards(AuthGuard('jwt'))
  async findWithName(@Body() searchWithNameDto:SearchWithNameDto) {
    return await this.companyService.findWithName(searchWithNameDto);
  }

  @Post(':id/logo')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(FileInterceptor('file'))
async uploadCompanyLogo(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Req() req: any,
) {
  return this.companyService.uploadCompanyLogo(
    id,
    req.user.sub,
    file,
  );
}

@Post(':id/cover-pic')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(FileInterceptor('file'))
async uploadCompanyCoverPic(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Req() req: any,
) {
  return this.companyService.uploadCompanyCoverPic(
    id,
    req.user.sub,
    file,
  );
}

@Delete(':id/logo')
@UseGuards(AuthGuard('jwt'))
async deleteCompanyLogo(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.companyService.deleteCompanyLogo(
    id,
    req.user.sub,
  );
}

@Delete(':id/cover-pic')
@UseGuards(AuthGuard('jwt'))
async deleteCompanyCoverPic(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.companyService.deleteCompanyCoverPic(
    id,
    req.user.sub,
  );
}

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.companyService.findOne(id);
  // }

  // @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateCompanyDto: UpdateCompanyDto,
  // ) {
  //   return this.companyService.update(id, updateCompanyDto);
  // }

  // @Delete(':id')
  // @UseGuards(AuthGuard('jwt'))
  // async remove(@Param('id') id: string) {
  //   return this.companyService.remove(id);
  // }
}