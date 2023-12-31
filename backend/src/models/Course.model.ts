import { MODEL } from '@app/constants/Common.constants';
import { IComment, ICourse, ICourseData, ILink, IReview } from '@app/types/Course.types';
import createMessage from '@app/utils/CreateMessage';
import mongoose, { Model, Schema } from 'mongoose';
import { COURSE_FIELD } from '../constants/Course.constants';

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0
  },
  comment: String,
  commentReplies: [Object]
});

const linkSchema = new Schema<ILink>({
  title: String,
  url: String
});

const commentSchema = new Schema<IComment>({
  user: Object,
  comment: String,
  commentReplies: [Object]
});

const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  videoThumbnail: Object,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema]
});

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: [true, createMessage(COURSE_FIELD.NAME)]
    },
    description: {
      type: String,
      required: [true, createMessage(COURSE_FIELD.DESCRIPTION)]
    },
    price: {
      type: Number,
      required: [true, createMessage(COURSE_FIELD.PRICE)]
    },
    estimatedPrice: {
      type: Number
    },
    thumbnail: {
      publicId: {
        type: String
        // required: true
      },
      url: {
        type: String
        // required: true
      }
    },
    tags: {
      type: String,
      required: [true, createMessage(COURSE_FIELD.TAGS)]
    },
    level: {
      type: String,
      required: [true, createMessage(COURSE_FIELD.LEVEL)]
    },
    demoUrl: {
      type: String,
      required: [true, createMessage(COURSE_FIELD.DEMO_URL)]
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
      type: Number,
      required: true
    },
    purchased: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const courseModel: Model<ICourse> = mongoose.model(MODEL.COURSE, courseSchema);

export default courseModel;
