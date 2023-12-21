import { ORDER_ROUTES } from '@app/constants/OrderConstants';
import { createOrder } from '@app/controllers/Order.controller';
import { isAuthenticated } from '@app/middleware/Auth';
import express from 'express';
const orderRouter = express.Router();

orderRouter.post(ORDER_ROUTES.CREATE_ORDER, isAuthenticated, createOrder);

export default orderRouter;
