import React, { useMemo } from 'react';
import { TelegramShareButton } from 'react-share';
import { useTranslation } from 'react-i18next';
import { ReactComponent as SendIcon } from '../../../../../assets/send.svg';
import { generateSharingLink } from '../../../../../utils/generateSharingLink';
import styles from '../DefaultFileActions.module.scss';

export default function TelegramShareAction({ file }) {
  const { t } = useTranslation('drive');
  const url = useMemo(() => {
    return generateSharingLink(file.slug);
  }, [file]);

  return (
    <TelegramShareButton
      url={url}
      title={`${t('dashbord.linkToFile')} "${file.name}"`}
      className={styles.action}>
      <SendIcon />
    </TelegramShareButton>
  );
}
