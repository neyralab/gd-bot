import { useEffect, useState } from "react";

import moment from "moment";

import { getFilePreviewEffect } from "../../effects/filesEffects";
import imageFileExtensions, {
  imageMediaTypesPreview,
} from "../../config/image-file-extensions";
import videoFileExtensions from "../../config/video-file-extensions";

import CustomFileSmallIcon from "../customFileIcon/CustomFileSmallIcon";

import style from "./style.module.css";

export const FileItem = ({ file }) => {
  const [preview, setPreview] = useState(null);

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
    </li>
  );
};
