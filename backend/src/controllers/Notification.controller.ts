import { MESSAGE } from '@app/constants/Common';
import { RESPONSE_STATUS_CODE } from '@app/constants/Error.constants';
import {
  HOURS,
  HOURS_A_DAY,
  MINUTES,
  NUM_CONVERT_DAY_TIME,
  STATUS,
  THIRTY_DAY
} from '@app/constants/Notification.constants';
import { catchAsyncError } from '@app/middleware/CatchAsyncErrors';
import notificationModel from '@app/models/Notification.model';
import ErrorClass from '@app/utils/ErrorClass';
import { NextFunction, Request, Response } from 'express';
import cron from 'node-cron';

// get all notification
export const getNotifications = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const notifications = await notificationModel.find().sort({ createdAt: -1 });

  if (!notifications) {
    return next(new ErrorClass(MESSAGE.NOT_FOUND_NOTIFICATIONS, RESPONSE_STATUS_CODE.NOT_FOUND));
  }

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      notifications
    }
  });
});

// update notification status
export const updateNotification = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const notificationId = req.params.id;
  const notification = await notificationModel.findById(notificationId);
  if (!notification) {
    return next(new ErrorClass(MESSAGE.NOT_FOUND_SINGLE_NOTIFICATION, RESPONSE_STATUS_CODE.NOT_FOUND));
  }
  notification.status ? (notification.status = STATUS.READ) : notification.status;
  await notification.save();

  const notifications = await notificationModel.find().sort({ createdAt: -1 });

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      notifications
    }
  });
});

// delete notification -- only admin
cron.schedule('0 0 0 * * *', async function () {
  const thirtyDaysAgo = new Date(Date.now() - THIRTY_DAY * HOURS_A_DAY * HOURS * MINUTES * NUM_CONVERT_DAY_TIME); // 2592000000.
  await notificationModel.deleteMany({ status: STATUS.READ, createdAt: { $lt: thirtyDaysAgo } });
  console.log('Delete read notification');
});
