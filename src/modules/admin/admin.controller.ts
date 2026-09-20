
import {
  Controller,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { AdminService } from './admin.service';
import { RolesGuard } from 'src/gurads/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ROLE } from 'src/common/types';

@Controller('admin')
@UseGuards(AuthGuard('jwt'),RolesGuard)
@Roles([ROLE.ADMIN])

export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Patch('user/:id/ban')
  banUser(@Param('id') id: string) {
    return this.adminService.banUser(id);
  }

  @Patch('user/:id/unban')
  unbanUser(@Param('id') id: string) {
    return this.adminService.unbanUser(id);
  }


  @Patch('company/:id/ban')
  banCompany(@Param('id') id: string) {
    return this.adminService.banCompany(id);
  }


  @Patch('company/:id/unban')
  unbanCompany(@Param('id') id: string) {
    return this.adminService.unbanCompany(id);
  }

 
  @Patch('company/:id/approve')
  approveCompany(@Param('id') id: string) {
    return this.adminService.approveCompany(id);
  }
}
