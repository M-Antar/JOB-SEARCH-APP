import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from 'src/models/user/user.repository'; // adjust path to match yours

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    console.log('JWT SECRET EXISTS:', !!process.env.JWT_ACCESS_SECRET);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET!,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.getOne({ _id: payload.sub });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return {
      sub: user._id,
      email: user.email,
      role: user.role,
    };
  }
}