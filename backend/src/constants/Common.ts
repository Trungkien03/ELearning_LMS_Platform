export const genSalt = 10;
export const ONE_THOUSAND = 1000;
export const NINE_THOUSAND = 9000;

export enum USER_ROLE {
  ADMIN = 'admin',
  USER = 'user'
}

export enum MODEL {
  COURSE = 'Course',
  USER = 'User',
  ORDER = 'Order',
  NOTIFICATION = 'Notification'
}

export const ONE_HOUR = 216000;
export const ONE_DAY = 24;

export const EXPIRE_TOKEN = '5m';
export const EXPIRE_REFRESH_TOKEN = '7d';

export enum FOLDER_CLOUDINARY {
  AVATAR = 'avatars',
  COURSE = 'Course'
}

export enum MESSAGE {
  INVALID_USER = 'Invalid user',
  INVALID_PASS = 'Invalid Password',
  INVALID_EMAIL_PASS = 'Invalid email or password',
  INVALID_ACT_CODE = 'Invalid activation code',
  INVALID_CONTENT_ID = 'Invalid Content ID',
  INVALID_TOKEN = 'Access Token is not valid',
  INVALID_QUESTION_ID = 'Invalid Question ID',
  EXIST_EMAIL = 'Email already Exist',
  ENTER_EMAIL_PASSWORD = 'Please enter email and password',
  REQUEST_LOGIN_TO_ACCESS = 'Please login to access this resource',
  REQUEST_CORRECT_EMAIL_PASS = 'please enter old and new password correctly',
  NOT_FOUND_USER = 'User not found',
  NOT_FOUND_COURSE = 'Cannot find valid Course',
  NOT_FOUND_REVIEW = 'Cannot find valid review',
  NOT_REFRESH_TOKEN = 'Could not refresh token',
  NOT_VALID_ACCESS_COURSE = 'You are not eligible to access this course',
  LOGOUT_SUCCESS = 'logged out successfully',
  INVALID_JSON_TOKEN = 'Json web token is invalid, try again',
  EXPIRED_JSON_TOKEN = 'Json web token is expired, try again'
}
