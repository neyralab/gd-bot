import React from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';

import Header from './components/Header';
import { ReactComponent as NoiseIcon } from './assets/noise.svg';
import PlanetIcon from './assets/planet.webp';
import StarshipIcon from './assets/starship.webp';

import styles from './PPVModal.module.scss';

const Preloader = ({ onClose }) => {
  const { t } = useTranslation('drive');

  return (
    <>
      <Header leftText={t('ppv.back')} onClose={onClose} />
      <div className={styles.loader}>
        <div className={styles.preloader}>
          <h1 className={styles.preloader_title}>{t('ppv.wait')}</h1>
          <p className={styles.preloader_text}>{t('ppv.processing')}</p>
          <div className={styles.progress}>
            <CountUp
              className={styles.progress_counter}
              duration={6}
              end={100}
            />
            <span className={styles.progress_marker}>%</span>
          </div>
        </div>

        <div className={styles.loader_content}>
          <img className={styles.loader_planet} src={PlanetIcon} alt="Planet" />
          <div className={styles.loader_starship_wrapper}>
            <img
              className={styles.loader_starship}
              src={StarshipIcon}
              alt="Starship"
            />
          </div>
        </div>

        <NoiseIcon className={styles.loader_noise} />
      </div>
    </>
  );
};

export default Preloader;
