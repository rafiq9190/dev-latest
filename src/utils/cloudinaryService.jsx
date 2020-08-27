import { Cloudinary as CoreCloudinary, Util } from 'cloudinary-core';

export const openUploadWidget = (options, callback) => {
  const scOptions = Util.withSnakeCaseKeys(options);
  window.cloudinary.openUploadWidget(scOptions, callback);
};