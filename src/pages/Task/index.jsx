import { useState } from 'react';
import { Header } from '../../components/header';
// import img from '../../assets/images/test_img.png';
import styles from './styles.module.css';
import MobileDetect from 'mobile-detect';

const data = [
  { label: 'Invite friends', points: '+110 Points' },
  { label: 'Upload File', points: '+50 Points' },
  {
    label: 'Download GhostDrive App',
    points: '+100 Points',
    onClick: () => {
      const md = new MobileDetect(window.navigator.userAgent);
      const os = md.mobile();
      const url =
        os?.toLowerCase() === 'iphone'
          ? 'https://apps.apple.com/ua/app/ghostdrive-app/id6475002179'
          : 'https://play.google.com/store/apps/details?id=com.wise.data.ghostdrive';
      window.open(url);
    }
  }
];

export const TaskPage = () => {
  const [send, setSend] = useState(false);

  return (
    <div className={styles.container}>
      <Header label={'Task'} />
      <p className={styles.checkbox_header}>Daily Task</p>
      <div className={styles.checkbox_item}>
        <div className={styles.input_container}>
          {/*<input*/}
          {/*  className={styles.input}*/}
          {/*  type="checkbox"*/}
          {/*  id="send"*/}
          {/*  name="send"*/}
          {/*  checked={send}*/}
          {/*  onChange={(e) => setSend(e.target.checked)}*/}
          {/*/>*/}
          <label htmlFor="send">Send 0.01</label>
        </div>
        <p className={styles.point}>+50 Points</p>
      </div>
      <div className={styles.tasks}>
        <p className={styles.checkbox_header}>All Tasks</p>
        <ul className={styles.list}>
          {data.map((el, index) => (
            <li onClick={el?.onClick} key={index} className={styles.item}>
              <p className={styles.item_text}>{el.label}</p>
              <p className={styles.point}>{el.points}</p>
            </li>
          ))}
        </ul>
      </div>
      {/*<footer className={styles.footer}>*/}
      {/*  <img src={img} alt="footer_img" />*/}
      {/*</footer>*/}
    </div>
  );
};
