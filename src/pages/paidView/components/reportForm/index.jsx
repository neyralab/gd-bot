import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Header from '../../../../components/ppvModal/components/Header';

import { createFileReportEffect } from '../../../../effects/filesEffects';

import styles from './styles.module.css';

export const ReportForm = ({ onClose, slug }) => {
  const { t } = useTranslation('drive');
  const [selectedOption, setSelectedOption] = useState("copyright");
  const [reportText, setReportText] = useState("");

  const reportTypes = useMemo(() => ({
    copyright: 'Copyright infringement',
    spam: 'Spam',
    violence: 'Violence or dangerous content',
    other: 'Other'
  }), [])

  const reportList = useMemo(() => ([
    {
      name: 'copyright',
      text: reportTypes.copyright,
      translatePath: 'ppv.copyright',
      id: 1,
    },
    {
      name: 'spam',
      text: reportTypes.spam,
      translatePath: 'ppv.spam',
      id: 5,
    },
    {
      name: 'violence',
      text: reportTypes.violence,
      translatePath: 'ppv.violence',
      id: 9,
    },
    {
      name: 'other',
      text: reportTypes.other,
      translatePath: 'ppv.other',
      id: 10,
    }
  ]), []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleReportTextChange = (event) => {
    setReportText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const reportType = reportList.find((item) => item.name === selectedOption);
      const body = { comment: reportText, type: reportType.id };
      await createFileReportEffect(slug, body);
      toast.success(t('ppv.successReport'), { position: 'top-center' });
      onClose();
    } catch (error) {
      toast.error(t('ppv.failReport'), { position: 'top-center' });
    }
  };

  return (
    <div className={styles.container}>
      <Header onClose={onClose} title={t('ppv.report')}  />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.radioGroup}>
          {reportList.map(({ name, translatePath, id }) => (
            <label key={`report-${id}`} className={styles.radioOption}>
              <input
                type="radio"
                value={name}
                checked={name === selectedOption}
                onChange={handleOptionChange}
              />
              <span className={styles.customRadio}></span>
                {t(translatePath)}
            </label>
          ))}
          {selectedOption === 'other' && (
            <div className={styles.areaContainer}>
              <p className={styles.areaLabel}>{t('ppv.enterReport')}</p>
              <textarea
                value={reportText}
                onChange={handleReportTextChange}
                placeholder={t('ppv.enterReport')}
                className={styles.textArea}
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={selectedOption === 'other' && !reportText.length}
        >
          {t('ppv.report')}
        </button>
      </form>
    </div>
  )
}
