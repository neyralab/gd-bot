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

export { getWallet, fomatNumber, getNumbers, capitalize }