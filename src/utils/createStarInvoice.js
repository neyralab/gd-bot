const INVOICE_TYPE = {
  boost: 'boost',
  game: 'game',
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
          amount: additionalData.price
        }
      ],
      // photo_url: 'https://cdn.prod.website-files.com/64a2a26178ac203cccd4a006/64ce383c9d9dd1b5884efdc4_GhostDrive-Spaceship.webp',
      // photo_size: 97440,
      // photo_width: 300,
      // photo_height: 250,
    }
  } else if (type === INVOICE_TYPE.game) {
    return {
      title: `Boost Game ${additionalData.mult}`,
      description: `Boost tupping upgrade to X${additionalData.mult} from 1min.`,
      payload: additionalData.payload || defPayload,
      prices: [
        {
          label: `Boost Game Х${additionalData.mult}`,
          amount: additionalData.price
        }
      ],
      // photo_url: 'https://cdn.prod.website-files.com/64a2a26178ac203cccd4a006/64ce383c9d9dd1b5884efdc4_GhostDrive-Spaceship.webp',
      // photo_size: 97440,
      // photo_width: 300,
      // photo_height: 250,
    }
  }
}

export { createInvoice, INVOICE_TYPE };