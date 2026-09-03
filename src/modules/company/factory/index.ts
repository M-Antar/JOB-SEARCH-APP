import { Types } from 'mongoose';

import { CreateCompanyDto } from '../dto/create-company.dto';
import { Company } from '../entities/company.entity';

export class CompanyFactoryService {
  createCompany(
    createCompanyDto: CreateCompanyDto,
    createdBy: Types.ObjectId,
  ) {
    const company = new Company();

    company.companyName = createCompanyDto.companyName;
    company.description = createCompanyDto.description;
    company.industry = createCompanyDto.industry;
    company.address = createCompanyDto.address;
    company.numberOfEmployees = createCompanyDto.numberOfEmployees;
    company.companyEmail = createCompanyDto.companyEmail;

    company.createdBy = createdBy;
    company.HRs = [];
    company.approvedByAdmin = false;

    return company;
  }
}