import { isDevEnv } from '../utils/isDevEnv';

const INVOICE_TYPE = {
  boost: 'boost',
  game: 'game',
  ceatePPV: 'ceatePPV',
  viewAccessPPV: 'viewAccessPPV',
  downloadAccessPPV: 'downloadAccessPPV',
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
  } else if (type === INVOICE_TYPE.ceatePPV) {
    return {
      title: 'Ghost Drive PPV Registration.',
      description: 'Ghostdrive PPV: Stars Payment Link',
      payload: additionalData.payload || defPayload,
      prices: [
        {
          label: 'Ghost Drive PPV Registration.',
          amount: additionalData.price
        }
      ],
    }
  } else if (type === INVOICE_TYPE.viewAccessPPV) {
    return {
      title: 'Ghost Drive PPV Access',
      description: 'Ghostdrive Pay per View Access payload type for stars payment link creation',
      payload: additionalData.payload || defPayload,
      prices: [
        {
          label: `Ghost Drive Pay per View Access`,
          amount: additionalData.price
        }
      ],
    }
  } else if (type === INVOICE_TYPE.downloadAccessPPV) {
    return {
      title: 'Ghost Drive PPV Download',
      description: 'Ghostdrive Pay per View Download payload type for stars payment link creation',
      payload: additionalData.payload || defPayload,
      prices: [
        {
          label: `Ghost Drive PPV Download`,
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