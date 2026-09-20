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

export enum JOBLOCATION {
  ONSITE = 'onsite',
  REMOTELY = 'remotely',
  HYBRID = 'hybrid',
}

export enum WORKINGTIME{
  PART_TIME="part-time",
  FULL_TIME='full-time'
}

export enum JOBLEVEL {
  FRESH = "fresh",
  JUNIOR = "Junior",
  MID_LEVEL = "Mid-Level",
  SENIOR = "Senior",
  TEAM_LEAD = "Team-Lead",
  CTO = "CTO",
}


export enum APPLICATIONSTATUS {
  PENDING = "pending",
  VIEWED = "viewed",
  IN_CONSIDERATION = "in consideration",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export const multerMemoryOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
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

export const multerCVOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(pdf|doc|docx)$/i;
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const isValidExt = allowedExtensions.test(file.originalname);
    const isValidMime = allowedMimes.includes(file.mimetype);

    if (!isValidExt || !isValidMime) {
      return cb(new Error('Only PDF or Word documents are allowed for CV uploads'), false);
    }
    cb(null, true);
  },
};



