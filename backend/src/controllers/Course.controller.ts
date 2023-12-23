/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EMAIL_SUBJECT,
  FOLDER_CLOUDINARY,
  MAIL_FILES,
  MESSAGE,
  NOTIFICATION_TITLE,
  RESPONSE_MESSAGE
} from '@app/constants/Common.constants';
import { RESPONSE_STATUS_CODE } from '@app/constants/Error.constants';
import { catchAsyncError } from '@app/middleware/CatchAsyncErrors';
import courseModel from '@app/models/Course.model';
import notificationModel from '@app/models/Notification.model';
import userModel from '@app/models/User.model';
import { getAllCoursesService } from '@app/services/Course.service';
import {
  IAddAnswerData,
  IAddQuestionData,
  IAddReplyReview,
  IAddReviewData,
  IComment,
  IReview
} from '@app/types/Course.types';
import { IRequest, IUser } from '@app/types/User.types';
import ErrorClass from '@app/utils/ErrorClass';
import { destroyThumbnail, handleImageUpload } from '@app/utils/HandleCloudinary';
import { redis } from '@app/utils/RedisClient';
import sendMail from '@app/utils/SendMail';
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

export const isValidObjectId = (id: string) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// upload course
export const uploadCourse = catchAsyncError(async (req: Request, res: Response) => {
  const data = req.body;
  const thumbnail = data.thumbnail;
  const options = { folder: FOLDER_CLOUDINARY.COURSE };

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
  const options = { folder: FOLDER_CLOUDINARY.COURSE };
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

// GET COURSE CONTENT -- ONLY FOR VALID USER
export const getCourseByUser = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  // const userCourseList = req.user?.courses;
  const userId = req.user?._id;
  const courseId = req.params.id;
  const user = await userModel.findById(userId).populate('courses'); // This will populate the courses array with Course documents

  const course = user?.courses.find((course) => course._id.toString() === courseId);
  if (!course) {
    return next(new ErrorClass(MESSAGE.NOT_VALID_ACCESS_COURSE, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: course
  });
});

// ADD QUESTION IN COURSE
export const addQuestion = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const { contentId, courseId, question } = req.body as IAddQuestionData;
  const course = await courseModel.findById(courseId);

  if (!isValidObjectId(contentId)) {
    return next(new ErrorClass(MESSAGE.INVALID_CONTENT_ID, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const courseContent = course?.courseData.find((item) => item._id.toString() === contentId);

  if (!courseContent) {
    return next(new ErrorClass(MESSAGE.INVALID_CONTENT_ID, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  //create new question
  const newQuestion: IComment = {
    user: req.user || ({} as IUser),
    comment: question,
    commentReplies: []
  };

  // add this question to our course content
  courseContent.questions.push(newQuestion);

  // send notification
  const newNotification = {
    userId: req.user?._id || '',
    title: NOTIFICATION_TITLE.QUESTION,
    message: `You have a new question from ${courseContent.title}`
  };
  await notificationModel.create(newNotification);

  // save the updated course
  await course?.save();

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    course
  });
});

// ADD ANSWER QUESTION
export const addAnswer = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { answer, contentId, courseId, questionId } = req.body as IAddAnswerData;
    const course = await courseModel.findById(courseId);
    if (!isValidObjectId(contentId)) {
      return next(new ErrorClass(MESSAGE.INVALID_CONTENT_ID, RESPONSE_STATUS_CODE.BAD_REQUEST));
    }
    const courseContent = course?.courseData.find((item) => item._id.equals(contentId));
    if (!courseContent) {
      return next(new ErrorClass(MESSAGE.INVALID_CONTENT_ID, RESPONSE_STATUS_CODE.BAD_REQUEST));
    }
    const question = courseContent.questions.find((item: any) => item._id.equals(questionId));
    if (!question) {
      return next(new ErrorClass(MESSAGE.INVALID_QUESTION_ID, RESPONSE_STATUS_CODE.BAD_REQUEST));
    }
    //create a new answer object
    const newAnswer: any = {
      user: req.user,
      answer
    };

    //add this answer to our course content
    question.commentReplies?.push(newAnswer);
    await course?.save();

    if (req.user?._id === question.user._id.toString()) {
      // create a notification
      const newNotification = {
        userId: req.user?._id || '',
        title: NOTIFICATION_TITLE.REPLY,
        message: `You have a new question reply in ${courseContent.title}`
      };
      await notificationModel.create(newNotification);
    } else {
      const data = {
        name: question.user.name,
        title: courseContent.title
      };
      const emailOptions = {
        email: question.user.email,
        subject: EMAIL_SUBJECT.REPLY,
        template: MAIL_FILES.REPLY,
        data
      };
      await sendMail(emailOptions);
    }
    res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
      success: true,
      data: {
        course
      }
    });
  } catch (error) {
    return next(new ErrorClass((error as Error).message, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
});

// add review in course
export const addReview = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const userCourseList = req.user?.courses;
  const courseId = req.params.id;
  const { review, rating } = req.body as IAddReviewData;
  let avg = 0;

  const reviewData: IReview = {
    user: req.user ?? ({} as IUser),
    comment: review,
    rating,
    commentReplies: []
  };

  // check if courseId already exists in userCourseList based on _id
  const courseExists = userCourseList?.some((course) => course.toString() === courseId.toString());

  if (!courseExists) {
    return next(new ErrorClass(MESSAGE.NOT_VALID_ACCESS_COURSE, RESPONSE_STATUS_CODE.NOT_FOUND));
  }

  const course = await courseModel.findById(courseId);
  if (!course) {
    return next(new ErrorClass(MESSAGE.NOT_FOUND_COURSE, RESPONSE_STATUS_CODE.NOT_FOUND));
  }

  course?.reviews.push(reviewData);
  course?.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  course.ratings = avg / course.reviews.length; // example we have 2 reviews one is 5 another is 4: 5 + 4 = 9  ==> 9 / 2 == 4.5

  await course?.save();

  // create notification
  const notification = {
    userId: req.user?._id || '',
    title: NOTIFICATION_TITLE.REVIEW,
    message: `${req.user?.name} has given a review in ${course.name}`
  };
  await notificationModel.create(notification);

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      course
    }
  });
});

// add reply to review
export const addReplyToReview = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const { comment, courseId, reviewId } = req.body as IAddReplyReview;
  const course = await courseModel.findById(courseId);
  if (!course) {
    return next(new ErrorClass(MESSAGE.NOT_FOUND_COURSE, RESPONSE_STATUS_CODE.NOT_FOUND));
  }

  const review = course.reviews.find((rev: any) => rev._id.toString() === reviewId.toString());
  if (!review) {
    return next(new ErrorClass(MESSAGE.NOT_FOUND_REVIEW, RESPONSE_STATUS_CODE.NOT_FOUND));
  }

  const replyData: any = {
    user: req.user,
    comment
  };

  if (!review.commentReplies) {
    review.commentReplies = [];
  }

  review.commentReplies.push(replyData);

  await course?.save();

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      review: course.reviews
    }
  });
});

// get all courses --only for admin
export const getAllCoursesForAdmin = catchAsyncError(async (req: IRequest, res: Response) => {
  await getAllCoursesService(res);
});

// delete course --only for admin
export const deleteCourse = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const course = courseModel.findById(id);
  if (!course) {
    return next(new ErrorClass(MESSAGE.NOT_FOUND_COURSE, RESPONSE_STATUS_CODE.NOT_FOUND));
  }

  await courseModel.deleteOne({ _id: id });

  await redis.del(id);
  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      message: RESPONSE_MESSAGE.DELETE_COURSE_SUCCESS
    }
  });
});
