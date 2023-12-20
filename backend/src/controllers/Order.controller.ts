import { MESSAGE } from '@app/constants/Common';
import { RESPONSE_STATUS_CODE } from '@app/constants/ErrorConstants';
import { catchAsyncError } from '@app/middleware/CatchAsyncErrors';
import courseModel from '@app/models/Course.model';
import notificationModel from '@app/models/Notification.model';
import orderModel from '@app/models/Order.model';
import userModel from '@app/models/User.model';
import { IOrder } from '@app/types/OrderTypes';
import { IRequest } from '@app/types/UserTypes';
import ErrorClass from '@app/utils/ErrorClass';
import sendMail from '@app/utils/SendMail';
import { NextFunction, Response } from 'express';

// create order
export const createOrder = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const { courseId } = req.body as IOrder;
  const userId = req.user?._id;

  const user = await userModel.findById(userId);

  if (user?.courses.some((course) => course.toString() === courseId.toString())) {
    return next(new ErrorClass(MESSAGE.ALREADY_PURCHASED_COURSE, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const course = await courseModel.findById(courseId);

  if (!course) {
    return next(new ErrorClass(MESSAGE.NOT_FOUND_COURSE, RESPONSE_STATUS_CODE.NOT_FOUND));
  }

  const data: any = {
    courseId: course._id,
    userId: user?._id
  };

  const mailData = {
    order: {
      _id: course._id.toString().slice(0, 6),
      name: course.name,
      price: course.price,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  };

  if (user) {
    await sendMail({
      email: user.email,
      subject: 'Order Confirmation',
      data: mailData,
      template: 'OrderConfirmation.ejs'
    });

    const newNotification = {
      userId: user._id,
      title: 'New Order',
      message: `You have a new order from ${course.name}`
    };

    user.courses.push(course._id);
    await Promise.all([user.save(), notificationModel.create(newNotification)]);
  }

  course.purchased = (course.purchased ?? 0) + 1;
  await course.save();

  const order = await orderModel.create(data);

  res.status(RESPONSE_STATUS_CODE.CREATED).json({
    success: true,
    order: order
  });
});
