import { IBannerImage, ICategory, IFagItem, ILayout } from '@app/types/Layout.types';
import mongoose, { Schema } from 'mongoose';

const fagSchema = new Schema<IFagItem>({
  question: { type: String },
  answer: { type: String }
});

const categorySchema = new Schema<ICategory>({
  title: { type: String }
});

const bannerImageSchema = new Schema<IBannerImage>({
  publicId: { type: String },
  url: { type: String }
});

const layoutSchema = new Schema<ILayout>({
  type: { type: String },
  fag: [fagSchema],
  categories: [categorySchema],
  banner: {
    image: bannerImageSchema,
    title: { type: String },
    subTitle: { type: String }
  }
});

const layoutModel = mongoose.model('Layout', layoutSchema);
export default layoutModel;
