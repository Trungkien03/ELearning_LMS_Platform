import { Request } from 'express';
import { Schema } from 'mongoose';
import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    publicId: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ _id: Schema.Types.ObjectId }>;
  comparePassword: (password: string) => Promise<boolean>;
  isModified(field: string): boolean;
  signAccessToken: () => string;
  signRefreshToken: () => string;
}

export interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

export interface IUpdateUserPassword {
  oldPassword: string;
  newPassword: string;
}

export interface IUpdateProfilePicture {
  avatar: string;
}

export interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export interface IRequest extends Request {
  user?: IUser;
}

export interface IActivationToken {
  token: string;
  activationCode: string;
}

export interface IActivationRequest {
  activationToken: string;
  activationCode: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}
