import { API_WEB_APP_URL } from './api-urls';

const isDevEnv = () => {
  return API_WEB_APP_URL.includes('tg-dev');
}

export { isDevEnv };