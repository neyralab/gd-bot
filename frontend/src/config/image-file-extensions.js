const imageFileExtensions = [
  '.apng',
  '.bmp',
  '.gif',
  '.ico',
  '.cur',
  '.jpg',
  '.jpeg',
  '.pjpeg',
  '.pjp',
  '.png',
  '.svg',
  '.webp',
  '.psd',
  '.dds',
  '.jfif',
  '.heif',
  '.heic',
  '.tiff'
];

export const canBePreview = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/x-icon',
  // 'image/svg+xml',
  'application/octet-stream', //ai images
  'hdri'
];

export const imagesWithoutPreview = ['.psd', '.dds', '.tiff', '.heic', '.heif'];

export const imageMediaTypes = [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'image/vnd.ms-dds',
  'application/octet-stream', //ai images
  'image/heif',
  'image/heic',
  'image/tiff',
  'hdri'
];

export const imageMediaTypesPreview = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/octet-stream',
  'image/x-icon',
  'image/heif',
  'image/heic',
  'image/gif',
  'image/svg+xml',
  'image/tiff',
  'image/bmp',
  'hdri'
];

export default imageFileExtensions;
