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
    id: 'JOIN_INSTAGRAM',
    isDone: false,
    title: 'Join our Instagram',
    translatePath: 'earn.joinInstagram',
    points: 0,
    imgUrl: '/assets/instagram.png',
    joinLink: 'https://www.instagram.com/ghostdrive_web3?igsh=MWwxeTkxa25sOGZtYQ=='
  },
  {
    id: 'JOIN_TG_NEWS_CHANNEL',
    isDone: false,
    title: 'Join Our News Channel',
    translatePath: 'earn.joinNewsTg',
    points: 0,
    imgUrl: '/assets/telegram.png',
    joinLink: 'https://t.me/ghostdrive_web3'
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
  },
  {
    id: 'JOIN_GITHUB',
    isDone: false,
    title: 'Join our Github',
    translatePath: 'earn.joinGit',
    points: 0,
    imgUrl: '/assets/github.png',
    joinLink: 'https://github.com/neyralab'
  },
  {
    id: 'WATCH_VIDEO',
    isDone: false,
    title: 'Watch video',
    translatePath: 'earn.watchVideo',
    points: 0,
    imgUrl: '/assets/youtube.png',
    joinLink: 'https://youtu.be/EHDzXihUUbc'
  },
];
export const tasksText = {
  UPLOAD_FILE_FREE: 'Upload file',
  STORAGE_PURCHASE: 'Storage purchase',
  STORAGE_PURCHASE_BY_REFERRAL: 'Storage purchase by referral',
  REFERRAL_SIGNUP: 'Active referral signup',
  DOWNLOAD_APP: 'Download Ghost Drive Аpp and Log In Via Telegram',
  WALLET_CONNECTION: 'Connect a wallet',
  INVITE_5_FRIENDS: 'Invite 5 friends',
  UPLOAD_10_FILES: 'Upload 10 files',
  TAP_LEVEL_1: 'Extra bonus for reaching the 1 tapping level',
  TAP_LEVEL_2: 'Extra bonus for reaching the 2 tapping level',
  TAP_LEVEL_3: 'Extra bonus for reaching the 3 tapping level',
  JOIN_TG_CHANNEL: 'Join our TG channel',
  JOIN_TG_NEWS_CHANNEL: 'Join our TG news channel',
  JOIN_TWITTER: 'Follow our X account',
  JOIN_YOUTUBE: 'Join our YouTube channel',
  TAP_LEVEL_4: 'Extra bonus for reaching the 4 tapping level',
  TAP_LEVEL_5: 'Extra bonus for reaching the 5 tapping level',
  TAP_LEVEL_6: 'Extra bonus for reaching the 6 tapping level',
  TAP_LEVEL_7: 'Extra bonus for reaching the 7 tapping level',
  INVITE_25_PREMIUM_FRIENDS: 'Invite 25 Premium friends',
  JOIN_INSTAGRAM: 'Join our Instagram channel',
  JOIN_GITHUB: 'Join our Github channel',
  TAP_LEVEL_8: 'Extra bonus for reaching the 8 tapping level',
  TAP_LEVEL_8: 'Extra bonus for reaching the 8 tapping level',
  WATCH_VIDEO: 'Watch video'
}
