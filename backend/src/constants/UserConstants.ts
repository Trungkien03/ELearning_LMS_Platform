export const emailRegexPattern: RegExp = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
export const minLengthPass = 6;

export enum TOKEN_NAME {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken'
}

export enum USER_ROUTES {
  REGISTRATION = '/registration',
  ACTIVATE_USER = '/activate-user',
  LOGIN = '/login-user',
  LOGOUT = '/logout-user',
  REFRESH = '/refresh',
  GET_USER_INFO = '/me',
  SOCIAL_AUTH = '/social-auth',
  UPDATE_INFO = '/update-user-info',
  UPDATE_PASSWORD = '/update-user-password',
  UPDATE_AVATAR = '/update-user-avatar',
  GET_USERS_FOR_ADMIN = '/get-users-admin'
}
