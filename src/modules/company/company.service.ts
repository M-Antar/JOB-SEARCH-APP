import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { CompanyRepository } from 'src/models/company/company.repository';

import { UserRepository } from 'src/models/user/user.repository';
import { SearchWithNameDto } from './dto/search-with-name-Dto';


import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class CompanyService {

  constructor(private readonly companyRepository: CompanyRepository,
    private readonly userRepository:UserRepository,
        private readonly configService: ConfigService,
  ) { }

  
  onModuleInit() {
    cloudinary.config({
      cloud_name: this.configService.get<string>(
        'CLOUDINARY_CLOUD_NAME',
      ),
      api_key: this.configService.get<string>(
        'CLOUDINARY_API_KEY',
      ),
      api_secret: this.configService.get<string>(
        'CLOUDINARY_API_SECRET',
      ),
    });
  }

  async create(companyCreated: Company) {
    const companyExist = await this.companyRepository.getOne({
      $or: [
        { companyEmail: companyCreated.companyEmail },
        { companyName: companyCreated.companyName },
      ],
    });

    if (companyExist) {
      return {
        message: 'Company email or company name already exists',
      };
    }
    return await this.companyRepository.create(companyCreated)

  }

    async update(id: string, updateCompanyDto: UpdateCompanyDto, userId: string) {
    const company = await this.companyRepository.getOne({
      _id: id,
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

     if (company.createdBy.toString() !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this company',
      );
    }

        return this.companyRepository.findOneAndUpdate(
      { _id: id },
      updateCompanyDto,
    );

  }

async softDelete(id: string, userId: string) {
  const companyExist = await this.companyRepository.getOne({ _id: id });

  if (!companyExist) {
    throw new NotFoundException('Company Not Exist');
  }

  const user = await this.userRepository.getOne({
    _id: userId,
  });

  if (!user) {
    throw new NotFoundException('User does not exist');
  }

  const isOwner =
    companyExist.createdBy.toString() === userId;

  const isAdmin = user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new ForbiddenException(
      'Only the company owner or admin can delete this company',
    );
  }

  const deletedCompany =
    await this.companyRepository.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          deletedAt: new Date(),
        },
      },
    );

  console.log('DELETED COMPANY:', deletedCompany);

  return deletedCompany;
} 

async findWithName(searchWithNameDto:SearchWithNameDto){
  const companyExist = await this.companyRepository.getOne({ companyName: searchWithNameDto.companyName });

  if (!companyExist) {
    throw new NotFoundException('Company Not Exist');
  }

  return companyExist
}




  // =========================
  // Upload to Cloudinary
  // =========================

  private uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{
    secure_url: string;
    public_id: string;
  }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              error || new Error('Cloudinary upload failed'),
            );
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  // =========================
  // Check owner/admin
  // =========================

  private async checkCompanyPermission(
    companyId: string,
    userId: string,
  ) {
    const company = await this.companyRepository.getOne({
      _id: companyId,
    });

    if (!company) {
      throw new NotFoundException('Company Not Exist');
    }

    const user = await this.userRepository.getOne({
      _id: userId,
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isOwner =
      company.createdBy.toString() === userId;

    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Only the company owner or admin can perform this action',
      );
    }

    return company;
  }

  // =========================
  // 1. Upload Company Logo
  // =========================

  async uploadCompanyLogo(
    companyId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Company logo is required',
      );
    }

    const company = await this.checkCompanyPermission(
      companyId,
      userId,
    );

    // Delete old logo from Cloudinary
    if (company.logo?.public_id) {
      await cloudinary.uploader.destroy(
        company.logo.public_id,
      );
    }

    // Upload new logo
    const uploaded = await this.uploadToCloudinary(
      file,
      'company-logos',
    );

    // Save logo in MongoDB
    const updatedCompany =
      await this.companyRepository.findOneAndUpdate(
        { _id: companyId },
        {
          $set: {
            logo: uploaded,
          },
        },
      );

    return {
      message: 'Company logo uploaded successfully',
      data: updatedCompany,
    };
  }

  // =========================
  // 2. Upload Company Cover
  // =========================

  async uploadCompanyCoverPic(
    companyId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Company cover picture is required',
      );
    }

    const company = await this.checkCompanyPermission(
      companyId,
      userId,
    );

    // Delete old cover from Cloudinary
    if (company.coverPic?.public_id) {
      await cloudinary.uploader.destroy(
        company.coverPic.public_id,
      );
    }

    // Upload new cover
    const uploaded = await this.uploadToCloudinary(
      file,
      'company-cover-pics',
    );

    // Save cover in MongoDB
    const updatedCompany =
      await this.companyRepository.findOneAndUpdate(
        { _id: companyId },
        {
          $set: {
            coverPic: uploaded,
          },
        },
      );

    return {
      message: 'Company cover picture uploaded successfully',
      data: updatedCompany,
    };
  }

  // =========================
  // 3. Delete Company Logo
  // =========================

  async deleteCompanyLogo(
    companyId: string,
    userId: string,
  ) {
    const company = await this.checkCompanyPermission(
      companyId,
      userId,
    );

    if (!company.logo?.public_id) {
      throw new NotFoundException(
        'Company logo does not exist',
      );
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(
      company.logo.public_id,
    );

    // Remove from MongoDB
    const updatedCompany =
      await this.companyRepository.findOneAndUpdate(
        { _id: companyId },
        {
          $unset: {
            logo: 1,
          },
        },
      );

    return {
      message: 'Company logo deleted successfully',
      data: updatedCompany,
    };
  }

  // =========================
  // 4. Delete Company Cover
  // =========================

  async deleteCompanyCoverPic(
    companyId: string,
    userId: string,
  ) {
    const company = await this.checkCompanyPermission(
      companyId,
      userId,
    );

    if (!company.coverPic?.public_id) {
      throw new NotFoundException(
        'Company cover picture does not exist',
      );
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(
      company.coverPic.public_id,
    );

    // Remove from MongoDB
    const updatedCompany =
      await this.companyRepository.findOneAndUpdate(
        { _id: companyId },
        {
          $unset: {
            coverPic: 1,
          },
        },
      );

    return {
      message: 'Company cover picture deleted successfully',
      data: updatedCompany,
    };
  }


  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }


  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
