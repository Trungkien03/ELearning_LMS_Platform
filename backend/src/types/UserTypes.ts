import { Request } from 'express';
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
  courses: Array<{ coursedId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  isModified(field: string): boolean;
  signAccessToken: () => string;
  signRefreshToken: () => string;
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
