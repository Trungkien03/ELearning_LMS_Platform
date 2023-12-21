import { MESSAGE } from '@app/constants/Common';
import { RESPONSE_STATUS_CODE } from '@app/constants/ErrorConstants';
import { STATUS } from '@app/constants/NotificationConstants';
import { catchAsyncError } from '@app/middleware/CatchAsyncErrors';
import notificationModel from '@app/models/Notification.model';
import ErrorClass from '@app/utils/ErrorClass';
import { NextFunction, Request, Response } from 'express';

// get all notification
export const getNotifications = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const notifications = await notificationModel.find().sort({ createdAt: -1 });

  if (!notifications) {
    return next(new ErrorClass(MESSAGE.NOT_FOUND_NOTIFICATIONS, RESPONSE_STATUS_CODE.NOT_FOUND));
  }

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    notifications
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
    notifications
  });
});
