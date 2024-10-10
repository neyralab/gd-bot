const getWallet = (wallet) => {
  if (wallet) {
    if (Array.isArray(wallet) && !wallet.lenght) {
      return wallet[0]
    } else if (typeof wallet === 'string') {
      return wallet
    } else {
      return ''
    }
  }
}

const getNumbers = (value = '') => {
  if (Number.isInteger(value)) {
    return value;
  }
  return value?.match(/\d+/g)?.join('');
}

const capitalize = (value = '') => {
  return value.charAt(0).toUpperCase()+ value.slice(1)
}

const fomatNumber = (num) => {
  return Number(num).toLocaleString('en-US');
}

const removeExtension = (filename = '') => {
  const parts = filename.split('.');
  
  if (parts.length === 1 || (parts[0] === '' && parts.length === 2)) {
      return filename;
  }

  return parts.slice(0, -1).join('.');
}

const getResponseError = (error, defMessage = 'Sorry, something went wrong! Please reload the page') => {
  let res = error?.response?.data?.errors ||
    error?.response?.data?.message;
  if (!res && error instanceof Error){
    res = error.toString();
  }

  return res || defMessage;
}

const formatDuration = (duration = 0) => {
  if (duration)  {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  return '00:00'
};

const removeSlugHyphens = (uuidString = '') => 
  uuidString.replace(/-/g, "");

const addSlugHyphens = (uuidString = '') => {
  const formattedString = uuidString.replace(/-/g, "");
  return `${formattedString.slice(0, 8)}-${formattedString.slice(8, 12)}-${formattedString.slice(12, 16)}-${formattedString.slice(16, 20)}-${formattedString.slice(20)}`;
};

const isOkxWallet = (walletName = '') => {
  return walletName.toLocaleLowerCase().includes('okx');
};

const isValidEnvVariable = (value) => {
  if (!value || value === 'undefined') {
    return false;
  }

  return value;
}

export {
  getWallet,
  fomatNumber,
  getNumbers,
  capitalize,
  isOkxWallet,
  getResponseError,
  removeExtension,
  formatDuration,
  removeSlugHyphens,
  addSlugHyphens,
  isValidEnvVariable
};