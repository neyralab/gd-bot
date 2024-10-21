import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectPPVModal,
  handlePPVModal
} from '../../store/reducers/modalSlice';
import { selectPaymenttByKey } from '../../store/reducers/paymentSlice';
import { setPPVFile, updateFileProperty } from '../../store/reducers/drive/drive.slice';
import { makeInvoice } from '../../effects/paymentEffect';
import { INVOICE_TYPE } from '../../utils/createStarInvoice';
import { sleep } from '../../utils/sleep';

import { createPaidShareFileEffect } from '../../effects/filesEffects';

import Form from './form';
import Preloader from './preloader';

import styles from './PPVModal.module.scss';

const INITIAL_STATE = { view: 1, download: 0, description: '' };

const PPVModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectPPVModal);
  const [isProccess, setIsProccess] = useState(false);
  const user = useSelector((state) => state.user.data);
  const [state, setState] = useState(INITIAL_STATE);
  const ppvPayment = useSelector(selectPaymenttByKey('pay_per_view_registration'));
  const file = useSelector((store) => store.drive.ppvFile);
  const isPPVActivated = useMemo(() => !!file?.share_file, [file?.share_file]);

  useEffect(() => {
    if (isPPVActivated) {
      setState({
        view: file.share_file.price_view,
        download: file.share_file.price_download,
        description: file.share_file.description
      });
    }
  }, [isPPVActivated]);

  const onClose = () => {
    dispatch(handlePPVModal(false));
    dispatch(setPPVFile({}));
    setState(INITIAL_STATE);
  };

  const invoiceCallback = async (result) => {
    try {
      if (result === 'paid') {
        const shareId = isPPVActivated ? file.share_file.id : file.id;
        setIsProccess(true); 
        await sleep(1000);
        const body = {
          priceView: state.view,
          currency: 1,
          priceDownload: state.download || 0,
          description: state.description,
          file: file.id
        }
        const res = await createPaidShareFileEffect(shareId, body);
        if (res.data) {
          const shareObj = { ...res.data };
          delete shareObj.file;

          dispatch(updateFileProperty({
            id: file.id,
            property: 'share_file',
            value: shareObj
          }));
          setTimeout(() => {
            setIsProccess(false);
            onClose();
          }, [1000]);
        }
      } else {
        console.warn(`error: The payment was not completed. ${result}`);
      }
    } catch (error) {
      console.warn('error: ', error);
    }
  };

  const onSubmit = async () => {
    try {
      const shareId = isPPVActivated ? file.share_file.id : 0;
      const input = `${ppvPayment.Type};0;${user.id};${file.id};${shareId}`;
      makeInvoice({
        input,
        dispatch,
        callback: invoiceCallback,
        type: INVOICE_TYPE.ceatePPV,
        theme: { multiplier: '', stars: 1 }
      });
    } catch (error) {
      setIsProccess(false);
      console.warn(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      {isProccess ? (
        <Preloader onClose={onClose} />
      ) : (
        <Form
          state={state}
          onClose={onClose}
          setState={setState}
          onSubmitProcess={onSubmit}
        />
      )}
    </Modal>
  );
};

export default PPVModal;
