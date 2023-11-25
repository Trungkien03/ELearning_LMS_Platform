import dotenv from 'dotenv';
import { sameSite } from './../types/TokenTypes';
import { ONE_DAY, ONE_HOUR, ONE_THOUSAND } from './../constants/Common';
import { Response } from 'express';
import { IUser } from '../types/UserTypes';
import { redis } from './redis';
import { TOKEN_NAME } from '~/constants/UserConstants';

dotenv.config();
interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: sameSite;
  secure?: boolean;
}

export const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '300', 10);
export const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1200', 10);

// options for cookie
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * ONE_HOUR * ONE_THOUSAND),
  maxAge: accessTokenExpire * ONE_HOUR * ONE_THOUSAND,
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
