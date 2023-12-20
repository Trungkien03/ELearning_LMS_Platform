import { Document } from 'mongoose';
import { IUser } from './UserTypes';

export interface IComment {
  user: IUser;
  comment: string;
  commentReplies?: IComment[];
}

export interface IReview {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

export interface ILink extends Document {
  title: string;
  url: string;
}

export interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: string;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
}

export interface ICourse extends Document {
  name: string;
  description?: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: {
    publicId: string;
    url: string;
  };
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
}

export interface IProduct extends Document {}

export interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}
export interface IAddReviewData {
  review: string;
  courseId: string;
  rating: number;
  userId: string;
}

export interface IAddReplyReview {
  comment: string;
  courseId: string;
  reviewId: string;
}
