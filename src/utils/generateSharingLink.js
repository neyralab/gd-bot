import { UUIDBase64Converter } from './UUIDBase64Converter';
import { API_FILE_SHARING } from './api-urls';

export const generateSharingLink = (slug) => {
  const shortenerURL = API_FILE_SHARING;
  const ghostdriveURL = window.location.origin;
  const converter = new UUIDBase64Converter(shortenerURL, ghostdriveURL);
  const base64Url = converter.generateShortenerURL(slug);

  return base64Url;
};
