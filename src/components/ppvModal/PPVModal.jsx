import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';

import { selectPaperViewModal, handlePaperViewModal } from '../../store/reducers/modalSlice';
import { selectPaymenttByKey } from '../../store/reducers/paymentSlice';
import { selecSelectedFile } from '../../store/reducers/filesSlice';
import { updateFile } from '../../store/reducers/filesSlice';
import { makeInvoice } from '../../effects/paymentEffect';
import { INVOICE_TYPE } from '../../utils/createStarInvoice';
import { sleep } from '../../utils/sleep';

import { createPaidShareFileEffect } from '../../effects/filesEffects';

import Form from './form';
import Preloader from './preloader';

import styles from './PPVModal.module.css';

const PPVModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectPaperViewModal);
  const [isProccess, setIsProccess] = useState(false);
  const user = useSelector((state) => state.user.data);
  const [state, setState] = useState({ view: 1, download: 0, description: '' });
  const ppvPayment = useSelector(selectPaymenttByKey('pay_per_view'));
  const file = useSelector(selecSelectedFile);
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
    dispatch(handlePaperViewModal(false));
  }

  const invoiceCallback = async (result) => {
    try {
      if (result === 'paid') {
        setIsProccess(true); 
        await sleep(500);
        const body = {
          priceView: state.view,
          currency: 1,
          priceDownload: state.download,
          description: state.description,
          file: file.id
        }
        const res = await createPaidShareFileEffect(file.id, body);
        if (res.data) {
          const shareObj = { ...res.data };
          delete shareObj.file;
          dispatch(updateFile({ ...file, share_file: shareObj }));
          setTimeout(() => {
            setIsProccess(false); 
            onClose();
          }, [1000])
        }
      } else {
        console.warn(`error: The payment was not completed. ${result}`)
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
        type: INVOICE_TYPE.game,
        theme: { multiplier: '', stars: 1 }
      });
    } catch (error) {
      setIsProccess(false); 
      console.warn(error);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      className={styles.modal}
    >
      {isProccess ? (
        <Preloader onClose={onClose} /> ) : ( 
        <Form
          state={state}
          onClose={onClose}
          setState={setState}
          onSubmitProcess={onSubmit}
        />
      )}
    </Modal>
  );
}

export default PPVModal;