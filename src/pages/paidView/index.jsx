import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { downloadFile } from 'gdgateway-client';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CN from 'classnames';

import Header from '../../components/ppvModal/components/Header';
import { Preview } from './components/preview';
import { ReactComponent as StarIcon } from '../../assets/star.svg';
import GhostLoader from '../../components/ghostLoader';

import {
  getPaidShareFileEffect,
  getDownloadOTT,
  // getFileStarStatistic
} from '../../effects/filesEffects';
import { getFileCids } from '../../effects/file/getFileCid';
import { makeInvoice } from '../../effects/paymentEffect';
import { uploadFileEffect } from '../../effects/uploadFileEffect';
import { sendFileViewStatistic } from '../../effects/file/statisticEfect';
import { selectPaymenttByKey } from '../../store/reducers/paymentSlice';
import { INVOICE_TYPE } from '../../utils/createStarInvoice';
import { getPreviewFileType } from '../../utils/preview';
import { sleep } from '../../utils/sleep';

import { removeExtension, addSlugHyphens } from '../../utils/string';

import styles from './styles.module.css';

const STEPS = {
  preview: 'preview',
  allowPreview: 'allowPreview',
  download: 'download'
}

const ESCAPE_CONTENT_DOWNLOAD = ['encrypt'];

export const PaidView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [file, setFile] = useState({});
  const { t } = useTranslation('drive');
  const [loading, setLoading] = useState(false);
  // const [fileStatistics, setFileStatistics] = useState({});
  const [expandDescription, setExpandDescription] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const user = useSelector((state) => state.user.data);
  const ppvPayment = useSelector(selectPaymenttByKey('pay_per_view'));
  const [fullscreen, setFullscreen] = useState(false);
  const [step, setStep] = useState(STEPS.preview);
  const { id } = useParams();

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getPaidShareFileEffect(addSlugHyphens(id));
        // const fileStat = await getFileStarStatistic(data?.data?.file?.slug);
        const shareFile = { ...data?.data };
        delete shareFile.file;
        setFile({ ...data?.data?.file, payShare: shareFile });
      } catch (error) {
        toast.error(t('ppv.fileAbsent'), { position: 'top-center'  })
      }
    }
    if (id) {
      init()
    }
  }, [id]);

  useEffect(() => {
    if (file?.slug) {
      const canPreview = getPreviewFileType(file, '   ');
      if (canPreview !== 'audio')
        setLoading(true);
      if (canPreview && !ESCAPE_CONTENT_DOWNLOAD.includes(canPreview)) {
        getContent();
      } else {
        setLoading(false);
      }
    }
  }, [file]);

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
        if (file.extension === 'svg' || file.extension === 'txt') {
          const text = await realBlob.text();
          setFileContent(text);
          setLoading(false);
          return;
        } else if (
          file.extension === 'pdf' ||
          file.extension === 'xls' ||
          file.extension === 'xlsx'
        ) {
          setFileContent(realBlob);
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

  const downloadContent = async () => {
    try {
      setDownloadLoading(true);
  
      let blob;
      if (['txt', 'svg', 'pdf', 'xls', 'xlsx'].includes(file.extension)) {
        blob = new Blob([fileContent], { type: file.mime });
      } else {
        const response = await fetch(fileContent);
        blob = await response.blob();
      }
  
      const uploadFile = new File([blob], file.name, { type: file.mime });
  
      await uploadFileEffect({ files: [uploadFile], dispatch });
      toast.success(t('ppv.saveSuccess'));
    } catch (error) {
      toast.error(t('ppv.saveError'));
    } finally {
      setDownloadLoading(false);
    }
  };

  const invoicePreviewCallback = async (result) => {
    try {
      if (result === 'paid') {
        await sleep(700);
        setStep(STEPS.allowPreview);
      } else {
        console.warn(`error: The payment was not completed. ${result}`)
      }
    } catch (error) {
      console.warn('error: ', error);
    }
  };

  const invoiceDownloadCallback = async (result) => {
    try {
      if (result === 'paid') {
        await sleep(700);
        setStep(STEPS.download);
        downloadContent();
      } else {
        console.warn(`error: The payment was not completed. ${result}`)
      }
    } catch (error) {
      console.warn('error: ', error);
    }
  };

  const showProcess = async () => {
    try {
      const input = `${ppvPayment.Type};0;${user.id};${file.id};${file.payShare.id}`;
      makeInvoice({
        input,
        dispatch,
        callback: invoicePreviewCallback,
        type: INVOICE_TYPE.ppv,
        theme: { multiplier: '', stars: file.payShare.price_view }
      });
    } catch (error) {
      console.warn(error);
    }
  }

  const downloadProcess = async () => {
    try {
      const input = `${ppvPayment.Type};0;${user.id};${file.id};${file.payShare.id}`;
      makeInvoice({
        input,
        dispatch,
        callback: invoiceDownloadCallback,
        type: INVOICE_TYPE.ppv,
        theme: { multiplier: '', stars: file.payShare.price_download }
      });
    } catch (error) {
      console.warn(error);
    }
  }

  const onShowFullContent = () => {
    if (step === STEPS.preview) {
      showProcess();
    } else if (step === STEPS.allowPreview && file.payShare.price_download && fileContent) {
      downloadProcess();
    } else if (fileContent) {
      downloadContent();
    }
  }

  const onFullscreen = () => {
    setFullscreen(!fullscreen);
  }

  const goBack = () => {
    navigate(-1);
  }

  const onExpandDescription = () => {
    setExpandDescription(true);
  }

  return (
    <div className={styles.container}>
      <Header leftText={t('ppv.back')} onClose={goBack} />
      <div className={styles.content}>
        {fullscreen && (
          <h3 className={CN(styles.title, styles.secondTitle)}>{removeExtension(file.name)}</h3>
        )}
        { loading ? (
          <div className={styles.preloader}>
            <GhostLoader />
          </div>
        ) : (
        <Preview
          allowPreview={step !== STEPS.preview}
          file={file}
          fileContent={fileContent}
          fullscreen={fullscreen}
          onFullscreen={onFullscreen}
        />
        )}
        <div className={fullscreen && styles.hide_detail}>
          <div
            onClick={onExpandDescription}
            className={CN(styles.description, expandDescription && styles.descriptionExpanded)}
          >
            <h4>{t('ppv.about')}</h4>
            <p>{file?.payShare?.description}</p>
          </div>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <h5>{t('ppv.totalViews')}</h5>
              <p>{file?.entry_statistic?.viewed}</p>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.statItem}>
              <h5>{t('ppv.starts')}</h5>
              <p>{file?.entry_statistic?.downloaded}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onShowFullContent}
        className={CN(styles.payButton, step === STEPS.download && styles.payButtonDownload)}
        disabled={loading || downloadLoading}
      >
        <p className={styles.payButton_text}>
          {step === STEPS.preview ? t('ppv.ppv') : t('ppv.downloadToStorage')}
        </p>
        <p className={styles.payButton_price}>
          <span>
            {step === STEPS.preview ? file?.payShare?.price_view : file?.payShare?.price_download}
          </span>
          <StarIcon width='20' height='20' viewBox="0 0 22  22" />
        </p>
      </button>
    </div>
  );
}
