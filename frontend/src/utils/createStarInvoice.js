import { isDevEnv } from '../utils/isDevEnv';

const INVOICE_TYPE = {
  boost: 'boost',
  game: 'game',
  ppv: 'ppv',
  spin: 'spin'
}

const defPayload = ''

const createInvoice = ({ type, additionalData }) => {
  if (type === INVOICE_TYPE.boost) {
    return {
      title: `Multiplier`,
      description: `Upgrade storage to 100GB and add Multiplier X${additionalData.mult} to the game.`,
      payload: additionalData.payload || defPayload,
      prices: [
        {
          label: `Multiplier Х${additionalData.mult}`,
          amount: isDevEnv() ? 1 : additionalData.price
        }
      ],
    }
  } else if (type === INVOICE_TYPE.game) {
    return {
      title: `Boost Game ${additionalData.mult}`,
      description: `Boost tupping upgrade to X${additionalData.mult} from 1min.`,
      payload: additionalData.payload || defPayload,
      prices: [
        {
          label: `Boost Game Х${additionalData.mult}`,
          amount: isDevEnv() ? 1 : additionalData.price
        }
      ],
    }
  } else if (type === INVOICE_TYPE.ppv) {
    return {
      title: 'Ghost Drive Pay per View',
      description: 'Enables payment processing for the Pay-Per-View feature.',
      payload: additionalData.payload || defPayload,
      prices: [
        {
          label: `Ghost Drive Pay per View`,
          amount: additionalData.price
        }
      ],
    }
  } else if (type === INVOICE_TYPE.spin) {
    return {
      title: 'Ghost Drive Spin Game',
      description: 'Enables payment processing for the Spin feature.',
      payload: additionalData.payload || defPayload,
      prices: [
        {
          label: `Ghost Drive Spin Game`,
          amount: additionalData.price
        }
      ],
    }
  }
}

export { createInvoice, INVOICE_TYPE };