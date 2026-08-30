import { Injectable, NotFoundException, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/models/user/user.repository';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  
  onModuleInit() {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }
private async getUserFromToken(req: Request) {
  const token = req.headers['accesstoken'] as string;
  if (!token) {
    throw new UnauthorizedException('Access token is required');
  }

  try {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });

    const userExist = await this.userRepository.getOne({ email: payload.email });
    if (!userExist) {
      throw new NotFoundException('User Not Found');
    }

    return userExist;
  } catch (error) {
    if (error?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token has expired');
    }
    throw new UnauthorizedException('Invalid token');
  }
}

  private uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        },
      );
      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
async uploadProfilePic(req: Request, file: Express.Multer.File) {
  const userExist = await this.getUserFromToken(req);

  if (userExist.profilePic?.public_id) {
    await cloudinary.uploader.destroy(userExist.profilePic.public_id);
  }

  const uploaded = await this.uploadToCloudinary(file, 'profile-pics');

  await this.userRepository.findOneAndUpdate(
    { _id: userExist._id },
    { $set: { profilePic: uploaded } },
  );

  return { message: 'Profile picture uploaded successfully', data: uploaded };
}

async uploadCoverPic(req: Request, file: Express.Multer.File) {
  const userExist = await this.getUserFromToken(req);

  if (userExist.coverPic?.public_id) {
    await cloudinary.uploader.destroy(userExist.coverPic.public_id);
  }

  const uploaded = await this.uploadToCloudinary(file, 'cover-pics');

  await this.userRepository.findOneAndUpdate(
    { _id: userExist._id },
    { $set: { coverPic: uploaded } },
  );

  return { message: 'Cover picture uploaded successfully', data: uploaded };
}
  async deleteProfilePic(req: Request) {
    const userExist = await this.getUserFromToken(req);

    if (userExist.profilePic?.public_id) {
      await cloudinary.uploader.destroy(userExist.profilePic.public_id);
    }
    userExist.profilePic = undefined;
    await userExist.save();

    return { message: 'Profile picture deleted successfully' };
  }

  async deleteCoverPic(req: Request) {
    const userExist = await this.getUserFromToken(req);

    if (userExist.coverPic?.public_id) {
      await cloudinary.uploader.destroy(userExist.coverPic.public_id);
    }
    userExist.coverPic = undefined;
    await userExist.save();

    return { message: 'Cover picture deleted successfully' };
  }

  async findOne(req: Request) {
    const userExist = await this.getUserFromToken(req);

    return {
      message: 'User data retrieved successfully',
      data: userExist,
    };
  }

  async update(req: Request, updateUserDto: UpdateUserDto) {
    const userExist = await this.getUserFromToken(req);

    userExist.firstName = updateUserDto.firstName ?? userExist.firstName;
    userExist.lastName = updateUserDto.lastName ?? userExist.lastName;
    userExist.DOB = updateUserDto.DOB ? new Date(updateUserDto.DOB) : userExist.DOB;
    userExist.gender = updateUserDto.gender ?? userExist.gender;
    userExist.mobileNumber = updateUserDto.mobileNumber ?? userExist.mobileNumber;

    await userExist.save();

    return {
      message: 'Account updated successfully',
      data: userExist,
    };
  }

  async getPublicProfile(id: string) {
    const userExist = await this.userRepository.getOne({ _id: id });

    if (!userExist) {
      throw new NotFoundException('User Not Found');
    }

    return {
      userName: userExist.username,
      mobileNumber: userExist.mobileNumber,
      profilePic: userExist.profilePic,
      coverPic: userExist.coverPic,
    };
  }


  async   softDelete(req:Request){
    const userExist = await this.getUserFromToken(req);
    
  await this.userRepository.findOneAndUpdate(
    { _id: userExist._id },
    { $set: { deletedAt: new Date() } },
  );
  return { message: 'Account soft-deleted successfully' };
  }

  

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}