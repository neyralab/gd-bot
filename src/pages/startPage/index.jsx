import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CN from 'classnames';
import CountUp from 'react-countup';
import { TelegramShareButton } from 'react-share';

import {
  selectAllWorkspaces,
  selectCurrentWorkspace,
  selectTotalWsCount
} from '../../store/reducers/workspaceSlice';
import {
  getIsWorkspaceSelected,
  setIsWorkspaceSelected,
  switchWorkspace
} from '../../effects/workspaceEffects';
import {
  DEFAULT_MULTIPLIER_NAMES,
  DEFAULT_TARIFFS_NAMES
} from '../upgradeStorage';
import { transformSize } from '../../utils/transformSize';
import { fromByteToGb } from '../../utils/storage';

import GhostLoader from '../../components/ghostLoader';
import { ConnectTonWalletButton } from '../../components/connectTonWalletButton';
import { DisconnectWalletModal } from '../../components/disconnectWalletModal';

import { ReactComponent as ArrowIcon } from '../../assets/arrow_right.svg';
import { ReactComponent as HardDriveIcon } from '../../assets/hard_drive.svg';
import { ReactComponent as TaskIcon } from '../../assets/task.svg';
import { ReactComponent as LeadboardIcon } from '../../assets/leadboard.svg';
import { ReactComponent as PointsIcon } from '../../assets/point.svg';
// import { ReactComponent as UploadIcon } from '../../assets/upload.svg';
// import { ReactComponent as UpgradeIcon } from '../../assets/upgrade.svg';
// import { ReactComponent as GhostIcon } from '../../assets/ghost.svg';
// import { ReactComponent as MoneyIcon } from '../../assets/money.svg';
// import { ReactComponent as RefIcon } from '../../assets/ref.svg';
// import { ReactComponent as UploadFileIcon } from '../../assets/uploadFile.svg';
// import { ReactComponent as DriveIcon } from '../../assets/drive.svg';
// import { ReactComponent as BoostIcon } from '../../assets/boost.svg';
// import { ReactComponent as ReferralIcon } from '../../assets/referral.svg';
// import { ReactComponent as InviteBackgroundIcon } from '../../assets/invite_background.svg';
import { ReactComponent as TelegramIcon } from '../../assets/telegram.svg';
import { ReactComponent as CloudIcon } from '../../assets/cloud.svg';

import style from './style.module.css';

export const StartPage = ({ onClose }) => {
  const [disconnectWalletModal, setDisconnectWalletModal] = useState(false);
  const totalWsCount = useSelector(selectTotalWsCount);
  const allWorkspaces = useSelector(selectAllWorkspaces);
  const currentWorkspace = useSelector(selectCurrentWorkspace);
  const user = useSelector((state) => state?.user?.data);
  const navigate = useNavigate();
  const isWsSelected = getIsWorkspaceSelected();
  const link = useSelector((state) => state.user.link);

  const storage = useMemo(() => {
    const size = DEFAULT_TARIFFS_NAMES[user?.space_total] || '1GB';
    return {
      size,
      multiplier: DEFAULT_MULTIPLIER_NAMES[size] || 1
    };
  }, [user?.space_total]);

  const human = useMemo(() => {
    if (!user) return;
    const { space_total, storage } = user;
    const percent = Math.round(
      (Number(storage) / space_total + Number.EPSILON) * 100
    );

    return {
      total: `${transformSize(String(space_total), 0)}`,
      used: `${fromByteToGb(storage)}`,
      percent: { label: `${percent || 1}%`, value: percent }
    };
  }, [user]);

  const list = useMemo(() => {
    return [
      {
        Icon: TaskIcon,
        text: 'Daily Tasks',
        amount: '',
        onClick: () => {
          navigate('/task');
        }
      },
      {
        Icon: LeadboardIcon,
        text: 'Leadboard',
        amount: '',
        onClick: () => {
          navigate('/leadboard');
        }
      },
      {
        Icon: PointsIcon,
        text: 'Point Tracker',
        amount: '',
        onClick: () => {
          navigate('/point-tracker');
        }
      },
      {
        Icon: CloudIcon,
        text: `Upgrade X${storage.multiplier}`,
        amount: `${human?.used} of ${human?.total}`,
        onClick: () => {
          navigate('/boost');
        }
      }
      // {
      //   Icon: UploadFileIcon,
      //   text: 'Upload & Reward',
      //   amount: '+50',
      //   onClick: () => {
      //     navigate('/file-upload');
      //   }
      // },
      // {
      //   Icon: DriveIcon,
      //   text: 'Drive',
      //   amount: storage.size,
      //   onClick: () => {
      //     navigate('/ghostdrive-upload');
      //   }
      // },
      // {
      //   Icon: BoostIcon,
      //   text: 'Multiplier',
      //   amount: `X${storage.multiplier}`,
      //   onClick: () => {
      //     navigate('/boost');
      //   }
      // },
      // {
      //   Icon: TaskIcon,
      //   text: 'Play & Earn',
      //   amount: '',
      //   onClick: () => {
      //     navigate('/game');
      //   }
      // }
    ];
  }, [navigate, storage.multiplier, human?.used, human?.total]);

  const handleWsSelection = async (ws) => {
    await switchWorkspace(ws.workspace.id).then(() => {
      setIsWorkspaceSelected(true);
      window.location.assign(window.location.origin);
    });
  };

  const workspaceslist = useMemo(() => {
    if (allWorkspaces) {
      return allWorkspaces.map((ws) => (
        <li className={style.options__item} key={ws.workspace.id}>
          <button
            onClick={() => {
              handleWsSelection(ws);
            }}
            className={`${style.options__item__button} ${style.workspaceOptionButton}`}>
            <HardDriveIcon /> {ws.workspace.name}
            <ArrowIcon className={style.arrowIcon} />
          </button>
        </li>
      ));
    }
  }, [allWorkspaces]);

  if (!allWorkspaces && !currentWorkspace) {
    return (
      <div className={style.home_container}>
        <GhostLoader startup />
      </div>
    );
  }

  const onBalance = () => {
    navigate('/balance');
  };

  return (
    <div className={`${style.container} ${style.uploadContainer}`}>
      <header className={style.header_new}>
        <ConnectTonWalletButton
          openDisconnectModal={setDisconnectWalletModal}
        />
        <section onClick={onBalance}>
          <div className={style.wallet_balance}>
            <p
              className={CN(
                style.wallet,
                user?.points > 999999 && style.small
              )}>
              <CountUp delay={1} end={user?.points} />
            </p>
          </div>
          <p className={style.balance}>Points</p>
        </section>
      </header>

      <div className={style.list}>
        {list.map((el) => (
          <div key={el.text} className={style.list_element}>
            <button onClick={el?.onClick} className={style.list_element_button}>
              <el.Icon />
              <p className={style.list_element_text}>{el.text}</p>
              <span
                className={CN(
                  style.list_element_text,
                  style.list_element_amount
                )}>
                {el.amount}
              </span>
            </button>
          </div>
        ))}

        <TelegramShareButton
          url={link.copy}
          title={'Share this link with friends'}>
          <div className={style.list_element}>
            <button className={style.list_element_button}>
              <TelegramIcon />
              <p className={style.list_element_text}>Share with friends</p>
              <span
                className={CN(
                  style.list_element_text,
                  style.list_element_amount
                )}>
                + 1,000
              </span>
            </button>
          </div>
        </TelegramShareButton>
      </div>

      <div className={style.bottom}>
        {/* <button className={style.invite_button}>
          <TelegramShareButton
            className={style.telegram_share}
            title={'Share this link with friends'}
            url={link.copy}>
            <InviteBackgroundIcon className={style.invite_background} />
            <div className={style.invite_block}>
              <div className={style.invite_right}>
                <LargeTelegramIcon />
              </div>
              <div className={style.invite_left}>
                <h4 className={CN(style.invite_get)}>Invite & Get Points</h4>
                <span className={style.invite_amount}>1,000</span>
              </div>
            </div>
          </TelegramShareButton>
        </button>*/}

        <footer className={style.footer}>
          <div
            onClick={() => {
              navigate('/file-upload');
            }}
            className={style.footer_item}>
            <PointsIcon />
            <span className={style.footer_item_text}>Upload for Airdrop</span>
          </div>
          <div
            className={style.footer_item}
            onClick={() => {
              // navigate('/game');
            }}>
            <LeadboardIcon />
            <span className={style.footer_item_text}>Taping for Airdop</span>
          </div>
        </footer>
      </div>

      {disconnectWalletModal && (
        <DisconnectWalletModal
          isOpen={disconnectWalletModal}
          onClose={() => setDisconnectWalletModal(false)}
        />
      )}
    </div>
  );
};
