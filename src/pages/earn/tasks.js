import { isiOS } from '../../utils/client';

export const tasks = [
  {
    id: 'downloadMobileApp',
    isDone: false,
    title: 'Download App',
    subtitle: '(via telegram login)',
    points: 100000,
    imgUrl: '/assets/download_app.png',
    joinLink: isiOS()
      ? 'https://apps.apple.com/ca/app/ghost-drive/id6475002179'
      : 'https://play.google.com/store/apps/details?id=com.wise.data.ghostdrive'
  },
  {
    id: 'boost',
    isDone: false,
    title: 'Boost Storage',
    points: 5000,
    imgUrl: '/assets/rocket.png'
  },
  {
    id: 'invite',
    isDone: true,
    title: 'Invite 5 Friends',
    points: 5000,
    imgUrl: '/assets/link.png'
  },
  {
    id: 'upload',
    isDone: true,
    title: 'Upload 10 Files',
    points: 1000,
    imgUrl: '/assets/fire.png'
  },
  {
    id: 'followX',
    isDone: false,
    title: 'Follow Our X Account',
    points: 10000,
    imgUrl: '/assets/x.png',
    joinLink: 'https://x.com/ghostdrive_web3'
  },
  {
    id: 'youtube',
    isDone: false,
    title: 'Join Our YouTube Channel',
    points: 10000,
    imgUrl: '/assets/youtube.png',
    joinLink: 'https://www.youtube.com/@ghostdrive-web3'
  },
  {
    id: 'joinTG',
    isDone: false,
    title: 'Join Our Community',
    points: 10000,
    imgUrl: '/assets/telegram.png',
    joinLink: 'https://t.me/ghostdrive_web3_chat'
  },
  {
    id: 'wallet',
    isDone: false,
    title: 'Connect Wallet',
    points: 1000,
    imgUrl: '/assets/money.png'
  }
];
