import { Response, Request, NextFunction } from 'express';
import { catchAsyncError } from '@app/middleware/CatchAsyncErrors';
import ErrorClass from '@app/utils/ErrorClass';
import layoutModel from '@app/models/Layout.model';
import cloudinary from 'cloudinary';
import { FOLDER_CLOUDINARY, MESSAGE, TYPE_LAYOUT } from '@app/constants/Common.constants';
import { RESPONSE_STATUS_CODE } from '@app/constants/Error.constants';
import { ICategory, IFagItem } from '@app/types/Layout.types';

// create layout
export const createLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { type } = req.body;
  const isTypeExist = await layoutModel.findOne({ type });
  if (isTypeExist) {
    return next(new ErrorClass(`Type ${type} already exist`, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
  if (!type || !Object.values(TYPE_LAYOUT).includes(type)) {
    return next(new ErrorClass(MESSAGE.INVALID_TYPE_LAYOUT, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  if (type === TYPE_LAYOUT.BANNER) {
    const { image, title, subTitle } = req.body;
    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: FOLDER_CLOUDINARY.LAYOUT
    });
    const banner = {
      type: TYPE_LAYOUT.BANNER,
      image: {
        publicId: myCloud.public_id,
        url: myCloud.secure_url
      },
      title,
      subTitle
    };
    await layoutModel.create(banner);
  }

  if (type === TYPE_LAYOUT.FAQ) {
    const { faqData } = req.body;
    const faqItem = await Promise.all(
      faqData.map(async (item: IFagItem) => {
        return {
          question: item.question,
          answer: item.answer
        };
      })
    );
    await layoutModel.create({ type: TYPE_LAYOUT.FAQ, fag: faqItem });
  }
  if (type === TYPE_LAYOUT.CATEGORIES) {
    const { categories } = req.body;
    const categoryItem = await Promise.all(
      categories.map(async (item: ICategory) => {
        return {
          title: item.title
        };
      })
    );
    await layoutModel.create({ type: TYPE_LAYOUT.CATEGORIES, categories: categoryItem });
  }

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      message: `Layout ${type} created successfully!`
    }
  });
});

// edit layout
export const editLayout = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { type } = req.body;
  if (!type || !Object.values(TYPE_LAYOUT).includes(type)) {
    return next(new ErrorClass(MESSAGE.INVALID_TYPE_LAYOUT, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }

  if (type === TYPE_LAYOUT.BANNER) {
    const bannerData = await layoutModel.findOne({ type: TYPE_LAYOUT.BANNER });
    if (!bannerData) {
      return next(new ErrorClass('Not Found Banner Layout', RESPONSE_STATUS_CODE.NOT_FOUND));
    }
    const { image, title, subTitle } = req.body;
    await cloudinary.v2.uploader.destroy(bannerData?.banner.image.publicId);
    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: FOLDER_CLOUDINARY.LAYOUT
    });
    const banner = {
      type: TYPE_LAYOUT.BANNER,
      image: {
        publicId: myCloud.public_id,
        url: myCloud.secure_url
      },
      title,
      subTitle
    };
    await layoutModel.findByIdAndUpdate(bannerData._id, { banner });
  }

  if (type === TYPE_LAYOUT.FAQ) {
    const { faqData } = req.body;
    const faq = await layoutModel.findOne({ type: TYPE_LAYOUT.FAQ });
    const faqItem = await Promise.all(
      faqData.map(async (item: IFagItem) => {
        return {
          question: item.question,
          answer: item.answer
        };
      })
    );
    await layoutModel.findByIdAndUpdate(faq?._id, { type: TYPE_LAYOUT.FAQ, fag: faqItem });
  }
  if (type === TYPE_LAYOUT.CATEGORIES) {
    const { categories } = req.body;
    const categoriesItem = await layoutModel.findOne({ type: TYPE_LAYOUT.CATEGORIES });
    const categoryItem = await Promise.all(
      categories.map(async (item: ICategory) => {
        return {
          title: item.title
        };
      })
    );
    await layoutModel.findByIdAndUpdate(categoriesItem?._id, {
      type: TYPE_LAYOUT.CATEGORIES,
      categories: categoryItem
    });
  }

  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      message: `Layout ${type} updated successfully!`
    }
  });
});

// get layout by type
export const getLayoutByType = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { type } = req.body;
  if (!type || !Object.values(TYPE_LAYOUT).includes(type)) {
    return next(new ErrorClass(MESSAGE.INVALID_TYPE_LAYOUT, RESPONSE_STATUS_CODE.BAD_REQUEST));
  }
  const layout = await layoutModel.findOne({ type });
  if (!layout) {
    return next(new ErrorClass(MESSAGE.NOT_FOUND_LAYOUTS, RESPONSE_STATUS_CODE.NOT_FOUND));
  }
  res.status(RESPONSE_STATUS_CODE.SUCCESS).json({
    success: true,
    data: {
      layout
    }
  });
});
