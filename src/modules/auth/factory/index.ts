import { Auth } from '../entities/auth.entity';
import { SignUpDto } from '../dto/SignUp-Dto';
import { GENDER, PROVIDER, ROLE } from 'src/common/types';

export class AuthFactoryService {
  createUser(signUpDto: SignUpDto): Auth {
    const user = new Auth();

    user.firstName = signUpDto.firstName;
    user.lastName = signUpDto.lastName;
    user.email = signUpDto.email;
    user.password = signUpDto.password; // will be hashed by pre-save hook
    user.mobileNumber = signUpDto.mobileNumber; // will be encrypted by pre-save hook

    user.gender = signUpDto.gender as GENDER;
    user.DOB = new Date(signUpDto.DOB);

    user.provider = PROVIDER.SYSTEM;
    user.role = ROLE.USER;
    user.isConfirmed = false;

    return user;
  }
}