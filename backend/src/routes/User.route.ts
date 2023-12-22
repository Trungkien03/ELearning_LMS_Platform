import { USER_ROLE } from '@app/constants/Common';
import { USER_ROUTES } from '@app/constants/UserConstants';
import {
  activateUser,
  getAllUsersForAdmin,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateProfilePicture,
  updateUserInfo
} from '@app/controllers/User.controller';
import { authorizeRoles, isAuthenticated } from '@app/middleware/Auth';
import express from 'express';

const userRouter = express.Router();

userRouter.post(USER_ROUTES.REGISTRATION, registrationUser);
userRouter.post(USER_ROUTES.ACTIVATE_USER, activateUser);
userRouter.post(USER_ROUTES.LOGIN, loginUser);
userRouter.get(USER_ROUTES.LOGOUT, isAuthenticated, logoutUser);
userRouter.get(USER_ROUTES.REFRESH, updateAccessToken);
userRouter.get(USER_ROUTES.GET_USER_INFO, isAuthenticated, getUserInfo);
userRouter.post(USER_ROUTES.SOCIAL_AUTH, socialAuth);
userRouter.put(USER_ROUTES.UPDATE_INFO, isAuthenticated, updateUserInfo);
userRouter.put(USER_ROUTES.UPDATE_PASSWORD, isAuthenticated, updatePassword);
userRouter.put(USER_ROUTES.UPDATE_AVATAR, isAuthenticated, updateProfilePicture);
userRouter.get(USER_ROUTES.GET_USERS_FOR_ADMIN, isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), getAllUsersForAdmin);

export default userRouter;
