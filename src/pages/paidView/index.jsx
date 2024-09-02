import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { downloadFile } from 'gdgateway-client';
import CN from 'classnames';

import { Header } from './components/header';
import { Preview } from './components/preview';
import { ReactComponent as StarIcon } from '../../assets/star.svg';

import { getPaidShareFileEffect } from '../../effects/filesEffects';
import { getDownloadOTT } from '../../effects/filesEffects';
import { getFileCids } from '../../effects/file/getFileCid';
import { sendFileViewStatistic } from '../../effects/file/statisticEfect';

import { removeExtension } from '../../utils/string';

import styles from './styles.module.css';

const STEPS = {
  preview: 'preview',
  allowPreview: 'allowPreview',
  download: 'download'
}

export const PaidView = () => {
  const [file , setFile] = useState({});
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [step, setStep] = useState(STEPS.preview);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getPaidShareFileEffect(id)
        .then(({data}) => {
          const shareFile = { ...data };
          delete shareFile.file;
          setFile({ ...data.file, payShare: shareFile });
        })
        .catch(() => {console.warn('cannot find file')})
    }
  }, [id])

  useEffect(() => {
    if (file.slug) { getContent() }
  }, [file])

  const getContent = async () => {
    try {
      await sendFileViewStatistic(file.slug);
      const cidData = await getFileCids({ slug: file.slug });
      const {
        data: {
          jwt_ott,
          user_tokens: { token: oneTimeToken },
          gateway,
          upload_chunk_size
        }
      } = await getDownloadOTT([{ slug: file.slug }]);

      const blob = await downloadFile({
        file,
        oneTimeToken,
        endpoint: gateway.url,
        isEncrypted: false,
        uploadChunkSize:
          upload_chunk_size[file.slug] || gateway.upload_chunk_size,
        cidData,
        jwtOneTimeToken: jwt_ott
      });
      if (blob) {
        const realBlob = new Blob([blob]);
        const url = URL.createObjectURL(realBlob);
        if (file.extension === 'svg') {
          const text = await realBlob.text();
          setFileContent(text);
          setLoading(false);
          return;
        }
        setFileContent(url);
        setLoading(false);
        return;
      }
    } catch (error) {
      setLoading(false);
      console.warn(error);
    }
  };

  const onShowFullContent = () => {
    if (step === STEPS.preview) {
      setStep(STEPS.fullPreview);
    }
  }

  const onFullscreen = () => {
    setFullscreen(!fullscreen);
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        {fullscreen && (
          <h3 className={CN(styles.title, styles.secondTitle)}>{removeExtension(file.name)}</h3>
        )}
        <Preview
          allowPreview={step !== STEPS.preview}
          file={file}
          fileContent={fileContent}
          fullscreen={fullscreen}
          onFullscreen={onFullscreen}
        />
        <div className={fullscreen && styles.hide_detail}>
          <div className={styles.description}>
            <h4>About</h4>
            <p>{file?.payShare?.description}</p>
          </div>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <h5>Total views</h5>
              <p>{file?.entry_statistic?.viewed}</p>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.statItem}>
              <h5>Starts</h5>
              <p>{file?.entry_statistic?.downloaded}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onShowFullContent}
        className={styles.payButton}
      >
        <p className={styles.payButton_text}>Pay per view</p>
        <p className={styles.payButton_price}>
          <span>{file?.payShare?.price_view}</span>
          <StarIcon width='20' height='20' viewBox="0 0 22  22" />
        </p>
      </button>
    </div>
  )
}
