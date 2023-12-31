import { EXPIRE_REFRESH_TOKEN, EXPIRE_TOKEN, MODEL, USER_ROLE, genSalt } from '@app/constants/Common.constants';
import { USER_ROLES_LIST, emailRegexPattern, minLengthPass } from '@app/constants/User.constants'; // Sửa tên file constants
import { IUser } from '@app/types/User.types';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose, { Model, Schema } from 'mongoose';
dotenv.config();

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please Enter Your Name']
    },
    email: {
      type: String,
      required: [true, 'Please Enter Your email'],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: 'Please enter a valid email'
      },
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minlength: [minLengthPass, 'Password must be at least 6 characters'],
      select: false
    },
    avatar: {
      publicId: String,
      url: String
    },
    role: {
      type: String,
      enum: USER_ROLES_LIST,
      default: USER_ROLE.USER
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: MODEL.COURSE
      }
    ]
  },
  { timestamps: true }
);

// Hash Password before Saving
userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(genSalt);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// sign access token
userSchema.methods.signAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN as string, { expiresIn: EXPIRE_TOKEN });
};

userSchema.methods.signRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN as string, {
    expiresIn: EXPIRE_REFRESH_TOKEN
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model(MODEL.USER, userSchema);

export default userModel;
