export const isBlobType = (obj: any): boolean => {
  return obj instanceof Blob;
};

export const isDataprepUrl = (url: string): boolean => {
  return url.includes('filecoin-dataprep');
};
