import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyRepository } from 'src/models/company/company.repository';
import { CompanyFactoryService } from './factory';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from 'src/models/company/company.schema';
import { UserRepository } from 'src/models/user/user.repository';
import { User, UserSchema } from 'src/models/user/user.schema';

@Module({
    imports: [
    MongooseModule.forFeature([
      {
        name: Company.name,
        schema: CompanySchema,
      },
      {
        name:User.name,
        schema:UserSchema
      }
    ]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService,CompanyRepository,CompanyFactoryService,UserRepository],
    exports: [
    CompanyService,
    CompanyRepository,
    
  ],
})
export class CompanyModule {}
