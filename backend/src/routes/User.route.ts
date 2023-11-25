import { authorizeRoles, isAuthenticated } from './../middleware/Auth';
import express from 'express';
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken
} from '../controllers/User.controller';
import { USER_ROLE } from '~/constants/Common';

const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/activate-user', activateUser);
userRouter.post('/login-user', loginUser);
userRouter.get('/logout-user', isAuthenticated, authorizeRoles(USER_ROLE.ADMIN), logoutUser);
userRouter.get('/me', isAuthenticated, getUserInfo);
userRouter.post('/social-auth', socialAuth);
userRouter.get('/refresh', updateAccessToken);

export default userRouter;
