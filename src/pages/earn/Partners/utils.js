import { getKeyTranslate } from '../../../translation/utils';

const PARTNER_KEY = 'partnertsToVerify';

const joinRegex = /Join (\w+) Telegram bot/;
const joinShortRegex = /Join (\w+) TG bot/;

const getPartnerName = (title) => {
  const match = title.match(joinRegex);
  const matchSecond = title.match(joinShortRegex)

  if (match) {
    return match[1];
  } else if (matchSecond) {
    return matchSecond[1];
  }

  if (title.startsWith('Join') && title.endsWith('TG bot')) {
    return title.substring(5, title.length - 7);
  } else if (title.startsWith('Join') && title.endsWith('Telegram bot')) {
    title.substring(5, title.length - 13);
  }

  return ''
}

const getPartnerTranslate = (text, t, translateJSON) => {
  const name = getPartnerName(text);
  const translatePath = getKeyTranslate(translateJSON, text.replace(name, '{name}'));

  return t(translatePath)?.replace('{name}', name) || text
}

const getParnterIcon = (text) => {
  const name = getPartnerName(text).replaceAll(' ', '');
  return `/assets/${name.toLowerCase()}.webp`
}

const isNeedVerify = (id) => {
  const parnterList = localStorage.getItem(PARTNER_KEY);
  return parnterList?.includes(id) || false;
}

export {
  joinRegex,
  PARTNER_KEY,
  isNeedVerify,
  getPartnerName,
  getParnterIcon,
  getPartnerTranslate,
}