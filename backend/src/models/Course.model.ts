import { IComment, ICourse, ICourseData, ILink, IReview } from '@app/types/CourseTypes';
import mongoose, { Model, Schema } from 'mongoose';

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

const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
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
    required: true
  },
  level: {
    type: String,
    required: true
  },
  demoUrl: {
    type: String,
    required: true
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
});

const courseModel: Model<ICourse> = mongoose.model('Course', courseSchema);

export default courseModel;
