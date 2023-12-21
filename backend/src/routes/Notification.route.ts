import { USER_ROLE } from '@app/constants/Common';
import { NOTIFICATION_ROUTES } from '@app/constants/NotificationConstants';
import { getNotifications, updateNotification } from '@app/controllers/Notification.controller';
import { authorizeRoles, isAuthenticated } from '@app/middleware/Auth';
import express from 'express';
const notificationRouter = express.Router();

notificationRouter.get(NOTIFICATION_ROUTES.GET_ALL, isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), getNotifications);
notificationRouter.put(
  NOTIFICATION_ROUTES.UPDATE,
  isAuthenticated,
  authorizeRoles(USER_ROLE.ADMIN, USER_ROLE.USER),
  updateNotification
);

export default notificationRouter;
