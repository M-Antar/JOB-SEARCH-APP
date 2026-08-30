import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/SignUp-Dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserRepository } from 'src/models/user/user.repository';
import { AuthFactoryService } from './factory';
import { MailService } from '../mail/mail.service';
import { generateOtp } from 'src/common/types';
import { ConfirmOtp } from './dto/confirm-otp-Dto';
import { OTP_TYPE, PROVIDER ,ROLE,GENDER} from 'src/common/types';
import * as crypto from 'crypto';
import { LogInDto } from './dto/login-Dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SendOtpDto } from './dto/send-otp-Dto';
import { ResetPasswordDto } from './dto/resetPassword-Dto';
import { RefreshTokenDto } from './dto/RefreshTokenDto';




@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly authFactoryService: AuthFactoryService,
    private readonly jwtService: JwtService,
  ) {

  }
  async create(createAuthDto: SignUpDto) {
    const userExist = await this.userRepository.getOne({ email: createAuthDto.email })
    if (userExist) {
      throw new ConflictException("User Already Exist")
    }

    const { user, plainOtp } = this.authFactoryService.createUser(createAuthDto);

    const savedUser = await this.userRepository.create(user); // repository handles Mongoose persistence

    await this.mailService.sendOtpEmail(savedUser.email, plainOtp);

    return {
      message: 'User created. Please verify your email.',
      email: savedUser.email,
    };
  }


  async confirmOtp(confirmOtp: ConfirmOtp) {
    const userExist = await this.userRepository.getOne({ email: confirmOtp.email })

    if (!userExist) {
      throw new NotFoundException("User Not Exist")
    }

    if (userExist.isConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    const otpEntry = userExist.OTP.find((o) => o.type === OTP_TYPE.CONFIRM_EMAIL);

    if (!otpEntry) {
      throw new BadRequestException('No OTP found, please request a new one');
    }

    const { code, expiresIn } = otpEntry; // ✅ destructure immediately — TS narrows cleanly here

    if (new Date() > new Date(expiresIn)) {
      throw new BadRequestException('OTP expired, please request a new one');
    }

    const incomingHash = crypto.createHash('sha256').update(confirmOtp.otp).digest('hex');

    if (incomingHash !== code) {
      throw new BadRequestException('Invalid OTP');
    }

    
    userExist.isConfirmed = true;
    userExist.OTP = userExist.OTP.filter((o) => o.type !== OTP_TYPE.CONFIRM_EMAIL);

    await userExist.save(); 

    return {
      message: 'Email confirmed successfully',
      email: userExist.email,
    };



  }

  async logIn(loginDto:LogInDto){
   const userExist = await this.userRepository.getOne({ email: loginDto.email });

    if (!userExist) {
      throw new UnauthorizedException('Invalid credentials');
    }

      if (userExist.provider !== PROVIDER.SYSTEM) {
      throw new ForbiddenException(`Please sign in using ${userExist.provider}`);
    }
    
    const passwordMatch = await bcrypt.compare(loginDto.password, userExist.password);

      if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: userExist._id, email: userExist.email };

      const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1h',
    });

        const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    
    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
    };

  }

  async googleLogin(googleUser: { email: string; firstName: string; lastName: string }) {
  let user = await this.userRepository.getOne({ email: googleUser.email });

  if (!user) {
    // First-time Google sign-up 
    user = await this.userRepository.create({
      email: googleUser.email,
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
      provider: PROVIDER.GOOGLE,
      isConfirmed: true, // Google already verified their email
      password: crypto.randomBytes(16).toString('hex'), // placeholder, unused for OAuth accounts
      role: ROLE.USER,
    });
  } else if (user.provider !== PROVIDER.GOOGLE) {
    throw new ConflictException(
      `This email is already registered with ${user.provider}. Please use that method to log in.`,
    );
  }

  const payload = { sub: user._id, email: user.email };

  const accessToken = await this.jwtService.signAsync(payload, {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '1h',
  });

  const refreshToken = await this.jwtService.signAsync(payload, {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
  });

  return { message: 'Google login successful', accessToken, refreshToken };
}


async sendOtp(sendOtpDto:SendOtpDto){

  const userExist = await this.userRepository.getOne({email:sendOtpDto.email})
  if(!userExist ){
    throw new NotFoundException("User Not Found")
  }

  const { plainOtp, hashedOtp } = generateOtp();
 userExist.OTP=[
  {
    code:hashedOtp,
    type:OTP_TYPE.FORGET_PASSWORD,
    expiresIn: new Date(Date.now() + 5 * 60 * 1000),
  }
 ];

 await userExist.save();

 return  {
      message: 'Your Otp Is ',
      otp:plainOtp
    };




}


async updatePassword(resetPassword:ResetPasswordDto){
  const userExist = await this.userRepository.getOne({email:resetPassword.email})
  if(!userExist ){
    throw new NotFoundException("User Not Found")
  }

 const userOtp = userExist.OTP.find((o)=>(o.type===OTP_TYPE.FORGET_PASSWORD))

 if(!userOtp){
  throw new NotFoundException("User doesnt have otp")
 }

 if(Date.now()>userOtp.expiresIn.getTime()){
   throw new BadRequestException('OTP has expired');
 }

 userExist.password = resetPassword.newPassword;
 //hook will apply

await userExist.save();

 return  {
      message: "Credential update successfully",
    };

}

async refreshToken(req:Request){
    const refreshToken = req.headers['refreshtoken'] as string; 

    if (!refreshToken) {
  throw new UnauthorizedException('Refresh token is required');
}
    
 const payload = await this.jwtService.verifyAsync(refreshToken,{
  secret:process.env.JWT_REFRESH_SECRET
 })

   const userExist = await this.userRepository.getOne({email:payload.email});

  if (!userExist) {
    throw new UnauthorizedException('User not found');
  }

  if (
    userExist.changeCredentialTime &&
    payload.iat * 1000 < userExist.changeCredentialTime.getTime()
  ) {
    throw new UnauthorizedException('Refresh token is no longer valid');
  }

  const accessToken = await this.jwtService.signAsync(
    {
      email: userExist.email,
      sub: userExist._id,
    },
    {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    },
  );

    return {
    accessToken,
  };

}



  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
