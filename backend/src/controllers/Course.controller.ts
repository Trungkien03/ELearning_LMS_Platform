import cloudinary from 'cloudinary';
import { NextFunction, Request, Response } from 'express';
import { createCourse } from '../services/CourseService';
import { catchAsyncError } from './../middleware/CatchAsyncErrors';
import courseModel from '~/models/Course.model';
import { RESPONSE_STATUS_CODE } from '~/constants/ErrorConstants';

// upload course
export const uploadCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  const thumbnail = data.thumbnail;

  if (thumbnail) {
    const myCloud = await cloudinary.v2.uploader.upload(thumbnail.url, {
      folder: 'Course'
    });

    data.thumbnail = {
      publicId: myCloud.public_id,
      url: myCloud.secure_url
    };

    createCourse(data, res, next);
  }
});

// edit course
export const editCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  const thumbnail = data.thumbnail;

  if (thumbnail) {
    await cloudinary.v2.uploader.destroy(thumbnail.publicId);

    const myCloud = await cloudinary.v2.uploader.upload(thumbnail.url, {
      folder: 'Course'
    });

    data.thumbnail = {
      publicId: myCloud.public_id,
      url: myCloud.secure_url
    };
  }

  const courseId = req.params.id;
  const course = await courseModel.findByIdAndUpdate(courseId, { $set: data }, { new: true });

  res.status(RESPONSE_STATUS_CODE.CREATED).json({
    success: true,
    course
  });
});
