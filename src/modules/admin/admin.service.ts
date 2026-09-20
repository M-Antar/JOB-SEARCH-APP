
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserRepository } from 'src/models/user/user.repository';
import { CompanyRepository } from 'src/models/company/company.repository';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}



  async banUser(userID: string) {
    const userExist = await this.userRepository.getOne({
      _id: userID,
    });

    if (!userExist) {
      throw new NotFoundException('User Not Found');
    }

    userExist.bannedAt = new Date();

    await userExist.save();

    return {
      message: 'User banned successfully',
    };
  }

  async unbanUser(userID: string) {
    const userExist = await this.userRepository.getOne({
      _id: userID,
    });

    if (!userExist) {
      throw new NotFoundException('User Not Found');
    }

  await this.userRepository.updateOne({
    _id:userID,
  },{
    $unset:{bannedAt:1}
  })


    return {
      message: 'User unbanned successfully',
    };
  }



  async banCompany(companyID: string) {
    const companyExist = await this.companyRepository.getOne({
      _id: companyID,
    });

    if (!companyExist) {
      throw new NotFoundException('Company Not Found');
    }

    companyExist.bannedAt = new Date();

    await companyExist.save();

    return {
      message: 'Company banned successfully',
    };
  }

  async unbanCompany(companyID: string) {
    const companyExist = await this.companyRepository.getOne({
      _id: companyID,
    });

    if (!companyExist) {
      throw new NotFoundException('Company Not Found');
    }

    await this.companyRepository.updateOne({
      _id:companyID
    },{
      $unset:{bannedAt:1}
    })

    return {
      message: 'Company unbanned successfully',
    };
  }


  async approveCompany(companyID: string) {
    const companyExist = await this.companyRepository.getOne({
      _id: companyID,
    });

    if (!companyExist) {
      throw new NotFoundException('Company Not Found');
    }

    companyExist.approvedByAdmin = true;

    await companyExist.save();

    return {
      message: 'Company approved successfully',
    };
  }
}
