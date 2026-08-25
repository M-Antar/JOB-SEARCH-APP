import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { GENDER, OTP_TYPE, PROVIDER, ROLE } from "src/common/types";

@Schema({ timestamps: true })
export class User {
  readonly _id!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  firstName!: string;

  @Prop({ type: String, required: true, trim: true })
  lastName!: string;

  @Prop({ type: String, required: true, unique: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ type: String, required: true, trim: true })
  password!: string;

  @Prop({ type: String, enum: PROVIDER, default: PROVIDER.SYSTEM })
  provider!: PROVIDER;

  @Prop({ type: String, enum: GENDER, required: true })
  gender!: GENDER;

  @Prop({ type: Date, required: true })
  DOB!: Date;

  @Prop({ type: String, required: true })
  mobileNumber!: string;

  @Prop({ type: String, enum: ROLE, required: true, trim: true })
  role!: ROLE;

  @Prop({ type: Boolean })
  isConfirmed!: boolean;

  @Prop({ type: Date })
  deletedAt!: Date;

  @Prop({ type: Date })
  bannedAt!: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  updatedBy!: Types.ObjectId;

  @Prop({ type: Date })
  changeCredentialTime!: Date;

  @Prop({ type: { secure_url: String, public_id: String } })
  profilePic!: { secure_url: string; public_id: string };

  @Prop({ type: { secure_url: String, public_id: String } })
  coverPic!: { secure_url: string; public_id: string };

  @Prop({
    type: [
      {
        code: { type: String },
        type: { type: String, enum: OTP_TYPE },
        expiresIn: { type: Date },
      },
    ],
    default: [],
  })
  OTP!: { code: string; type: OTP_TYPE; expiresIn: Date }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

const IV_LENGTH = 16;

// ✅ reads process.env at CALL time, not at import/module-load time
function encrypt(text: string): string {
  const encryptionKey = process.env.MOBILE_ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error('MOBILE_ENCRYPTION_KEY is not set in environment variables');
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'hex'),
    iv,
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isModified('mobileNumber')) {
    this.mobileNumber = encrypt(this.mobileNumber);
  }
});

UserSchema.virtual('username').get(function (this: User) {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });