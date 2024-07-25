import { isiOS } from '../../utils/client';

export const tasks = [
  {
    id: 'DOWNLOAD_APP',
    isDone: false,
    title: 'Download App',
    subtitle: '(via telegram login)',
    translatePath: 'earn.app',
    points: 0,
    imgUrl: '/assets/download_app.png',
    joinLink: isiOS()
      ? 'https://apps.apple.com/ca/app/ghost-drive/id6475002179'
      : 'https://play.google.com/store/apps/details?id=com.wise.data.ghostdrive'
  },
  {
    id: 'STORAGE_PURCHASE',
    isDone: false,
    title: 'Boost Storage',
    translatePath: 'earn.storage',
    points: 0,
    imgUrl: '/assets/rocket.png'
  },
  {
    id: 'INVITE_5_FRIENDS',
    isDone: false,
    title: 'Invite 5 Friends',
    translatePath: 'earn.friends',
    points: 0,
    imgUrl: '/assets/link.png'
  },
  {
    id: 'UPLOAD_10_FILES',
    isDone: false,
    title: 'Upload 10 Files',
    translatePath: 'earn.upload',
    points: 0,
    imgUrl: '/assets/fire.png'
  },
  {
    id: 'JOIN_TWITTER',
    isDone: false,
    title: 'Follow Our X Account',
    translatePath: 'earn.followX',
    points: 0,
    imgUrl: '/assets/x.png',
    joinLink: 'https://x.com/ghostdrive_web3'
  },
  {
    id: 'JOIN_YOUTUBE',
    isDone: false,
    title: 'Join Our YouTube Channel',
    translatePath: 'earn.joinYouTube',
    points: 0,
    imgUrl: '/assets/youtube.png',
    joinLink: 'https://www.youtube.com/@ghostdrive-web3'
  },
  {
    id: 'JOIN_TG_CHANNEL',
    isDone: false,
    title: 'Join Our Community',
    translatePath: 'earn.joinCommunity',
    points: 0,
    imgUrl: '/assets/telegram.png',
    joinLink: 'https://t.me/ghostdrive_web3_chat'
  },
  {
    id: 'WALLET_CONNECTION',
    isDone: false,
    title: 'Connect Wallet',
    translatePath: 'earn.connectWallet',
    points: 0,
    imgUrl: '/assets/money.png'
  }
];
