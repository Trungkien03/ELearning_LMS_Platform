import cloudinary from 'cloudinary';

// Common function for handling thumbnail upload
export const handleImageUpload = async (image: any, options: object) => {
  const myCloud = await cloudinary.v2.uploader.upload(image, options);

  return {
    publicId: myCloud.public_id,
    url: myCloud.secure_url
  };
};

// Common function for destroying a thumbnail
export const destroyThumbnail = async (id: string) => {
  if (id) {
    await cloudinary.v2.uploader.destroy(id);
  }
};
