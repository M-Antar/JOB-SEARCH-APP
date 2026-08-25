import * as crypto from 'crypto';

export function generateOtp() {
  const plainOtp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = crypto.createHash('sha256').update(plainOtp).digest('hex');
  return { plainOtp, hashedOtp };
}