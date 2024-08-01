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
  const systemModalType = useSelector((state) => state.game.systemModal);

  useEffect(() => {
    if (!systemModalType) return;

    let title = null;
    let description = null;
    let actions = [];

    switch (systemModalType) {
      case 'REACHED_MAX_TAPS':
        title = t('message.error');
        description = t('message.reachedMaxTaps');
        actions = [
          {
            type: 'default',
            text: t('message.ok'),
            onClick: () => {
              systemModalRef.current.close();
              dispatch(setSystemModal(null));
              window.location.reload(); // too many dependencies to turn them back, it's simplier to refresh the page
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
  }, [systemModalType]);

  return <SystemModal ref={systemModalRef} />;
}
