import React from 'react';

import moment from 'moment';

import imageFileExtensions from '../../config/image-file-extensions';
import audioFileExtensions from '../../config/audio-file-extensions';
import videoFileExtensions from '../../config/video-file-extensions';

import CustomIconWrapper from './assets/CustomIconWrapper';
import defaultContent from './assets/IconDefaultContent.png';
import videoDefaultContent from './assets/VideoContent.png';
import audioDefaultContent from './assets/AudioContent.png';

import { ReactComponent as PlayIcon } from './assets/play.svg';
import { ReactComponent as LinkContent } from './assets/LinkContent.svg';
import { ReactComponent as VaultContent } from './assets/VaultContent.svg';
import { ReactComponent as PagesContent } from './assets/PagesContent.svg';
import { ReactComponent as ZipContent } from './assets/ZipContent.svg';
import { ReactComponent as NeyraContent } from './assets/NeyraContent.svg';
import { ReactComponent as ImageContent } from './assets/ImageContent.svg';

import style from './style.module.scss';

const CustomFileIcon = ({ extension, color, dateCreated, onPlayClick }) => {
  const renderSpecialInternalFileIcon = (type, icon) => {
    return (
      <div className={style.specialBigIconContent}>
        <span className={style.iconText}>{type}</span>
        <div className={style.iconPreview}>{icon}</div>
      </div>
    );
  };

  const renderDocumentsFileIcon = (type, color) => {
    const formattedDate = moment.unix(dateCreated).format('MM.DD.HH:mm');
    return (
      <div className={style.docBigIconContent}>
        <span className={style.docCreationDate}>created</span>
        <span className={style.docCreationDate}>{formattedDate}</span>
        <img src={defaultContent} alt="default tab content" />
        <span style={{ backgroundColor: color }} className={style.docType}>
          {type}
        </span>
      </div>
    );
  };

  const renderMediaTypeFile = (type, image) => {
    return (
      <div className={style.mediaBigIconContent}>
        <span>{type}</span>
        <img
          src={image}
          alt="placeholder"
          className={style[`${type}BigImage`]}
        />
        <PlayIcon className={style[`${type}PlayIcon`]} onClick={onPlayClick} />

        {type === 'audio' && <span>4:54</span>}
      </div>
    );
  };

  const renderContent = () => {
    if (imageFileExtensions.includes(`.${extension}`)) {
      return renderSpecialInternalFileIcon('image', <ImageContent />);
    }
    if (audioFileExtensions.includes(`.${extension}`)) {
      return renderMediaTypeFile('audio', audioDefaultContent);
    }
    if (videoFileExtensions.includes(`.${extension}`)) {
      return renderMediaTypeFile('video', videoDefaultContent);
    }
    switch (extension) {
      case 'link':
        return renderSpecialInternalFileIcon('links', <LinkContent />);
      case 'pages':
        return renderSpecialInternalFileIcon('pages', <PagesContent />);
      case 'vault':
        return renderSpecialInternalFileIcon('vault', <VaultContent />);
      case 'zip':
        return renderSpecialInternalFileIcon('zip', <ZipContent />);
      case 'neyra':
        return renderSpecialInternalFileIcon('neyra', <NeyraContent />);

      case 'css':
        return renderDocumentsFileIcon('css', '#CB7DFB');
      case 'docx':
        return renderDocumentsFileIcon('docx', '#0F73EF');
      case 'doc':
        return renderDocumentsFileIcon('doc', '#0F73EF');
      case 'gdx':
        return renderDocumentsFileIcon('gdx', '#299DE6');
      case 'html':
        return renderDocumentsFileIcon('html', '#AD32FA');
      case 'odp':
        return renderDocumentsFileIcon('odp', '#FD380D');
      case 'odt':
        return renderDocumentsFileIcon('odt', '#00BCE5');
      case 'pdf':
        return renderDocumentsFileIcon('pdf', '#DC2216');
      case 'php':
        return renderDocumentsFileIcon('php', '#55187A');
      case 'ppt':
        return renderDocumentsFileIcon('ppt', '#FF710A');
      case 'pptx':
        return renderDocumentsFileIcon('pptx', '#FD9D0D');
      case 'txt':
        return renderDocumentsFileIcon('txt', '#0434E0');
      case 'wpd':
        return renderDocumentsFileIcon('wpd', '#08E5DC');
      case 'xlsm':
        return renderDocumentsFileIcon('xlsm', '#13611E');
      case 'xlsx':
        return renderDocumentsFileIcon('xlsx', '#20B734');
      case 'xml':
        return renderDocumentsFileIcon('xml', '#74D248');
      default:
        return renderDocumentsFileIcon(extension, '#414244');
    }
  };

  return (
    <div className={style.bigIconWrapper}>
      <CustomIconWrapper className={style.bigIconBackground} color={color} />
      {renderContent()}
    </div>
  );
};

export default CustomFileIcon;
