export const fromByteToMb = (bytes) => {
  const mb = Number(bytes) / 1048576;
  const res = mb === 0 ? 0 : mb.toFixed(2);

  return Number(res);
};

export const fromByteToGb = (bytes) => {
  if (bytes < 104857600) {
    return `${fromByteToMb(bytes)}MB`;
  }
  const mb = Number(bytes) / 1073741824;
  const res = mb === 0 ? 0 : mb.toFixed(2);

  return `${Number(res)}GB`;
};

export const fromByteToTb = (bytes) => {
  const tb = bytes / 1099511627776;
  const res = tb === 0 ? 0 : tb.toFixed(2);
  return Number(res);
};

export const sidebarSizeTransformer = (size) => {
  if (size < 1073741824) {
    return `${fromByteToMb(size)}MB`;
  } else if (size < 1099511627776) {
    return `${fromByteToGb(size)}`;
  } else {
    return `${fromByteToTb(size)}TB`;
  }
};

export const transformSize = (size = '', decimals = 1, showSize = true) => {
  const bytes = Number(size);
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return `0${showSize ? ' Bytes': ''}`;
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const result = parseFloat(bytes / Math.pow(1024, i));
  return `${Number.isInteger(result.toFixed(decimals)) ? result : (
    (result % 1 === 0) ? result.toFixed(0) : result.toFixed(decimals))
  } ${
    showSize && sizes[i]
  }`;
};