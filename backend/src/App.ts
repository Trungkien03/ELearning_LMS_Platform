/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { COMMON_ROUTE, LIMIT_MB } from './constants/Common';
import { errorHandler } from './middleware/ErrorHandler';
import courseRouter from './routes/Course.routes';
import notificationRouter from './routes/Notification.routes';
import orderRouter from './routes/Order.routes';
import userRouter from './routes/User.routes';
import analyticsRouter from './routes/Analytics.routes';

dotenv.config();

const app = express();
// body parser
app.use(express.json({ limit: LIMIT_MB }));
// cookie parser
app.use(cookieParser());
// cors => cross origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN
  })
);

// routes
app.use(COMMON_ROUTE.USER, userRouter);
app.use(COMMON_ROUTE.COURSE, courseRouter);
app.use(COMMON_ROUTE.ORDER, orderRouter);
app.use(COMMON_ROUTE.NOTIFICATION, notificationRouter);
app.use(COMMON_ROUTE.ANALYTICS, analyticsRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(errorHandler);

export default app;
