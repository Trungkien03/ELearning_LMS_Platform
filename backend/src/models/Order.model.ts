import { MODEL } from '@app/constants/Common';
import { ORDER_SCHEMA_FIELD } from '@app/constants/CourseConstant';
import { IOrder } from '@app/types/OrderTypes';
import createMessage from '@app/utils/CreateMessage';
import mongoose, { Model, Schema } from 'mongoose';

const orderSchema = new Schema<IOrder>(
  {
    courseId: {
      type: String,
      required: [true, createMessage(ORDER_SCHEMA_FIELD.COURSED_ID)]
    },
    userId: {
      type: String,
      required: [true, createMessage(ORDER_SCHEMA_FIELD.USER_ID)]
    },
    paymentInfo: {
      type: Object
      // require: true
    }
  },
  { timestamps: true }
);

const orderModel: Model<IOrder> = mongoose.model(MODEL.ORDER, orderSchema);

export default orderModel;
