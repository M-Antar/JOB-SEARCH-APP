import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  SignUpDto } from './dto/SignUp-Dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ConfirmOtp } from './dto/confirm-otp-Dto';
import { LogInDto } from './dto/login-Dto';

import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { SendOtpDto } from './dto/send-otp-Dto';
import { ResetPasswordDto } from './dto/resetPassword-Dto';
import { RefreshTokenDto } from './dto/RefreshTokenDto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signUp')
  create(@Body() signUpDto: SignUpDto) {
    return this.authService.create(signUpDto);
  }

  @Post('/confirm-otp')
  confirm(@Body() confirmOtp:ConfirmOtp){
    return this.authService.confirmOtp(confirmOtp)
  }


  @Post('/login')
  logIn(@Body() loginDto:LogInDto){
    return this.authService.logIn(loginDto)
  }


    // Step A: kicks off the Google OAuth flow — redirects user to Google's consent screen
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport handles the redirect — this method body never actually runs
  }

  // Step B: Google redirects back here after the user approves
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req, @Res() res: Response) {

    const result = await this.authService.googleLogin(req.user);

    // Option 1: return JSON directly (good for testing in Postman/browser)
    return res.json(result);

    // Option 2 (common in real apps): redirect to frontend with tokens as query params
    // return res.redirect(
    //   `http://localhost:5173/oauth-success?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`
    // );
  }


  @Post('reset-password-otp')
  sendOtp(@Body() sendOtpDto:SendOtpDto) {
    return  this.authService.sendOtp(sendOtpDto);
  }

  
  @Post('forget-password')
  foorgetPass(@Body() resetPasswordDto:ResetPasswordDto) {
    return  this.authService.updatePassword(resetPasswordDto);
  }


  @Post('refresh')
refresh(@Request() req:Request) {
  return this.authService.refreshToken(req);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
