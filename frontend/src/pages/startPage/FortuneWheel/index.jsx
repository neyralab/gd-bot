import React, { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CN from 'classnames';

import NavigatItem from '../Navigator/NavigatItem';
import { ReactComponent as WheelIcon } from '../assets/wheel.svg';
import FortuneWheelModal from '../../../components/FortuneWheelModal/FortuneWheelModal';

import styles from '../Navigator/Navigator.module.scss';

export default function FortuneWheel({  }) {
  const fortuneWheelModalRef = useRef(null);

  const openFortuneWheel = () => {
    fortuneWheelModalRef.current.open();
  };

  const NAVIGATION = useMemo(
    () => [
      {
        id: 1,
        name: 'Spin & Win',
        icon: <WheelIcon />,
        html: <span className={styles.actionBtn}>Spin</span>,
        onClick: () => {openFortuneWheel()}
      }
    ],
    []
  );

  return (
    <ul className={CN(styles['navigator'], styles['to-appear'])}>
      {NAVIGATION.map(({ id, name, icon, html, onClick }) => (
        <NavigatItem
          key={id}
          name={name}
          icon={icon}
          html={html}
          onClick={onClick}
        />
      ))}
      <FortuneWheelModal ref={fortuneWheelModalRef} />
    </ul>
  );
}
