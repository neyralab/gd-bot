function filterUniqueByParam(array, param) {
  const seen = new Set();
  return array.filter(item => {
      const value = item[param];
      if (seen.has(value)) {
          return false;
      }
      seen.add(value);
      return true;
  });
}

export { filterUniqueByParam }