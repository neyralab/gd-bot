import { useNavigate } from "react-router-dom";

import { ReactComponent as UploadIcon } from "../../assets/upload.svg";
import { ReactComponent as UpgradeIcon } from "../../assets/upgrade.svg";
import { ReactComponent as GhostIcon } from "../../assets/ghost.svg";
import { ReactComponent as DownloadIcon } from "../../assets/download.svg";
import { ReactComponent as ArrowIcon } from "../../assets/arrow_right.svg";
import { ReactComponent as CircleCloudIcon } from "../../assets/cloud_circle.svg";
import { ReactComponent as CircleLogoIcon } from "../../assets/logo_circle.svg";
import { ReactComponent as CirclePictureIcon } from "../../assets/picture_circle.svg";
import uploadLogo from "../../assets/upload_logo.png";
import welcomeLogo from "../../assets/welcome_logo.png";
import placeholder_image from "../../assets/upload_bg.png";

import style from "./style.module.css";

export const WelcomePage = () => {
  const navigate = useNavigate();
  return (
    <div className={`${style.container} ${style.welcomeContainer}`}>
      <header className={style.header}>
        <h2 className={style.header__title}>GhostDrive</h2>
      </header>
      <section className={style.wrapper}>
        <div className={style.wrapper__content}>
          <img src={welcomeLogo} alt="logo" width={93} height={93} />
          <h2 className={style.wrapper__content__title}>Welcome</h2>
          <p className={style.wrapper__content__description}>
            Ghostdrive Storage Network
          </p>
          <p className={style.wrapper__content__description}>
            Powered by Filecoin
          </p>
        </div>
        <ul className={style.options}>
          <li className={style.options__item}>
            <button
              onClick={() => {
                navigate("/upload");
              }}
              className={style.options__item__button}>
              <UploadIcon /> Upload Files
            </button>
          </li>
          <li className={style.options__item}>
            <button className={style.options__item__button}>
              <GhostIcon /> Client-side Encryption
            </button>
          </li>
          <li className={style.options__item}>
            <button className={style.options__item__button}>
              <UpgradeIcon /> Secured Sharing
            </button>
          </li>
        </ul>
        <button className={style.startButton}>Start</button>
      </section>
    </div>
  );
};

export const UploadPage = () => {
  const navigate = useNavigate();
  return (
    <div className={`${style.container} ${style.uploadContainer}`}>
      <header className={style.header}>
        <h2 className={style.wrapper__content__description}>GhostDrive</h2>
      </header>
      <section className={style.wrapper}>
        <div className={style.wrapper__content}>
          <img src={uploadLogo} alt="logo" width={93} height={93} />
          <h2 className={style.wrapper__content__title}>Upload Files</h2>
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
              className={`${style.options__item__button} ${style.uploadOptionButton}`}>
              <GhostIcon /> From Ghostdrive{" "}
              <ArrowIcon className={style.arrowIcon} />
            </button>
          </li>
          <li className={style.options__item}>
            <button
              className={`${style.options__item__button} ${style.uploadOptionButton}`}>
              <DownloadIcon /> Import files{" "}
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
        <button className={style.laterButton}>Later</button>
      </section>
    </div>
  );
};

export const FilesSystemPage = () => {
  return (
    <div className={style.container}>
      <header>
        <h2 className={style.wrapper__content__description}>Files System</h2>
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
          <li className={style.options__item}>
            <button
              className={`${style.options__item__button} ${style.selectFileButton}`}>
              <CircleLogoIcon /> From Ghostdrive{" "}
              <ArrowIcon className={style.arrowIcon} />
            </button>
          </li>
        </ul>
        <p className={style.wrapper__list__title}>Recently sent files</p>
        <ul className={`${style.options} ${style.filesList}`}>
          <li className={`${style.options__item} ${style.fileItem}`}>
            <div className={style.fileItem__icon}>
              <img src={placeholder_image} alt="file" width={30} height={40} />
            </div>
            <div>
              <h3>File name</h3>
              <p>Mar 21, 2021, 3:30pm</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};
