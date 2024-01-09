import React from "react";

import imageFileExtensions from "../../config/image-file-extensions";
import audioFileExtensions from "../../config/audio-file-extensions";
import videoFileExtensions from "../../config/video-file-extensions";

import videoDefaultImage from "./assets/smallFileIcons/video_default_content.png";
import audioDefaultImage from "./assets/smallFileIcons/audio_default_content.png";
import docDefaultImage from "./assets/smallFileIcons/doc_default_content.png";

import { ReactComponent as BaseIcon } from "./assets/smallFileIcons/baseBackground.svg";
import { ReactComponent as BaseDocBackground } from "./assets/smallFileIcons/docTypes_background.svg";
import { ReactComponent as PlayIcon } from "./assets/smallFileIcons/play.svg";
import { ReactComponent as LinksContent } from "./assets/smallFileIcons/LinksContent.svg";
import { ReactComponent as VaultContent } from "./assets/smallFileIcons/VaultContent.svg";
import { ReactComponent as PagesContent } from "./assets/smallFileIcons/PagesContent.svg";
import { ReactComponent as ZipContent } from "./assets/smallFileIcons/ZipContent.svg";
import { ReactComponent as NeyraContent } from "./assets/smallFileIcons/NeyraContent.svg";
import { ReactComponent as ImageContent } from "./assets/smallFileIcons/ImageContent.svg";

import style from "./style.module.css";

const CustomFileSmallIcon = ({ type }) => {
  const renderMediaFilesIcon = (image, className) => {
    return (
      <div className={style.smallMediaIconWrapper}>
        <BaseIcon />
        <img src={image} alt="default placeholder" className={className} />
        <PlayIcon />
      </div>
    );
  };

  const renderInternalFilesIcon = (icon) => {
    return (
      <div className={style.smallInternalIconWrapper}>
        <BaseIcon />
        {icon}
      </div>
    );
  };

  const renderDocFilesIcon = (type, color) => {
    return (
      <div className={style.smallDocIconWrapper}>
        <BaseDocBackground style={{ fill: color }} />
        <span>{type}</span>
        <img src={docDefaultImage} alt="default tab" />
      </div>
    );
  };

  if (imageFileExtensions.includes(`.${type}`)) {
    return renderInternalFilesIcon(<ImageContent />);
  }
  if (audioFileExtensions.includes(`.${type}`)) {
    return renderMediaFilesIcon(audioDefaultImage, style.audioImage);
  }
  if (videoFileExtensions.includes(`.${type}`)) {
    return renderMediaFilesIcon(videoDefaultImage, style.videoImage);
  }

  switch (type) {
    case "link":
      return renderInternalFilesIcon(<LinksContent />);
    case "neyra":
      return renderInternalFilesIcon(<NeyraContent />);
    case "pages":
      return renderInternalFilesIcon(<PagesContent />);
    case "zip":
      return renderInternalFilesIcon(<ZipContent />);
    case "vault":
      return renderInternalFilesIcon(<VaultContent />);

    case "css":
      return renderDocFilesIcon("css", "#CB7DFB");
    case "docx":
      return renderDocFilesIcon("docx", "#0F73EF");
    case "doc":
      return renderDocFilesIcon("doc", "#0F73EF");
    case "gdx":
      return renderDocFilesIcon("gdx", "#299DE6");
    case "html":
      return renderDocFilesIcon("html", "#AD32FA");
    case "odp":
      return renderDocFilesIcon("odp", "#FD380D");
    case "odt":
      return renderDocFilesIcon("odt", "#00BCE5");
    case "pdf":
      return renderDocFilesIcon("pdf", "#DC2216");
    case "php":
      return renderDocFilesIcon("php", "#55187A");
    case "ppt":
      return renderDocFilesIcon("ppt", "#FF710A");
    case "pptx":
      return renderDocFilesIcon("pptx", "#FD9D0D");
    case "txt":
      return renderDocFilesIcon("txt", "#0434E0");
    case "wpd":
      return renderDocFilesIcon("wpd", "#08E5DC");
    case "xlsm":
      return renderDocFilesIcon("xlsm", "#13611E");
    case "xlsx":
      return renderDocFilesIcon("xlsx", "#20B734");
    case "xml":
      return renderDocFilesIcon("xml", "#74D248");
    default:
      return renderDocFilesIcon(type, "#414244");
  }
};

export default CustomFileSmallIcon;
