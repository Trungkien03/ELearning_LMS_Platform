import { NINE_THOUSAND, ONE_DAY, ONE_HOUR, ONE_THOUSAND } from '@app/constants/Common.constants';
import { TOKEN_NAME } from '@app/constants/User.constants';
import { sameSite } from '@app/types/Token.types';
import { IUser } from '@app/types/User.types';
import dotenv from 'dotenv';
import { Response } from 'express';
import Jwt, { Secret } from 'jsonwebtoken';
import { redis } from './RedisClient';

dotenv.config();
interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: sameSite;
  secure?: boolean;
}
export const generateActivationCode = () => Math.floor(ONE_THOUSAND + Math.random() * NINE_THOUSAND).toString();
export const signJwtToken = (data: any, secret: Secret, expiresIn: string) => Jwt.sign(data, secret, { expiresIn });

export const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '600', 10);
export const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);

// options for cookie
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * ONE_HOUR * ONE_THOUSAND),
  maxAge: accessTokenExpire * ONE_HOUR * ONE_HOUR * ONE_THOUSAND,
  httpOnly: true,
  sameSite: 'lax'
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * ONE_DAY * ONE_HOUR * ONE_THOUSAND),
  maxAge: refreshTokenExpire * ONE_DAY * ONE_HOUR * ONE_THOUSAND,
  httpOnly: true,
  sameSite: 'lax'
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  // upload session to redis
  redis.set(user._id, JSON.stringify(user));
  // parse environment variables to integrates with fallback values

  // only set secure to true in production
  if (process.env.NODE_ENV === 'production') {
    accessTokenOptions.secure = true;
  }
  res.cookie(TOKEN_NAME.ACCESS, accessToken, accessTokenOptions);
  res.cookie(TOKEN_NAME.REFRESH, refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken
  });
};
