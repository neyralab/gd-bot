import isError from 'lodash.iserror';

const errorTransformer = (error) => {
  const seen = new WeakSet();
  const result =
    isError(error) || error instanceof Error
      ? {
          message: error?.message,
          name: error?.name,
          stack: error?.stack,
          code: 'code' in error ? error?.code : undefined,
          cause: error?.cause?.message
        }
      : error;

  if (error?.isAxiosError) {
    result.isAxiosError = true;
    result.config = JSON.parse(JSON.stringify(error.config, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    }));
    result.response = {
      data: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    };
    result.request = error.request;
  }

  return result;
};

export default errorTransformer;
