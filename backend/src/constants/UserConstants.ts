export const emailRegexPattern: RegExp = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
export const minLengthPass = 6;

export enum TOKEN_NAME {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken'
}
