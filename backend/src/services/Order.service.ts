import { RESPONSE_STATUS_CODE } from '@app/constants/ErrorConstants';
import orderModel from '@app/models/Order.model';
import { Response } from 'express';

export const getAllOrdersService = async (res: Response) => {
  const orders = await orderModel.find().sort({ createdAt: -1 });
  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      orders
    }
  });
};
