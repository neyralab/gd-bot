import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_TARIFFS_NAMES } from '../upgradeStorage';

import { Header } from '../../components/header';
import { Button } from '../../components/button';
import { FilesInfo } from '../../components/filesInfo';
import { InfoBox } from '../../components/info';
import { Range } from '../../components/range';
import styles from './styles.module.css';
import { useBalance } from '../../hooks/useBalance';

export const Balance = () => {
  const balance = useBalance();
  const { workspacePlan } = useSelector((state) => state.workspace);
  const navigate = useNavigate();

  const normalizedSize = useMemo(() => {
    console.log({ workspacePlan: workspacePlan });
    return DEFAULT_TARIFFS_NAMES[workspacePlan?.storage];
  }, [workspacePlan?.storage]);

  const onUploadFile = useCallback(() => {
    navigate('/file-upload');
  }, []);

  const onUpgradeFile = useCallback(() => {
    navigate('/upgrade');
  }, []);

  return (
    <div className={styles.container}>
      <Header label="Point Balance" />
      <InfoBox size={normalizedSize} />
      <Range />
      <FilesInfo balance={balance} />
      <div>
        <p className={styles.mainText}>
          Boost Your Storage, Multiply Your Points!
        </p>
        <p className={styles.text}>
          Earn more by uploading 100 GB of files and see your points increase by
          5 times! The more files you store, the more points you will earn.
          Upgrade your storage today to maximize your points. 
        </p>
      </div>
      <footer className={styles.footer}>
        <Button
          label="Upload file"
          onClick={onUploadFile}
          className={styles.blue_btn}
        />
        <Button
          label="Upgrade storage"
          onClick={onUpgradeFile}
          className={styles.white_btn}
        />
      </footer>
    </div>
  );
};
