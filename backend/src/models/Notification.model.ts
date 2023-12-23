import { MODEL } from '@app/constants/Common.constants';
import { NOTIFICATION_STATUS, STATUS } from '@app/constants/Notification.constants';
import { INotification } from '@app/types/Notification.types';
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
