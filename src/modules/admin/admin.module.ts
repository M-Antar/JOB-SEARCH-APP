import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [UserModule, CompanyModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}