import { RESPONSE_STATUS_CODE } from './../constants/ErrorConstants';
import userModel from '../models/User.model';
import { NextFunction, Response } from 'express';
import ErrorClass from '~/utils/ErrorClass';

// get user by id
export const getUserById = async (id: string, res: Response, next: NextFunction) => {
  try {
    const user = await userModel.findById(id);

    if (!user) {
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
