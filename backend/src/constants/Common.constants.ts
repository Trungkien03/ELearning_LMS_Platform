export const genSalt = 10;
export const ONE_THOUSAND = 1000;
export const NINE_THOUSAND = 9000;
export const ONE_HOUR = 216000;
export const ONE_DAY = 24;
export const EXPIRE_TOKEN = '5m';
export const EXPIRE_REFRESH_TOKEN = '7d';
export const LIMIT_MB = '50mb';
export const MONTHS_IN_YEAR = 12;
export const DAYS_IN_MONTH = 28;
export const INCREASE_ONE = 1;
export const DECREASE_ONE = 1;

export enum USER_ROLE {
  ADMIN = 'admin',
  USER = 'user'
}

export enum TYPE_LAYOUT {
  BANNER = 'Banner',
  FAQ = 'FAQ',
  CATEGORIES = 'Categories'
}

export enum NOTIFICATION_TITLE {
  QUESTION = 'New Question',
  ORDER = 'New Order',
  REVIEW = 'New Review Received',
  REPLY = 'New Question Reply Received'
}

export enum EMAIL_SUBJECT {
  REPLY = 'Question Reply'
}

export enum MAIL_FILES {
  ACTIVATE = 'ActivationMail.ejs',
  ORDER_CONFIRM = 'OrderConfirmation.ejs',
  REPLY = 'QuestionReply.ejs'
}

export enum MODEL {
  COURSE = 'Course',
  USER = 'User',
  ORDER = 'Order',
  NOTIFICATION = 'Notification'
}

export enum FOLDER_CLOUDINARY {
  AVATAR = 'avatars',
  COURSE = 'Course',
  LAYOUT = 'layouts'
}

export enum COMMON_ROUTE {
  USER = '/api/v1/users',
  COURSE = '/api/v1/course',
  NOTIFICATION = '/api/v1/notifications',
  ORDER = '/api/v1/orders',
  ANALYTICS = '/api/v1/analytics',
  LAYOUT = '/api/v1/layouts'
}

export enum RESPONSE_MESSAGE {
  DELETE_USER_SUCCESS = 'Delete User Successfully!',
  DELETE_COURSE_SUCCESS = 'Delete course Successfully!'
}

export enum MESSAGE {
  INVALID_USER = 'Invalid user',
  INVALID_PASS = 'Invalid Password',
  INVALID_EMAIL_PASS = 'Invalid email or password',
  INVALID_ACT_CODE = 'Invalid activation code',
  INVALID_CONTENT_ID = 'Invalid Content ID',
  INVALID_TOKEN = 'Access Token is not valid',
  INVALID_QUESTION_ID = 'Invalid Question ID',
  INVALID_ROLE = 'Invalid Role',
  INVALID_TYPE_LAYOUT = 'Invalid type layout',
  EXIST_EMAIL = 'Email already Exist',
  ENTER_EMAIL_PASSWORD = 'Please enter email and password',
  REQUEST_LOGIN_TO_ACCESS = 'Please login to access this resource',
  REQUEST_CORRECT_EMAIL_PASS = 'please enter old and new password correctly',
  NOT_FOUND_USER = 'User not found',
  NOT_FOUND_COURSE = 'Cannot find valid Course',
  NOT_FOUND_REVIEW = 'Cannot find valid review',
  NOT_FOUND_SINGLE_NOTIFICATION = 'Cannot find any notification with this ID',
  NOT_FOUND_NOTIFICATIONS = 'Cannot find any notifications',
  NOT_REFRESH_TOKEN = 'Could not refresh token',
  NOT_VALID_ACCESS_COURSE = 'You are not eligible to access this course',
  ALREADY_PURCHASED_COURSE = 'You have already purchased this course',
  LOGOUT_SUCCESS = 'logged out successfully',
  INVALID_JSON_TOKEN = 'Json web token is invalid, try again',
  EXPIRED_JSON_TOKEN = 'Json web token is expired, try again'
}
