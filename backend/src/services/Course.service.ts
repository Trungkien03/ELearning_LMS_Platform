import { RESPONSE_STATUS_CODE } from '@app/constants/ErrorConstants';
import courseModel from '@app/models/Course.model';
import { Response } from 'express';

// get all users
export const getAllCoursesService = async (res: Response) => {
  const courses = await courseModel.find().sort({ createdAt: -1 });
  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      courses
    }
  });
};
