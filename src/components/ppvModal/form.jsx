import React, { useMemo, useState } from 'react';

import Header from './components/Header';
import CountSelector from './components/CountSelector';
import { ReactComponent as StarIcon } from '../../assets/star.svg';

import styles from './PPVModal.module.css';

const MAX_STARS_VALUE = 9999;
const MAX_LENGTH = 256;

const Form = ({ onClose, onSubmitProcess, state, setState }) => {
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
    onSubmitProcess(state);
  }
  
  return (
    <>
      <div className={styles.container}>
        <div className={styles.form} >
          <Header onClose={onClose} />
          <CountSelector
            title="Per per view"
            value={Number(state.view)}
            onChange={onChange}
            name="view"
            min={1}
            max={MAX_STARS_VALUE}
          />
          <CountSelector
            title="Download price (optinal)"
            value={Number(state.download)}
            onChange={onChange}
            name="download"
            min={0}
            max={MAX_STARS_VALUE}
          />
          <div className={styles.areaContainer}>
            <p className={styles.areaTitle}>Description</p>
            <textarea
              className={styles.area}
              placeholder='Description'
              onChange={onDescChange}
              value={state.description}
              rows="5"
            />
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.footerTitle}>You own 100% revenue. Legal Policy </p>
        <button
          disabled={!isValid}
          className={styles.footerButton}
          onClick={onSubmit}
        >
          Publish
          <span>1 <StarIcon viewBox='0 0 21 21' /></span>
        </button>
      </div>
    </>
  );
}

export default Form;