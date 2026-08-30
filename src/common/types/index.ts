import * as crypto from 'crypto';

import { memoryStorage } from 'multer';

export function generateOtp() {
  const plainOtp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHash('sha256').update(plainOtp).digest('hex');
  return { plainOtp, hashedOtp };
}



export  enum ROLE {
  ADMIN = 'admin',
  USER = 'user',
}

export enum OTP_TYPE {
  CONFIRM_EMAIL = 'confirmEmail',
  FORGET_PASSWORD = 'forgetPassword',
}


export enum PROVIDER {
  GOOGLE = 'google',
  SYSTEM = 'system',
}

export enum GENDER {
  MALE = 'Male',
  FEMALE = 'Female',
}




export const multerMemoryOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    const isValidExt = allowedExtensions.test(file.originalname);
    const isValidMime = file.mimetype.startsWith('image/');

    if (!isValidExt && !isValidMime) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
};



