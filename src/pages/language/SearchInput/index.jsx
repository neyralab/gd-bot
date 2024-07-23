import { useState, useRef } from 'react';
import CN from 'classnames';
import { useClickOutside } from '../../../utils/useClickOutside';
import { ReactComponent as SearchIcon } from '../../../assets/search.svg';

import styles from './styles.module.css';

const SearchInput = ({ onChange }) => {
  const inputContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(true);
    inputRef.current.focus();
  }

  const handleClickOutside = () => {
    setIsOpen(false);
  }

  useClickOutside(inputContainerRef, handleClickOutside);

  return (
    <div className={styles.container}>
      <div
        ref={inputContainerRef}
        onClick={onClick}
        className={CN(styles.inputContainer, isOpen && styles.inputContainerActive)}
      >
        <div className={CN(styles.content, isOpen && styles.contentActive)}>
          <SearchIcon viewBox='0 0 20 20' className={styles.icon} />
          <input
            ref={inputRef}
            onChange={onChange}
            className={styles.input}
            placeholder='Search'
          />
        </div>
      </div>
      <span className={CN(styles.cancellBtn, isOpen && styles.cancellBtnActive)}>Cancell</span>
    </div>
  );
};

export default SearchInput;