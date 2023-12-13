import { useNavigate } from "react-router-dom";

import { ReactComponent as UploadIcon } from "../../assets/upload.svg";
import { ReactComponent as UpgradeIcon } from "../../assets/upgrade.svg";
import { ReactComponent as GhostIcon } from "../../assets/ghost.svg";
import { ReactComponent as ArrowIcon } from "../../assets/arrow_right.svg";
import { ReactComponent as CircleCloudIcon } from "../../assets/cloud_circle.svg";
import { ReactComponent as CirclePictureIcon } from "../../assets/picture_circle.svg";
import { ReactComponent as FileIcon } from "../../assets/file_draft.svg";
import { ReactComponent as SearchIcon } from "../../assets/search.svg";
import uploadLogo from "../../assets/upload_logo.png";
import placeholder_image from "../../assets/upload_bg.png";

import style from "./style.module.css";

export const StartPage = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <div className={`${style.container} ${style.uploadContainer}`}>
      <header className={style.header}>
        <button className={style.header__cancelBtn} onClick={onClose}>
          Cancel
        </button>
        <h2
          className={`${style.uploadContainer__title} ${style.centeredTitle}`}>
          GhostDrive
        </h2>
      </header>
      <section className={style.wrapper}>
        <div className={style.wrapper__content}>
          <img src={uploadLogo} alt="logo" width={93} height={93} />
          <h2 className={style.wrapper__content__title}>
            Advanced File System
          </h2>
          <p className={style.wrapper__content__description}>
            No more data duplication; everything is on the p2p network in web3.
          </p>
        </div>
        <ul className={style.options}>
          <li className={style.options__item}>
            <button
              onClick={() => {
                navigate("/file-upload");
              }}
              className={`${style.options__item__button} ${style.uploadOptionButton}`}>
              <UploadIcon /> Upload File{" "}
              <ArrowIcon className={style.arrowIcon} />
            </button>
          </li>
          <li className={style.options__item}>
            <button
              onClick={() => {
                navigate("/ghostdrive-upload");
              }}
              className={`${style.options__item__button} ${style.uploadOptionButton}`}>
              <GhostIcon /> From Ghostdrive{" "}
              <ArrowIcon className={style.arrowIcon} />
            </button>
          </li>
          <li className={style.options__item}>
            <button
              onClick={() => {
                navigate("/upgrade");
              }}
              className={`${style.options__item__button} ${style.uploadOptionButton}`}>
              <UpgradeIcon /> Upgrade Storage{" "}
              <ArrowIcon className={style.arrowIcon} />
            </button>
          </li>
        </ul>
      </section>
    </div>
  );
};

export const FilesSystemPage = () => {
  const navigate = useNavigate();

  const onBackButtonClick = () => navigate(-1);

  const filesLength = 0;

  return (
    <div className={style.container}>
      <header className={style.filesHeader}>
        <button
          className={style.header__cancelBtnBlue}
          onClick={onBackButtonClick}>
          Back
        </button>
        <h2 className={`${style.header__title} ${style.centeredTitle}`}>
          Files System
        </h2>
        <button>
          <SearchIcon />
        </button>
      </header>
      <section className={style.wrapper}>
        <ul className={style.options}>
          <li className={style.options__item}>
            <button
              className={`${style.options__item__button} ${style.selectFileButton}`}>
              <CirclePictureIcon /> From Gallery{" "}
              <ArrowIcon className={style.arrowIcon} />
            </button>
          </li>
          <li className={style.options__item}>
            <button
              className={`${style.options__item__button} ${style.selectFileButton}`}>
              <CircleCloudIcon /> From Files{" "}
              <ArrowIcon className={style.arrowIcon} />
            </button>
          </li>
        </ul>
        <p className={style.wrapper__list__title}>Recently sent files</p>
        {filesLength ? (
          <ul className={`${style.options} ${style.filesList}`}>
            <li className={`${style.options__item} ${style.fileItem}`}>
              <div className={style.fileItem__icon}>
                <img
                  src={placeholder_image}
                  alt="file"
                  width={30}
                  height={40}
                />
              </div>
              <div>
                <h3>File name</h3>
                <p>Mar 21, 2021, 3:30pm</p>
              </div>
            </li>
          </ul>
        ) : (
          <div className={style.emptyFilesPage}>
            <FileIcon />
            <h2 className={style.emptyFilesPage_title}>Files not found</h2>
            <p className={style.emptyFilesPage_desc}>
              This page is empty. You have no uploaded files.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
