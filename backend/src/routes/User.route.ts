import express from 'express';
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateProfilePicture,
  updateUserInfo
} from '../controllers/User.controller';
import { isAuthenticated } from './../middleware/Auth';

const userRouter = express.Router();

userRouter.post('/registration', registrationUser);
userRouter.post('/activate-user', activateUser);
userRouter.post('/login-user', loginUser);
userRouter.get('/logout-user', isAuthenticated, logoutUser);
userRouter.get('/refresh', updateAccessToken);
userRouter.get('/me', isAuthenticated, getUserInfo);
userRouter.post('/social-auth', socialAuth);
userRouter.put('/update-user-info', isAuthenticated, updateUserInfo);
userRouter.put('/update-user-password', isAuthenticated, updatePassword);
userRouter.put('/update-user-avatar', isAuthenticated, updateProfilePicture);

export default userRouter;
