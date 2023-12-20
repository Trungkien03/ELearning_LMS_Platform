import { MODEL } from '@app/constants/Common';
import { INotification } from '@app/types/NotificationTypes';
import mongoose, { Model, Schema } from 'mongoose';

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['unread', 'read'],
      default: 'unread'
    }
  },
  { timestamps: true }
);

const notificationModel: Model<INotification> = mongoose.model(MODEL.NOTIFICATION, notificationSchema);

export default notificationModel;
