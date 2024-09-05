import isError from 'lodash.iserror';

const errorTransformer = (error) => {
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
    result.config = error.config;
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
