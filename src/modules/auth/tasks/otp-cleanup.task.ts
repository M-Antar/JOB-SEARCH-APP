import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/models/user/user.schema';

@Injectable()
export class OtpCleanupTask {
  private readonly logger = new Logger(OtpCleanupTask.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  async handleExpiredOtpCleanup() {
    const now = new Date();

    const result = await this.userModel.updateMany(
      { 'OTP.expiresIn': { $lt: now } },
      { $pull: { OTP: { expiresIn: { $lt: now } } } },
    );

    this.logger.log(
      `OTP cleanup ran: removed expired OTPs from ${result.modifiedCount} user(s)`,
    );
  }
}