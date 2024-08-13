import { getKeyTranslate } from '../../../translation/utils';

const PARTNER_KEY = 'partnertsToVerify';

const PARTNER_TASK_TYPES = {
  bot: 'tg-bot',
  channel: 'tg-channel',
  twitter: 'twitter-X'
}

const PARTNER_SIZES = [
  {
    start: 'Join',
    end: 'TG bot',
    size: -7,
  },
  {
    start: 'Join',
    end: 'TG Channel',
    size: -11,
  },
  {
    start: 'Join',
    end: 'Twitter (X)',
    size: -12
  },
  {
    start: 'Follow',
    end: 'Telegram Channel',
    size: -17
  },
  {
    start: 'Follow',
    end: 'Twitter (X)',
    size: -12
  },
  {
    start: 'Join',
    end: 'Telegram bot',
    size: -13
  },
]

const getPartnerNameSize = (name) => {
  const size = PARTNER_SIZES.find((item) => (
    name.endsWith(item.end) && name.startsWith(item.start)
  ));
  if (size)
    return size

  return ''
}

const getPartnerName = (title) => {  
  const cutSize = getPartnerNameSize(title);
  if (cutSize) {
    return title.substring(cutSize.start.length + 1, title.length + cutSize.size);
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
  const parnterList =  JSON.parse(localStorage.getItem(PARTNER_KEY), '[]');
  return parnterList?.includes(id) || false;
}

const getPartnerTaskType = (name) => {
  if (name.endsWith('TG bot')) {
    return PARTNER_TASK_TYPES.bot;
  } else if (name.endsWith('TG Channel')) {
    return PARTNER_TASK_TYPES.channel;
  } else {
    return PARTNER_TASK_TYPES.twitter;
  }
}

const formatPartnerResponce = (data) => {
  const result = {
    games: [],
    tasks: []
  };

  const gameNames = new Set();
  const taskNames = new Set();

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const innerObject = data[key];

      for (const innerKey in innerObject) {
        if (innerObject.hasOwnProperty(innerKey)) {
          const item = innerObject[innerKey];

          if (item.name.endsWith("TG bot") && !gameNames.has(item.name)) {
            result.games.push({ ...item, translate: "earn.joinTGtempl" });
            gameNames.add(item.name);
          }

          if (!taskNames.has(item.name)) {
            const type = getPartnerTaskType(item.name);
            result.tasks.push({
              ...item,
              type: type,
              description: type === PARTNER_TASK_TYPES.bot 
                ? item.description : item.description.replace('Join', 'Follow ')
            });
            taskNames.add(item.name);
          }
        }
      }
    }
  }
  return result;
}

export {
  PARTNER_KEY,
  isNeedVerify,
  getPartnerName,
  getParnterIcon,
  getPartnerTranslate,
  formatPartnerResponce,
  PARTNER_TASK_TYPES,
}