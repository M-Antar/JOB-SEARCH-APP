import { Types } from "mongoose";
import { GENDER, OTP_TYPE, PROVIDER, ROLE } from "src/common/types";

export class Auth {

  firstName!: string;

  lastName!: string;

  email!: string;

  password!: string;

  provider!: PROVIDER;

  gender!: GENDER;

  DOB!: Date;

  mobileNumber!: string;

  role!: ROLE;

  isConfirmed!: boolean;

  deletedAt!: Date;

  bannedAt!: Date;

  updatedBy!: Types.ObjectId;

  changeCredentialTime!: Date;

  profilePic!: { secure_url: string; public_id: string };

  coverPic!: { secure_url: string; public_id: string };

  OTP!: { code: string; type: OTP_TYPE; expiresIn: Date }[];
}