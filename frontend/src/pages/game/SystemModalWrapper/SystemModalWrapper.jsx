import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SystemModal from '../../../components/SystemModal/SystemModal';
import { setSystemModal } from '../../../store/reducers/gameSlice';

/** We could use it directly on the game page
 * But I want to avoid rerenders, so I placed the logic of modals here
 */
export default function SystemModalWrapper() {
  const dispatch = useDispatch();
  const { t } = useTranslation('system');
  const systemModalRef = useRef(null);
  const systemModal = useSelector((state) => state.game.systemModal);

  useEffect(() => {
    if (!systemModal) return;

    let title = null;
    let description = null;
    let actions = [];

    switch (systemModal.type) {
      case 'END_GAME_ERROR':
      case 'START_GAME_ERROR':
      case 'BEFORE_GAME_ERROR':
      case 'START_ADVERTASEMENT_WATCH_ERROR':
      case 'END_ADVERTASEMENT_WATCH_ERROR':
        title = t('message.error');
        description = systemModal.message;
        actions = [
          {
            type: 'default',
            text: t('message.ok'),
            onClick: () => {
              systemModalRef.current.close();
              dispatch(setSystemModal(null));
            }
          }
        ];
        break;
    }

    systemModalRef.current.open({
      title: title,
      text: description,
      actions: actions
    });
  }, [systemModal]);

  return <SystemModal ref={systemModalRef} />;
}
