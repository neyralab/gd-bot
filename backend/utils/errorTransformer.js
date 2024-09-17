import isError from 'lodash.iserror';

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
    }
    return value;
  };
};

const errorTransformer = (error) => {
  let result;

  if (isError(error) || error instanceof Error) {
    result = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      code: 'code' in error ? error.code : undefined,
      cause: error.cause ? errorTransformer(error.cause) : undefined
    };
  } else if (typeof error === 'object' && error !== null) {
    result = {};
    for (const [key, value] of Object.entries(error)) {
      result[key] = errorTransformer(value);
    }
  } else {
    result = error;
  }

  if (error && error.isAxiosError) {
    result.isAxiosError = true;
    result.config = JSON.parse(JSON.stringify(error.config, getCircularReplacer()));
    result.response = {
      data: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    };
    result.request = '[Request Object]'; // Simplified to avoid circular references
  }

  return JSON.parse(JSON.stringify(result, getCircularReplacer()));
};

export default errorTransformer;