import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    family: 4,
  });

  constructor() {
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '[SET]' : '[MISSING]');
  }

  /**
   * Sends the PLAIN otp to the user's email. Never pass the hash here.
   */
  async sendOtpEmail(to: string, otp: string, expiryMinutes = 10) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Verify your email',
      text: `Your verification code is ${otp}. It expires in ${expiryMinutes} minutes.`,
      html: `<p>Your verification code is <b>${otp}</b>. It expires in ${expiryMinutes} minutes.</p>`,
    });
  }
}