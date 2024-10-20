import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CN from 'classnames';

import Header from './components/Header';
import CountSelector from './components/CountSelector';
import { ReactComponent as StarIcon } from '../../assets/star.svg';

import { runInitAnimation } from './animations';
import styles from './PPVModal.module.scss';

const MAX_STARS_VALUE = 9999;
const MAX_LENGTH = 256;

const Form = ({ onClose, onSubmitProcess, state, setState }) => {
  const { t } = useTranslation('drive');
  const [startValidation, setStartValidation] = useState(false);
  const isValid = useMemo(
    () => state.description && state.description.trim().length <= MAX_LENGTH,
    [state]
  );

  useEffect(() => {
    runInitAnimation();
  }, []);

  const onChange = (data) => {
    setState((prev) => ({ ...prev, ...data }));
  };

  const onDescChange = ({ target: { value } }) => {
    setState((prev) => ({ ...prev, description: value }));
  };

  const onSubmit = () => {
    if (isValid) {
      onSubmitProcess(state);
    } else {
      setStartValidation(true);
    }
  };

  return (
    <div className={styles['form-container']}>
      <div className={styles.container}>
        <div className={styles.form}>
          <Header leftText={t('ppv.back')} />

          <CountSelector
            title={t('ppv.ppv')}
            value={Number(state.view)}
            onChange={onChange}
            name="view"
            min={1}
            max={MAX_STARS_VALUE}
          />

          {/* <CountSelector
            title={t('ppv.download')}
            value={Number(state.download)}
            onChange={onChange}
            name="download"
            min={0}
            max={MAX_STARS_VALUE}
          /> */}

          <button
            data-animation="ppv-footer-animation-2"
            disabled={startValidation && !isValid}
            className={styles.footerButton}
            onClick={onSubmit}>
            {t('ppv.publish')}
            <span>
              1 <StarIcon viewBox="0 0 21 21" />
            </span>
          </button>

          <div
            data-animation="ppv-textarea-animation-1"
            className={CN(
              styles.areaContainer,
              startValidation && !isValid && styles.areaError
            )}>
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
        <p
          data-animation="ppv-footer-animation-1"
          className={styles.footerTitle}>
          {t('ppv.policy')}
        </p>
      </div>
    </div>
  );
};

export default Form;
