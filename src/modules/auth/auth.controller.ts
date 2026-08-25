import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  SignUpDto } from './dto/SignUp-Dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ConfirmOtp } from './dto/confirm-otp-Dto';
import { LogInDto } from './dto/login-Dto';

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


  @Post()
  logIn(@Body() loginDto:LogInDto){
    return this.authService.logIn(loginDto)
  }


  @Get()
  findAll() {
    return this.authService.findAll();
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
