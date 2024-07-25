import { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';

import {
  selectAllWorkspaces,
  selectCurrentWorkspace
} from '../../store/reducers/workspaceSlice';
import { getAllTasks } from '../../effects/balanceEffect';
import { DEFAULT_TARIFFS_NAMES } from '../upgradeStorage';
import { fromByteToGb } from '../../utils/storage';
import { transformSize } from '../../utils/transformSize';
import { isDevEnv } from '../../utils/isDevEnv';

import GhostLoader from '../../components/ghostLoader';
import Nodes from './Nodes/index';
import { ReactComponent as LogoIcon } from '../../assets/ghost.svg';
import { ReactComponent as TapIcon } from './assets/tap.svg';
import { DisconnectWalletModal } from '../../components/disconnectWalletModal';
import BannerSource from '../../assets/node-banner.webp';
import PointCounter from './PointCounter/PointCounter';
import NavigatItem from './Navigator/NavigatItem';
// import CardsSlider from '../../components/CardsSlider/CardsSlider';
// import getSliderItems from './SliderItem/sliderItems';
// import SliderItem from './SliderItem/SliderItem';
import Navigator from './Navigator/Navigator';

import style from './style.module.css';
import navigatorStyle from './Navigator/Navigator.module.css';

export const StartPage = ({ tariffs }) => {
  const { t } = useTranslation('system');
  const [tasks, setTasks] = useState([]);
  const [disconnectWalletModal, setDisconnectWalletModal] = useState(false);
  const allWorkspaces = useSelector(selectAllWorkspaces);
  const currentWorkspace = useSelector(selectCurrentWorkspace);
  const user = useSelector((state) => state?.user?.data);
  const navigate = useNavigate();
  const isDev = isDevEnv();

  const getTasks = useCallback(async () => {
    try {
      const allTasks = await getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const storage = useMemo(() => {
    const size = DEFAULT_TARIFFS_NAMES[user?.space_total] || '1GB';
    return {
      size,
      multiplier:
        tariffs?.find((el) => el.storage === user?.space_total)
          ?.multiplicator || 1
    };
  }, [user?.space_total, tariffs]);

  const human = useMemo(() => {
    if (!user) return;
    const { space_total, space_used } = user;
    const percent = Math.round(
      (Number(space_used) / space_total + Number.EPSILON) * 100
    );

    return {
      total: `${transformSize(String(space_total))}`,
      used: `${fromByteToGb(space_used)}`,
      percent: { label: `${percent || 1}%`, value: percent }
    };
  }, [user]);

  // const sliderItems = useMemo(() => getSliderItems(storage.size), [storage])

  // const slides = useMemo(() => {
  //   return sliderItems.map((el) => {
  //     return { id: el.id, html: <SliderItem key={el?.id} item={el} /> };
  //   });
  // }, [sliderItems]);

  if (!allWorkspaces && !currentWorkspace) {
    return (
      <div className={style.home_container}>
        <GhostLoader startup />
      </div>
    );
  }

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <div className={`${style.container}`}>
      {/* <header className={style.header}>
        <CardsSlider items={slides} timeout={15000} />
      </header> */}
      <div
        className={CN(
          style.card,
          style.banner,
          style['to-appear'],
          style['to-appear_active']
        )}>
        <img src={BannerSource} alt="banner" />
        <div className={style['banner-content']}>
          <div className={style['banner-header']}>
            <div className={style['banner-header_img']}>
              <LogoIcon />
            </div>
            <h1>{transformSize(user.space_total)}</h1>
          </div>
        </div>
      </div>
      <PointCounter
        points={user?.points}
        className={style[`point-counter`]}
        rank={user?.rank}
      />
      <Navigator
        storage={storage}
        human={human}
        openDisconnectModal={setDisconnectWalletModal}
        tasks={tasks}
      />
      <ul className={CN(navigatorStyle['navigator'], navigatorStyle['to-appear'])}>
        <NavigatItem
          name={t('dashboard.mining')}
          icon={<TapIcon />}
          html={(<span className={CN(navigatorStyle.actionBtn, navigatorStyle.playBtn)}>
            {t('dashboard.play')}
          </span>)}
          onClick={() => navigate('/game-3d')}
        />
      </ul>
      {isDev && <Nodes wallet={user?.wallet} />}
      <footer className={style.footer}>
        <p className={style['footer-text']}>
          <span
            onClick={() => {
              openInNewTab('https://play.ghostdrive.com');
            }}>
            GhostDrive.com
          </span>
          . {t('dashboard.howEarn')}{' '}
        </p>
      </footer>
      {disconnectWalletModal && (
        <DisconnectWalletModal
          isOpen={disconnectWalletModal}
          onClose={() => setDisconnectWalletModal(false)}
        />
      )}
    </div>
  );
};
