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

const getResponseError = (error, defMessage = 'Sorry, something went wrong! Please reload the page') => {
  let res = error?.response?.data?.errors ||
    error?.response?.data?.message;
  if (!res && error instanceof Error){
    res = error.toString();
  }

  return res || defMessage;
}

export { getWallet, fomatNumber, getNumbers, capitalize, getResponseError }