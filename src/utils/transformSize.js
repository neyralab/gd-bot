export const transformSize = (size = '', decimals = 1, showSize = true) => {
  const bytes = Number(size);
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return `0${showSize ? ' Bytes' : ''}`;
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const result = bytes / Math.pow(1024, i);
  return `${
    Number.isInteger(result.toFixed(decimals))
      ? result
      : result.toFixed(decimals)
  }${showSize && sizes[i]}`;
};
