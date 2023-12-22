import { MESSAGE, NOTIFICATION_TITLE } from '@app/constants/Common';
import { RESPONSE_STATUS_CODE } from '@app/constants/Error.constants';
import { firstIndexItem, firstValue, increaseOne, sixthIndexItem } from '@app/constants/Order.constants';
import { catchAsyncError } from '@app/middleware/CatchAsyncErrors';
import courseModel from '@app/models/Course.model';
import notificationModel from '@app/models/Notification.model';
import orderModel from '@app/models/Order.model';
import userModel from '@app/models/User.model';
import { getAllOrdersService } from '@app/services/Order.service';
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
    courseId: course._id,
    userId: user?._id
  };

  const mailData = {
    order: {
      _id: course._id.toString().slice(firstIndexItem, sixthIndexItem),
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
      title: NOTIFICATION_TITLE.ORDER,
      message: `You have a new order from ${course.name}`
    };

    user.courses.push(course._id);
    await Promise.all([user.save(), notificationModel.create(newNotification)]);
  }

  course.purchased = (course.purchased ?? firstValue) + increaseOne;
  await course.save();

  const order = await orderModel.create(data);

  res.status(RESPONSE_STATUS_CODE.CREATED).json({
    success: true,
    data: {
      order
    }
  });
});

// get all orders --only for admin
export const getAllOrdersForAdmin = catchAsyncError(async (req: IRequest, res: Response) => {
  await getAllOrdersService(res);
});
