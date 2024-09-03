function parseStartParams(startText) {
  let parsedParams = {};
  const paramString = startText.split(' ')[1];
  if (!paramString) return parsedParams;
  const params = paramString.split('-');
  parsedParams['ref'] = params[0];
  params.slice(1).forEach((param) => {
    const [key, value] = param.split('=');
    parsedParams[key] =
      value === 'true' ? true : value === 'false' ? false : value;
  });

  return parsedParams;
}

export default parseStartParams;
