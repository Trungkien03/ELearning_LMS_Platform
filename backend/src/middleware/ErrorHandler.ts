import { ERROR, RESPONSE_STATUS_CODE } from '../constants/ErrorConstants';
import { NextFunction, Request, Response } from 'express';
import ErrorClass from '../utils/ErrorClass';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR;
  err.message = err.message || 'Internal server error';

  switch (err.name) {
    case ERROR.CAST_ERROR:
      const castErrorMessage = `Resource not found. Invalid ${err.path}`;
      err = new ErrorClass(castErrorMessage, RESPONSE_STATUS_CODE.BAD_REQUEST);
      break;

    case ERROR.DUPLICATE_VALUE:
      const duplicateKeyMessage = `Duplicate ${Object.keys(err.keyValue)} entered`;
      err = new ErrorClass(duplicateKeyMessage, RESPONSE_STATUS_CODE.BAD_REQUEST);
      break;

    case ERROR.JSON_WEB_TOKEN_ERROR:
      const jwtErrorMessage = 'Json web token is invalid, try again';
      err = new ErrorClass(jwtErrorMessage, RESPONSE_STATUS_CODE.BAD_REQUEST);
      break;

    case ERROR.TOKEN_EXPIRED:
      const tokenExpiredMessage = 'Json web token is expired, try again';
      err = new ErrorClass(tokenExpiredMessage, RESPONSE_STATUS_CODE.BAD_REQUEST);
      break;

    default:
      break;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message
  });

  next();
};
