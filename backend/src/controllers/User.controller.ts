/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllUsersService, getUserById, updateUserRoleService } from '@app/services/User.service';
import { ISocialAuthBody } from '@app/types/SocialAuth.types';
import {
  EXPIRE_REFRESH_TOKEN,
  EXPIRE_TOKEN,
  FOLDER_CLOUDINARY,
  MESSAGE,
  RESPONSE_MESSAGE
} from '@app/constants/Common.constants';
import { RESPONSE_STATUS_CODE } from '@app/constants/Error.constants';
import { TOKEN_NAME, USER_ROLES_LIST } from '@app/constants/User.constants';
import { catchAsyncError } from '@app/middleware/CatchAsyncErrors';
import userModel from '@app/models/User.model';
import {
  IActivationRequest,
  IActivationToken,
  ILoginRequest,
  IRegistrationBody,
  IRequest,
  IUpdateProfilePicture,
  IUpdateUserInfo,
  IUpdateUserPassword,
  IUser
} from '@app/types/User.types';
import ErrorClass from '@app/utils/ErrorClass';
import { destroyThumbnail, handleImageUpload } from '@app/utils/HandleCloudinary';
import {
  accessTokenOptions,
  generateActivationCode,
  refreshTokenOptions,
  sendToken,
  signJwtToken
} from '@app/utils/HandleJWT';
import { redis } from '@app/utils/RedisClient';
import { sendActivationEmail } from '@app/utils/SendMail';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import Jwt, { JwtPayload, Secret } from 'jsonwebtoken';

dotenv.config();

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = generateActivationCode();
  const token = signJwtToken({ user, activationCode }, process.env.ACTIVATION_SECRET as Secret, EXPIRE_TOKEN);

  return { token, activationCode };
};

// REGISTRATION USER
export const registrationUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  const isEmailExist = await userModel.findOne({ email });

  if (isEmailExist) {
    return next(new ErrorClass(MESSAGE.EXIST_EMAIL, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const user: IRegistrationBody = { name, email, password, avatar: '' };
  const activationToken = createActivationToken(user);

  try {
    await sendActivationEmail(user, activationToken);
    const message = `Please check your email: ${user.email} to activate your account `;
    res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
      success: true,
      data: {
        message,
        activationToken: activationToken.token
      }
    });
  } catch (error) {
    return next(new ErrorClass((error as Error).message, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
});

// activate user
export const activateUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { activationCode, activationToken } = req.body as IActivationRequest;
  const newUser: { user: IUser; activationCode: string } = Jwt.verify(
    activationToken,
    process.env.ACTIVATION_SECRET as string
  ) as { user: IUser; activationCode: string };

  const { email, name, password } = newUser.user;
  if (newUser.activationCode !== activationCode) {
    return next(new ErrorClass(MESSAGE.INVALID_ACT_CODE, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const existUser = await userModel.findOne({ email });
  if (existUser) {
    return next(new ErrorClass(MESSAGE.EXIST_EMAIL, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const registerUser = await userModel.create({
    name,
    email,
    password
  });

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      registerUser
    }
  });
});

// Login user
export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as ILoginRequest;

  if (!email || !password) {
    return next(new ErrorClass(MESSAGE.ENTER_EMAIL_PASSWORD, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const user = await userModel.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorClass(MESSAGE.INVALID_EMAIL_PASS, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorClass(MESSAGE.INVALID_EMAIL_PASS, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
  sendToken(user, RESPONSE_STATUS_CODE.SUCCESS, res);
});

// Logout user
export const logoutUser = catchAsyncError(async (req: IRequest, res: Response) => {
  res.cookie(TOKEN_NAME.ACCESS, '', { maxAge: 1 });
  res.cookie(TOKEN_NAME.REFRESH, '', { maxAge: 1 });
  const userId = req.user?._id || '';
  redis.del(userId);
  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      message: MESSAGE.LOGOUT_SUCCESS
    }
  });
});

// update access token
export const updateAccessToken = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken as string;
  const decoded = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN as string) as JwtPayload;

  const message = MESSAGE.NOT_REFRESH_TOKEN;
  if (!decoded) {
    return next(new ErrorClass(message, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const sessionUser = await redis.get(decoded.id as string);
  if (!sessionUser) return next(new ErrorClass(message, RESPONSE_STATUS_CODE.BAD_REQUEST));

  const user = JSON.parse(sessionUser);

  const newAccessToken = signJwtToken({ id: user._id }, process.env.ACCESS_TOKEN as string, EXPIRE_TOKEN);
  const newRefreshToken = signJwtToken({ id: user._id }, process.env.REFRESH_TOKEN as string, EXPIRE_REFRESH_TOKEN);

  req.user = user;

  res.cookie(TOKEN_NAME.ACCESS, newAccessToken, accessTokenOptions);
  res.cookie(TOKEN_NAME.REFRESH, newRefreshToken, refreshTokenOptions);

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      newAccessToken
    }
  });
});

// get user info by id
export const getUserInfo = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  await getUserById(userId, res, next);
});

// social auth
export const socialAuth = catchAsyncError(async (req: Request, res: Response) => {
  const { email, name, avatar, password } = req.body as ISocialAuthBody;
  const user = await userModel.findOne({ email });
  if (!user) {
    const newUser = await userModel.create({ email, name, avatar, password });
    sendToken(newUser, RESPONSE_STATUS_CODE.SUCCESS, res);
  } else {
    sendToken(user, RESPONSE_STATUS_CODE.SUCCESS, res);
  }
});

// update user info
export const updateUserInfo = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const { email, name } = req.body as IUpdateUserInfo;
  const userId = req.user?._id;
  const user = await userModel.findById(userId);
  if (email && user) {
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorClass(MESSAGE.EXIST_EMAIL, RESPONSE_STATUS_CODE.BAD_REQUEST));
    }
    user.email = email;
  }
  if (name && user) {
    user.name = name;
  }
  await user?.save();
  await redis.set(userId, JSON.stringify(user));
  res.status(RESPONSE_STATUS_CODE.CREATED).json({
    success: true,
    data: {
      user
    }
  });
});

// update user password
export const updatePassword = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const { oldPassword, newPassword } = req.body as IUpdateUserPassword;
  const GET_PASSWORD = '+password';
  const user = await userModel.findById(req.user?._id).select(GET_PASSWORD);
  if (!oldPassword || !newPassword) {
    return next(new ErrorClass(MESSAGE.REQUEST_CORRECT_EMAIL_PASS, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
  if (user?.password === undefined) {
    return next(new ErrorClass(MESSAGE.INVALID_USER, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
  const isPasswordMatch = await user?.comparePassword(oldPassword);
  if (!isPasswordMatch) {
    return next(new ErrorClass(MESSAGE.INVALID_PASS, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  user.password = newPassword;

  await user.save();
  await redis.set(user._id, JSON.stringify(user));
  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      user
    }
  });
});

// update profile picture
export const updateProfilePicture = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body as IUpdateProfilePicture;
  const userId = req.user?._id;
  const NUM_WIDTH_AVATAR = 150;
  const user = await userModel.findById(userId);
  const uploadOptions = {
    folder: FOLDER_CLOUDINARY.AVATAR,
    width: NUM_WIDTH_AVATAR
  };

  if (!user) return next(new ErrorClass(MESSAGE.INVALID_USER, RESPONSE_STATUS_CODE.BAD_REQUEST));

  if (avatar) {
    // if user have one avatar
    if (user.avatar.publicId) {
      // delete old image
      await destroyThumbnail(user.avatar.publicId);
      const myCloud = await handleImageUpload(avatar, uploadOptions);
      user.avatar = myCloud;
    } else {
      const myCloud = await handleImageUpload(avatar, uploadOptions);
      user.avatar = myCloud;
    }

    await user.save();
    redis.set(userId, JSON.stringify(user));

    res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
      success: true,
      data: {
        user
      }
    });
  }
});

// get all users --only for admin
export const getAllUsersForAdmin = catchAsyncError(async (req: IRequest, res: Response) => {
  await getAllUsersService(res);
});

// update user role -- only for admin
export const updateUserRole = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { id, role } = req.body;

  if (!USER_ROLES_LIST.includes(role)) {
    return next(new ErrorClass(MESSAGE.INVALID_ROLE, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
  updateUserRoleService(res, id, role);
});

// delete user --only for admin
export const deleteUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = userModel.findById(id);
  if (!user) {
    return next(new ErrorClass(MESSAGE.NOT_FOUND_USER, RESPONSE_STATUS_CODE.NOT_FOUND));
  }

  await userModel.deleteOne({ _id: id });

  await redis.del(id);
  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      message: RESPONSE_MESSAGE.DELETE_USER_SUCCESS
    }
  });
});
