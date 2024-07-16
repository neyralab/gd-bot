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
  return value?.match(/\d+/g)?.join('');
}

const fomatNumber = (num) => {
  return Number(num).toLocaleString('en-US');
}

export { getWallet, fomatNumber, getNumbers }