import { Document } from 'mongoose';
export interface IOrder extends Document {
  courseId: string;
  userId: string;
  paymentInfo: object;
}
