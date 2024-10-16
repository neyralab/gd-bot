import { useNavigate } from 'react-router-dom';
import { ReactComponent as RectIcon } from '../../../../public/assets/assistant/neon-rect.svg';
import { ReactComponent as TriangleIcon } from '../../../../public/assets/assistant/neon-triangle.svg';
import { ReactComponent as CircleIcon } from '../../../../public/assets/assistant/neon-circle.svg';

import styles from './TemporaryControls.module.scss';

export default function TemporaryControls() {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/start');
  }

  const goToDrive = () => {
    navigate('/drive');
  }

  const goToGame = () => {
    navigate('/game-3d');
  }

  return (
    <div className={styles.controls}>
      <button className={styles['navigate-button']} onClick={goToDrive}>
        <RectIcon width='100%' height='100%' viewBox="0 -6 60 70" />
      </button>
      <button className={styles['main-button']}>
        <CircleIcon width='100%' height='100%' viewBox="0 4 150 150" />
      </button>
      <button className={styles['navigate-button']} onClick={goToGame}>
        <TriangleIcon width='100%' height='100%' viewBox="7 0 60 70" />
      </button>
    </div>
  );
}
