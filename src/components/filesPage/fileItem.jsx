import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TelegramShareButton } from "react-share";

import moment from "moment";
import cn from "classnames";

import { selectFileView } from "../../store/reducers/filesSlice";
import {
  getFilePreviewEffect,
  updateShareEffect,
} from "../../effects/filesEffects";
import videoFileExtensions from "../../config/video-file-extensions";
import imageFileExtensions, {
  imageMediaTypesPreview,
} from "../../config/image-file-extensions";

import CustomFileIcon from "../customFileIcon";
import CustomFileSmallIcon from "../customFileIcon/CustomFileSmallIcon";
import { ReactComponent as ShareArrowIcon } from "../../assets/arrow_share.svg";

import style from "./style.module.css";

export const FileItem = ({ file, callback, isFileChecked }) => {
  const view = useSelector(selectFileView);
  const [preview, setPreview] = useState(null);
  const url = `https://dev.ghostdrive.com/file/${file.slug}?is_telegram=true`;
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

  const ShareButton = (
    <TelegramShareButton
      url={url}
      title={`Tap this link to see the file "${file.name}"`}
      className={style.shareButton}
      onClick={onShareClick}>
      <ShareArrowIcon />
    </TelegramShareButton>
  );

  return (
    <>
      {view === "grid" ? (
        <li
          className={style.fileWrapper}
          id={file.id}
          onClick={() => callback(file)}>
          <input
            className={style.checkbox}
            type="checkbox"
            checked={isFileChecked(file.id)}></input>
          {ShareButton}
          <div className={style.previewWrapper}>
            {preview ? (
              <img
                src={preview}
                alt={file.name}
                className={style.previewImage}
              />
            ) : (
              <CustomFileIcon
                extension={file.extension}
                color={file.color}
                dateCreated={file.created_at}
              />
            )}
          </div>
          <div className={style.info}>
            <p className={style.info__name}>{file.name}</p>
            <p className={style.info__date}>{formattedDate(file.created_at)}</p>
          </div>
        </li>
      ) : (
        <li
          className={cn(style.options__item, style.fileItem)}
          onClick={() => callback(file)}>
          <input
            className={cn(style.checkbox, style.checkbox__right)}
            type="checkbox"
            checked={isFileChecked(file.id)}></input>
          {ShareButton}
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
        </li>
      )}
    </>
  );
};
