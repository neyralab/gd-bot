import { useNavigate } from "react-router-dom";

import { ReactComponent as ArrowIcon } from "../../assets/arrow_right.svg";
import { ReactComponent as CircleCloudIcon } from "../../assets/cloud_circle.svg";
import { ReactComponent as CirclePictureIcon } from "../../assets/picture_circle.svg";
import { ReactComponent as FileIcon } from "../../assets/file_draft.svg";
import { ReactComponent as SearchIcon } from "../../assets/search.svg";

import placeholder_image from "../../assets/upload_bg.png";

import style from "./style.module.css";

export const FilesSystemPage = () => {
  const navigate = useNavigate();

  const onBackButtonClick = () => navigate(-1);

  const filesLength = 0;

  const handleFileUpload = async (event) => {
    // To do upload
  };

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
            <input
              type="file"
              accept="image/*,video/*"
              className={style.hiddenInput}
              onChange={handleFileUpload}
            />
          </li>
          <li className={style.options__item}>
            <button
              className={`${style.options__item__button} ${style.selectFileButton}`}>
              <CircleCloudIcon /> From Files{" "}
              <ArrowIcon className={style.arrowIcon} />
            </button>
            <input
              type="file"
              accept=".pdf,.doc,.txt,.zip,.rar"
              className={style.hiddenInput}
              onChange={handleFileUpload}
            />
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
