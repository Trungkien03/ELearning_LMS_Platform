import { USER_ROLE } from '@app/constants/Common.constants';
import { ORDER_ROUTES } from '@app/constants/Order.constants';
import { createOrder, getAllOrdersForAdmin } from '@app/controllers/Order.controller';
import { authorizeRoles, isAuthenticated } from '@app/middleware/Auth';
import express from 'express';
const orderRouter = express.Router();

orderRouter.post(ORDER_ROUTES.CREATE_ORDER, isAuthenticated, createOrder);
orderRouter.get(
  ORDER_ROUTES.GET_ALL_ORDERS_FOR_ADMIN,
  isAuthenticated,
  authorizeRoles(USER_ROLE.ADMIN),
  getAllOrdersForAdmin
);

export default orderRouter;
