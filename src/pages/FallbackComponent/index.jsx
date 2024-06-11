import s from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const FallbackComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/start');
  }, [navigate]);

  return <div className={s.container}></div>;
};
