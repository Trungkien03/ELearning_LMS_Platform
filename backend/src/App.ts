/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/ErrorHandler';
import { RESPONSE_STATUS_CODE } from './constants/ErrorConstants';
import userRouter from './routes/User.route';

dotenv.config();

const app = express();
// body parser
app.use(express.json({ limit: '50mb' }));
// cookie parser
app.use(cookieParser());
// cors => cross origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN
  })
);

// routes
app.use('/api/v1/users', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(errorHandler);

export default app;
