import { useNavigate } from "react-router-dom";
import moment from "moment";

import { files } from "./mockup";

import CustomFileIcon from "../customFileIcon";
import { ReactComponent as SearchIcon } from "../../assets/search_input.svg";
import { ReactComponent as GridIcon } from "../../assets/grid_view.svg";
import { ReactComponent as ArrowIcon } from "../../assets/arrow_up.svg";
import { ReactComponent as ShareArrowIcon } from "../../assets/arrow_share.svg";
import { ReactComponent as FileIcon } from "../../assets/file_draft.svg";

import style from "./style.module.css";

export const FilesPage = ({ initiator }) => {
  const navigate = useNavigate();

  const onBackButtonClick = () => navigate(-1);

  const formattedDate = (dateCreated) =>
    moment.unix(dateCreated).format("MMM DD, YYYY, h:mma");

  return (
    <div className={style.container}>
      <header className={style.header}>
        <button className={style.header__backBtn} onClick={onBackButtonClick}>
          Back
        </button>
        <h2 className={style.header__title}>Files</h2>y
      </header>
      <div className={style.inputWrapper}>
        <SearchIcon className={style.inputWrapper__icon} />
        <input placeholder="Search" className={style.inputWrapper__input} />
      </div>
      <div className={style.actionButtons}>
        <button className={style.actionButtons__sort}>
          Created
          <ArrowIcon />
        </button>
        <button className={style.actionButtons__view}>
          <GridIcon />
        </button>
      </div>
      {initiator !== "upload" ? (
        <ul className={style.filesList}>
          {files.map((file) => (
            <li className={style.fileWrapper} key={file.name}>
              <button className={style.shareButton}>
                <ShareArrowIcon />
              </button>
              <CustomFileIcon
                extension={file.extension}
                color={file.color}
                dateCreated={file.dateCreated}
              />
              <div className={style.info}>
                <p className={style.info__name}>{file.name}</p>
                <p className={style.info__date}>
                  {formattedDate(file.dateCreated)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div className={style.emptyFilesPage}>
            <FileIcon />
            <h2 className={style.emptyFilesPage_title}>Files not found</h2>
            <p className={style.emptyFilesPage_desc}>
              This page is empty, upload your first files.
            </p>
          </div>
          <button className={style.uploadBtn}>Upload</button>
        </>
      )}
    </div>
  );
};
