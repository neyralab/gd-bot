export const fromByteToMb = (bytes) => {
  const mb = Number(bytes) / 1048576;
  const res = mb === 0 ? 0 : mb.toFixed(2);

  return Number(res);
};

export const fromByteToGb = (bytes) => {
  const mb = Number(bytes) / 1073741824;
  const res = mb === 0 ? 0 : mb.toFixed(2);

  return Number(res);
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
    return `${fromByteToGb(size)}GB`;
  } else {
    return `${fromByteToTb(size)}TB`;
  }
};
