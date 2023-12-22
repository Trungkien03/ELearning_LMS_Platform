import { RESPONSE_STATUS_CODE } from '@app/constants/Error.constants';
import { catchAsyncError } from '@app/middleware/CatchAsyncErrors';
import courseModel from '@app/models/Course.model';
import orderModel from '@app/models/Order.model';
import userModel from '@app/models/User.model';
import { generateLast12MonthsData } from '@app/utils/Analytics.generator';
import ErrorClass from '@app/utils/ErrorClass';
import { NextFunction, Request, Response } from 'express';
import { Document, Model } from 'mongoose';

// Generic function for fetching analytics data
const getAnalyticsData = async <t extends Document>(
  model: Model<t>,
  res: Response,
  dataKey: string,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await generateLast12MonthsData(model);
    res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
      success: true,
      data: {
        [dataKey]: data
      }
    });
  } catch (error) {
    return next(new ErrorClass((error as Error).message, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
};

// Controller for user analytics
export const getUserAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  await getAnalyticsData(userModel, res, 'users', next);
});

// Controller for courses analytics
export const getCoursesAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  await getAnalyticsData(courseModel, res, 'courses', next);
});

// Controller for orders analytics
export const getOrdersAnalytics = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  await getAnalyticsData(orderModel, res, 'orders', next);
});
