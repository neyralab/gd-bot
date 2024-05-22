import { useEffect, useState } from "react";
import { TelegramShareButton } from "react-share";

import moment from "moment";

import {
  getFilePreviewEffect,
  updateShareEffect,
} from "../../effects/filesEffects";
import imageFileExtensions, {
  imageMediaTypesPreview,
} from "../../config/image-file-extensions";
import videoFileExtensions from "../../config/video-file-extensions";

import CustomFileSmallIcon from "../customFileIcon/CustomFileSmallIcon";
import { ReactComponent as ShareArrowIcon } from "../../assets/arrow_share.svg";

import style from "./style.module.css";

export const FileItem = ({ file }) => {
  const [preview, setPreview] = useState(null);
  const url = `https://neyratech.com/file/${file.slug}?is_telegram=true`;

  const formattedDate = (dateCreated) =>
    moment.unix(dateCreated).format("MMM DD, YYYY, h:mma");

  useEffect(() => {
    if (
      (imageMediaTypesPreview.includes(file.mime) &&
        imageFileExtensions.includes(`.${file.extension}`)) ||
      videoFileExtensions.includes(`.${file.extension}`)
    ) {
      getFilePreviewEffect(file.slug, null, file.extension).then((res) => {
        setPreview(res);
      });
    }
  }, []);

  const onShareClick = async (e) => {
    e.stopPropagation();
    await updateShareEffect(file.slug);
  };

  return (
    <li className={`${style.options__item} ${style.fileItem}`} key={file.id}>
      <div className={style.fileItem__icon}>
        {preview ? (
          <img src={preview} alt="file" width={30} height={40} />
        ) : (
          <CustomFileSmallIcon type={file.extension} />
        )}
      </div>
      <div>
        <h3>{file.name}</h3>
        <p>{formattedDate(file.created_at)}</p>
      </div>
      <TelegramShareButton
        url={url}
        title={`Tap this link to see the file "${file.name}"`}
        className={style.shareButton}
        onClick={onShareClick}>
        <ShareArrowIcon />
      </TelegramShareButton>
    </li>
  );
};
