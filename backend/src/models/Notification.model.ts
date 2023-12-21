import { MODEL } from '@app/constants/Common';
import { NOTIFICATION_STATUS, STATUS } from '@app/constants/NotificationConstants';
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
      enum: NOTIFICATION_STATUS,
      default: STATUS.UNREAD
    }
  },
  { timestamps: true }
);

const notificationModel: Model<INotification> = mongoose.model(MODEL.NOTIFICATION, notificationSchema);

export default notificationModel;
