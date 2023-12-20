import { RESPONSE_STATUS_CODE } from '@app/constants/ErrorConstants';
import ErrorClass from '@app/utils/ErrorClass';
import { redis } from '@app/utils/RedisClient';
import { NextFunction, Response } from 'express';

// get user by id
export const getUserById = async (id: string, res: Response, next: NextFunction) => {
  try {
    const userJson = await redis.get(id);
    const user = JSON.parse(userJson || '');
    if (!user || user === '') {
      return next(new ErrorClass('User not found', RESPONSE_STATUS_CODE.NOT_FOUND));
    }
    res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
      success: true,
      user
    });
  } catch (error: any) {
    return next(new ErrorClass(error.message, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
};
