import { ANALYTICS_ROUTES } from '@app/constants/Analytics.constants';
import { USER_ROLE } from '@app/constants/Common.constants';
import { getCoursesAnalytics, getOrdersAnalytics, getUserAnalytics } from '@app/controllers/Analytics.controller';
import { authorizeRoles, isAuthenticated } from '@app/middleware/Auth';
import express from 'express';
const analyticsRouter = express.Router();

analyticsRouter.get(ANALYTICS_ROUTES.GET_USER, isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), getUserAnalytics);
analyticsRouter.get(ANALYTICS_ROUTES.GET_ORDERS, isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), getOrdersAnalytics);
analyticsRouter.get(
  ANALYTICS_ROUTES.GET_COURSES,
  isAuthenticated,
  authorizeRoles(USER_ROLE.ADMIN),
  getCoursesAnalytics
);

export default analyticsRouter;
