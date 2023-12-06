import { Response } from 'express';
import { RESPONSE_STATUS_CODE } from '../constants/ErrorConstants';
import CourseModel from '../models/Course.model';
import { catchAsyncError } from './../middleware/CatchAsyncErrors';

// create course
export const createCourse = catchAsyncError(async (data: any, res: Response) => {
  const course = await CourseModel.create(data);
  res.status(RESPONSE_STATUS_CODE.CREATED).json({
    success: true,
    course
  });
});

// edit course
