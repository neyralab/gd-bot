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

export { getWallet }