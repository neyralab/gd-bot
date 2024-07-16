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
  // Convert the number to a string if it is not already
  const numStr = num.toString();
  
  // Use a regular expression to add a dot after every three digits
  const result = numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return result;
}

export { getWallet, fomatNumber, getNumbers }