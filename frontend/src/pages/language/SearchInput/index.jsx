import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';
import { useClickOutside } from '../../../utils/useClickOutside';
import { ReactComponent as SearchIcon } from '../../../assets/search.svg';

import styles from './styles.module.scss';

const SearchInput = ({ value, onChange, onClose }) => {
  const { t } = useTranslation('system');
  const inputContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(true);
    inputRef.current.focus();
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  useClickOutside(inputContainerRef, handleClickOutside);

  return (
    <div data-animation="language-animation-3" className={styles.container}>
      <div
        ref={inputContainerRef}
        onClick={onClick}
        className={CN(
          styles.inputContainer,
          (isOpen || !!value) && styles.inputContainerActive
        )}>
        <div
          className={CN(
            styles.content,
            (isOpen || !!value) && styles.contentActive
          )}>
          <SearchIcon viewBox="0 0 20 20" className={styles.icon} />

          <input
            value={value}
            ref={inputRef}
            onChange={onChange}
            className={styles.input}
            placeholder={t('language.search')}
          />
        </div>
      </div>

      <span
        className={CN(
          styles.cancelBtn,
          (isOpen || !!value) && styles.cancelBtnActive
        )}
        onClick={onClose}>
        {t('language.cancel')}
      </span>
    </div>
  );
};

export default SearchInput;
