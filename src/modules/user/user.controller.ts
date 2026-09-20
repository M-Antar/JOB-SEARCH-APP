import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { multerMemoryOptions } from 'src/common/types';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  @Get()
  findOne(@Req() req) {
    return this.userService.findOne(req);
  }
@Get('profile')
async getProfile(@Query('id') id: string) {
  return this.userService.getPublicProfile(id);
}

  @Patch()
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req, updateUserDto);
  }


  @Post('profile-pic')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  uploadProfilePic(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadProfilePic(req, file);
  }

  @Post('cover-pic')
  @UseInterceptors(FileInterceptor('file', multerMemoryOptions))
  uploadCoverPic(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.uploadCoverPic(req, file);
  }

  @Delete('profile-pic')
  deleteProfilePic(@Req() req) {
    return this.userService.deleteProfilePic(req);
  }

  @Delete('cover-pic')
  deleteCoverPic(@Req() req) {
    return this.userService.deleteCoverPic(req);
  }

  @Delete()
  softDelete(@Req() req) {
    return this.userService.softDelete(req);
  }

  
}
