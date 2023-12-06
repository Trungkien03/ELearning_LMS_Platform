import { getUserById } from './../services/UserService';
import { ISocialAuthBody } from './../types/SocialAuthTypes';
/* eslint-disable @typescript-eslint/no-explicit-any */
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import ejs from 'ejs';
import { NextFunction, Request, Response } from 'express';
import Jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import path from 'path';
import { TOKEN_NAME } from '~/constants/UserConstants';
import { redis } from '~/utils/redis';
import { EXPIRE_REFRESH_TOKEN, EXPIRE_TOKEN, NINE_THOUSAND, ONE_THOUSAND } from '../constants/Common';
import { RESPONSE_STATUS_CODE } from '../constants/ErrorConstants';
import { catchAsyncError } from '../middleware/CatchAsyncErrors';
import userModel from '../models/User.model';
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
} from '../types/UserTypes';
import ErrorClass from '../utils/ErrorClass';
import sendMail from '../utils/SendMail';
import { accessTokenOptions, refreshTokenOptions, sendToken } from './../utils/Jwt';

dotenv.config();

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(ONE_THOUSAND + Math.random() * NINE_THOUSAND).toString();
  const token = Jwt.sign(
    {
      user,
      activationCode
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: EXPIRE_TOKEN
    }
  );

  return { token, activationCode };
};

export const registrationUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  const isEmailExist = await userModel.findOne({ email });

  if (isEmailExist) {
    return next(new ErrorClass('Email already Exist', RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const user: IRegistrationBody = {
    name,
    email,
    password,
    avatar: ''
  };

  const activationToken = createActivationToken(user);
  const activationCode = activationToken.activationCode;
  const data = { user: { name: user.name }, activationCode };
  const html = await ejs.renderFile(path.join(__dirname, '../mails/ActivationMail.ejs'), data);

  try {
    await sendMail({
      email: user.email,
      subject: 'Activate your account',
      template: 'ActivationMail.ejs',
      data
    });

    res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
      success: true,
      message: `Please check your email: ${user.email} to activate your account `,
      activationToken: activationToken.token
    });
  } catch (error: any) {
    return next(new ErrorClass(error.message, RESPONSE_STATUS_CODE.BAD_REQUEST));
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
    return next(new ErrorClass('Invalid activation code', RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const existUser = await userModel.findOne({ email });
  if (existUser) {
    return next(new ErrorClass('Email already exist', RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const registerUser = await userModel.create({
    name,
    email,
    password
  });

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    registerUser
  });
});

// Login user
export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as ILoginRequest;

  if (!email || !password) {
    return next(new ErrorClass('Please enter email and password', RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const user = await userModel.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorClass('Invalid email or password', RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorClass('Invalid email or password', RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
  sendToken(user, RESPONSE_STATUS_CODE.SUCCESS, res);
});

// Logout user
export const logoutUser = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  res.cookie(TOKEN_NAME.ACCESS, '', { maxAge: 1 });
  res.cookie(TOKEN_NAME.REFRESH, '', { maxAge: 1 });
  const userId = req.user?._id || '';
  redis.del(userId);
  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    message: 'logged out successfully'
  });
});

// update access token
export const updateAccessToken = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken as string;
  const decoded = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN as string) as JwtPayload;

  const message = 'Could not refresh token';
  if (!decoded) {
    return next(new ErrorClass(message, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  const session = await redis.get(decoded.id as string);
  if (!session) return next(new ErrorClass(message, RESPONSE_STATUS_CODE.BAD_REQUEST));

  const user = JSON.parse(session);

  const newAccessToken = Jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as string, {
    expiresIn: EXPIRE_TOKEN
  });

  const newRefreshToken = Jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as string, {
    expiresIn: EXPIRE_REFRESH_TOKEN
  });

  req.user = user;

  res.cookie(TOKEN_NAME.ACCESS, newAccessToken, accessTokenOptions);
  res.cookie(TOKEN_NAME.REFRESH, newRefreshToken, refreshTokenOptions);

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    newAccessToken
  });
});

// get user info by id
export const getUserInfo = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  await getUserById(userId, res, next);
});

// social auth
export const socialAuth = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
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
      return next(new ErrorClass('Email already exist', RESPONSE_STATUS_CODE.BAD_REQUEST));
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
    user
  });
});

// update user password
export const updatePassword = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const { oldPassword, newPassword } = req.body as IUpdateUserPassword;
  const user = await userModel.findById(req.user?._id).select('+password');
  if (!oldPassword || !newPassword) {
    return next(new ErrorClass('please enter old and new password correctly', RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
  if (user?.password === undefined) {
    return next(new ErrorClass('invalid user', RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
  const isPasswordMatch = await user?.comparePassword(oldPassword);
  if (!isPasswordMatch) {
    return next(new ErrorClass('invalid Password', RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  user.password = newPassword;

  await user.save();
  await redis.set(user._id, JSON.stringify(user));
  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    user
  });
});

// update profile picture
export const updateProfilePicture = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body as IUpdateProfilePicture;
  const userId = req.user?._id;
  const user = await userModel.findById(userId);
  if (!user) return next(new ErrorClass('invalid user', RESPONSE_STATUS_CODE.BAD_REQUEST));
  if (avatar) {
    // if user have one avatar
    if (user?.avatar?.publicId) {
      // delete old image
      await cloudinary.v2.uploader.destroy(user?.avatar?.publicId);
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: 'avatars',
        width: 150
      });

      user.avatar = {
        publicId: myCloud.public_id,
        url: myCloud.secure_url
      };
    } else {
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: 'avatars',
        width: 150
      });

      user.avatar = {
        publicId: myCloud.public_id,
        url: myCloud.secure_url
      };
    }

    await user.save();
    redis.set(userId, JSON.stringify(user));

    res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
      success: true,
      user
    });
  }
});
