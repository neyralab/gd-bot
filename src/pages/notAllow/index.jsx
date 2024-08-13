import styles from './styles.module.css';

const link = [
  {
    name: 'x',
    title: 'X account',
    link: 'https://x.com/ghostdrive_web3',
    icon: "/assets/x.png"
  },
  {
    name: 'telegram',
    title: 'Telegram',
    link: 'https://t.me/ghostdrive_web3',
    icon: "/assets/telegram.png"
  },
  {
    name: 'instagram',
    title: 'Instagram',
    link: 'https://www.instagram.com/ghostdrive_web3?igsh=MWwxeTkxa25sOGZtYQ%3D%3D',
    icon: "/assets/instagram.png"
  },
  {
    name: 'github',
    title: 'GitHub',
    link: 'https://github.com/neyralab',
    icon: "/assets/github.png"
  },
];

const NotAllow = () => (
  <div className={styles.container}>
    <div className={styles.qrWrapper}>
      <img src="/assets/qr.svg" alt="" />
    </div>
    <div className={styles.info}>
      <div className={styles.detail}>
        <h2 className={styles.title}>Play on your mobile</h2>
        <h1 className={styles.text}>Best experienced on mobile</h1>
      </div>
      <div className={styles.socNetworks}>
        { link.map((item) => (
          <a
            href={item.link}
            className={styles.socNetwork}
          >
            <img
              src={item.icon}
              className={styles.socIcon}
              alt={item.title}
            />
            <span className={styles.socName}>{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default NotAllow;