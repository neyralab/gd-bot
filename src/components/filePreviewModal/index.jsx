import { useEffect, useMemo, useState, useRef } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { TelegramShareButton } from 'react-share';
import { useTranslation } from 'react-i18next';
import { downloadFile } from 'gdgateway-client';

import {
  handleFilePreviewModal,
  selectIsFilePreviewOpen
} from '../../store/reducers/modalSlice';
import {
  selecSelectedFile,
  setSelectedFile
} from '../../store/reducers/filesSlice';

import {
  getDownloadOTT,
  updateFileFavoriteEffect
} from '../../effects/filesEffects';
import { getFileCids } from '../../effects/file/getFileCid';
import { sendFileViewStatistic } from '../../effects/file/statisticEfect';
import { getPreviewFileType } from '../../utils/preview';
import { generateSharingLink } from '../../utils/generateSharingLink';
import { vibrate } from '../../utils/vibration';

import GhostLoader from '../ghostLoader';
import PreviewContent from './previewContent';
import MetaPopup from './metaPopup';

import { ReactComponent as FavIcon } from './assets/like.svg';
import { ReactComponent as InfoIcon } from './assets/info.svg';
import { ReactComponent as SendIcon } from './assets/send.svg';

import style from './styles.module.scss';
import { vibrate } from '../../utils/vibration';

Modal.setAppElement('#root');

const ESCAPE_CONTENT_DOWNLOAD = ['audio', 'encrypt'];

export const FilePreviewModal = () => {
  const { t } = useTranslation('drive');
  const wrapper = useRef(null);
  const isOpen = useSelector(selectIsFilePreviewOpen);
  const file = useSelector(selecSelectedFile);
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState(false);
  const [infoPopupOpen, setInfoPopupOpen] = useState(false);
  const dispatch = useDispatch();

  const isFavorite = file?.user_favorites?.length > 0;
  const url = useMemo(() => {
    return generateSharingLink(file.slug);
  }, [file]);

  const onClose = () => {
    vibrate();
    dispatch(setSelectedFile({}));
    dispatch(handleFilePreviewModal(false));
  };

  useEffect(() => {
    if (file?.slug) {
      const canPreview = getPreviewFileType(file, '   ');
      setLoading(true);
      if (canPreview && !ESCAPE_CONTENT_DOWNLOAD.includes(canPreview)) {
        getContent();
      } else {
        setLoading(false);
      }
    }
  }, [file?.slug]);

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

  const toggleFavorite = () => {
    vibrate();
    updateFileFavoriteEffect(file.slug, dispatch);
  };

  const actions = [
    {
      id: 1,
      icon: <FavIcon color={isFavorite ? '#24ADFA' : '#fff'} />,
      action: toggleFavorite
    },
    {
      id: 2,
      icon: <InfoIcon />,
      action: () => {
        vibrate();
        setInfoPopupOpen(true);
      }
    },
    {
      id: 3,
      icon: (
        <TelegramShareButton
          url={url}
          title={`${t('dashbord.linkToFile')} "${file.name}"`}
          className={style.shareOption}>
          <SendIcon />
        </TelegramShareButton>
      ),
      action: () => {}
    }
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        overlayClassName={style.overlay}
        className={style.modal}>
        {loading ? (
          <div className={style.loadingPreview}>
            <GhostLoader />
          </div>
        ) : (
          <div className={style.wrapper} ref={wrapper}>
            <button
              className={style.back}
              onClick={onClose}>
              Back
            </button>{' '}
            <PreviewContent
              wrapper={wrapper}
              fileContent={fileContent}
              file={file}
            />
            <div className={style.info}>
              <h3>{file.name}</h3>
              {file?.user && (
                <span>
                  {file?.user?.displayed_name || file?.user?.username}
                </span>
              )}
            </div>
            <div className={style.actions}>
              {actions.map(({ id, icon, action }) => (
                <div key={id} onClick={action}>
                  {icon}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
      <MetaPopup
        file={file}
        setInfoPopupOpen={setInfoPopupOpen}
        infoPopupOpen={infoPopupOpen}
      />
    </>
  );
};
