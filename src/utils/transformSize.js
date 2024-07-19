export const transformSize = (size = '', showSize = true) => {
  const bytes = Number(size);
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return `0${showSize ? ' Bytes' : ''}`;
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const result = bytes / Math.pow(1024, i);

  let formattedResult;
  if (Number.isInteger(result)) {
    formattedResult = result.toString();
  } else {
    const decimalPart = result - Math.floor(result);
    if (decimalPart < 0.001) {
      formattedResult = Math.floor(result).toString();
    } else if (decimalPart < 0.01) {
      formattedResult = result.toFixed(3);
    } else if (decimalPart < 0.1) {
      formattedResult = result.toFixed(2);
    } else {
      formattedResult = result.toFixed(1);
    }
  }

  // Remove trailing zeros after the decimal point
  formattedResult = formattedResult.replace(/\.?0+$/, '');

  return `${formattedResult}${showSize ? sizes[i] : ''}`;
};
