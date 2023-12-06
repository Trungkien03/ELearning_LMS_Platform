import { RESPONSE_STATUS_CODE } from '@app/constants/ErrorConstants';
import { catchAsyncError } from '@app/middleware/CatchAsyncErrors';
import courseModel from '@app/models/Course.model';
import { IRequest } from '@app/types/UserTypes';
import ErrorClass from '@app/utils/ErrorClass';
import { destroyThumbnail, handleImageUpload } from '@app/utils/HandleCloudinary';
import { redis } from '@app/utils/RedisClient';
import { NextFunction, Request, Response } from 'express';

// upload course
export const uploadCourse = catchAsyncError(async (req: Request, res: Response) => {
  const data = req.body;
  const thumbnail = data.thumbnail;
  const options = { folder: 'Course' };

  if (thumbnail) {
    const newThumbnail = await handleImageUpload(thumbnail.url, options);
    data.thumbnail = newThumbnail;

    const course = await courseModel.create(data);
    res.status(RESPONSE_STATUS_CODE.CREATED).json({
      success: true,
      data: {
        course
      }
    });
  }
});

// edit course
export const editCourse = catchAsyncError(async (req: Request, res: Response) => {
  const data = req.body;
  const thumbnail = data.thumbnail;
  const options = { folder: 'Course' };
  const courseSingle = await courseModel.findById(req.params.id);
  const oldImage = courseSingle?.thumbnail.publicId || '';

  if (thumbnail) {
    await destroyThumbnail(oldImage);
    const newThumbnail = await handleImageUpload(thumbnail.url, options);
    data.thumbnail = newThumbnail;

    const courseId = req.params.id; // Extract courseId from request parameters
    const course = await courseModel.findByIdAndUpdate(courseId, { $set: data }, { new: true });
    res.status(RESPONSE_STATUS_CODE.CREATED).json({
      success: true,
      data: {
        course
      }
    });
  }
});

// get single course --- without purchasing
export const getSingleCourse = catchAsyncError(async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const query = '-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links';
  let course;

  const cacheExist = await redis.get(courseId);
  if (cacheExist) {
    course = JSON.parse(cacheExist);
  } else {
    course = await courseModel.findById(courseId).select(query);
    redis.set(courseId, JSON.stringify(course));
  }

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      course
    }
  });
});

// get all course --- without purchasing
export const getAllCourses = catchAsyncError(async (req: Request, res: Response) => {
  const query = '-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links';
  const allCourse = await courseModel.find().select(query);

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      totalItems: allCourse.length,
      courses: allCourse
    }
  });
});

// get course content -- only for valid user
export const getCourseByUser = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const userCourseList = req.user?.courses;
  const courseId = req.params.id;

  const courseExist = userCourseList?.find((course) => course.courseId === courseId);

  if (!courseExist) {
    next(new ErrorClass('You are not eligible to access this course', RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const course = await courseModel.findById(courseId);
  const data = course?.courseData;

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data
  });
});
