const getKeyTranslate = (obj, value) => {
  const path = [];

  const search = (currentObj, currentPath) => {
    for (let key in currentObj) {
      if (currentObj[key] === value) {
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

export { getKeyTranslate };