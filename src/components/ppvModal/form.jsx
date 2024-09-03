import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';

import Header from './components/Header';
import CountSelector from './components/CountSelector';
import { ReactComponent as StarIcon } from '../../assets/star.svg';

import styles from './PPVModal.module.css';

const MAX_STARS_VALUE = 9999;
const MAX_LENGTH = 256;

const Form = ({ onClose, onSubmitProcess, state, setState }) => {
  const { t } = useTranslation('drive');
  const [startValidation, setStartValidation] = useState(false);
  const isValid = useMemo(() => 
    (state.description && state.description.trim().length <= MAX_LENGTH)
  ,[state]);

  const onChange = (data) => {
    setState((prev) => ({ ...prev, ...data }));
  }

  const onDescChange = ({ target: { value } }) => {
    setState((prev) => ({ ...prev, description: value }));
  }

  const onSubmit = () => {
    if (isValid) {
      onSubmitProcess(state);
    } else {
      setStartValidation(true);
    }
  }
  
  return (
    <>
      <div className={styles.container}>
        <div className={styles.form} >
          <Header leftText={t('ppv.back')} onClose={onClose} />
          <CountSelector
            title={t('ppv.ppv')}
            value={Number(state.view)}
            onChange={onChange}
            name="view"
            min={1}
            max={MAX_STARS_VALUE}
          />
          <CountSelector
            title={t('ppv.download')}
            value={Number(state.download)}
            onChange={onChange}
            name="download"
            min={0}
            max={MAX_STARS_VALUE}
          />
          <div className={CN(styles.areaContainer, startValidation && !isValid && styles.areaError)}>
            <p className={styles.areaTitle}>{t('ppv.description')}</p>
            <textarea
              className={styles.area}
              placeholder={t('ppv.description')}
              onChange={onDescChange}
              value={state.description}
              rows="5"
            />
            <span className={styles.areaWordCounter}>
              {`${state.description.length}/${MAX_LENGTH}`}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.footerTitle}>{t('ppv.policy')}</p>
        <button
          disabled={startValidation && !isValid}
          className={styles.footerButton}
          onClick={onSubmit}
        >
          {t('ppv.publish')}
          <span>1 <StarIcon viewBox='0 0 21 21' /></span>
        </button>
      </div>
    </>
  );
}

export default Form;