export interface IFagItem extends Document {
  question: string;
  answer: string;
}

export interface ICategory extends Document {
  title: string;
}

export interface IBannerImage extends Document {
  publicId: string;
  url: string;
}

export interface ILayout extends Document {
  type: string;
  fag: IFagItem[];
  categories: ICategory[];
  banner: {
    image: IBannerImage;
    title: string;
    subTitle: string;
  };
}
