import { getPartnerName } from '../../pages/earn/Partners/utils';

const getKeyTranslate = (obj, value) => {
  const path = [];
  const isTemp = getPartnerName(value);

  const search = (currentObj, currentPath) => {
    for (let key in currentObj) {
      if (isTemp && typeof currentObj[key] !== 'object' && currentObj[key]?.replace('{name}', isTemp) === value) {
        path.push(...currentPath, key);
      } else if (currentObj[key] === value) {
        path.push(...currentPath, key);
        return true;
      } else if (typeof currentObj[key] === 'object') {
        if (search(currentObj[key], currentPath.concat(key))) {
          return true;
        }
      }
    }
    return false;
  };

  search(obj, []);
  return path.length > 0 ? path.join('.') : null;
};

const getHistoryTranslate = (obj, value, t) => {
  const translatePath = getKeyTranslate(obj, value);
  const isTemp = getPartnerName(value);

  if (isTemp) {
    return t(translatePath).replace('{name}', isTemp)
  } else {
    return t(translatePath)
  }
}

export { getKeyTranslate, getHistoryTranslate };