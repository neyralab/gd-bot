import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react';
import classNames from 'classnames';
import CountUp from 'react-countup';
import { useSelector } from 'react-redux';
import { fromNano } from '@ton/ton';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toast } from 'react-toastify';
import { Address } from '@ton/core';
import { useTranslation } from 'react-i18next';

import { useContract } from '../../utils/useContract';
import { NftCollection } from '../../effects/contracts/tact_NftCollection';
import { getContractMessage, getTxByBOC } from '../../effects/contracts/helper';
import { refererEffect } from '../../effects/referralEffect';

import { Header } from '../../components/header';
import { ReactComponent as LogoIcon } from '../../assets/ghost.svg';
import { ReactComponent as TonIcon } from '../../assets/TON.svg';
import CardsSlider from '../../components/CardsSlider/CardsSlider';
import sliderItems from './SliderItem/sliderItems';
import SliderItem from './SliderItem/SliderItem';
import styles from './styles.module.css';
import { getWallet } from '../../utils/string';
import { NFT_ADDRESS } from '../../config/contracts';

const allNodes = 10000;

export default function NodesPage() {
  const [tonConnectUI] = useTonConnectUI();
  const [nodesAvailable, setNodesAvailable] = useState(allNodes);
  const [nodesCost, setNodesCost] = useState('0');
  const [userNodes, setUserNodes] = useState('0');
  const [referer, setReferer] = useState();
  const [connected, setConnected] = useState(false);
  const contract = useContract(NFT_ADDRESS, NftCollection);
  const user = useSelector((state) => state.user.data);
  const [tonconnectUI] = useTonConnectUI();
  const { t } = useTranslation('system');

  useEffect(() => {
    refererEffect().then((data) => {
      setReferer(data);
    });
  }, []);

  useEffect(() => {
    if (contract) {
      contract.getPricePerMint().then((price) => {
        setNodesCost(fromNano(price));
      });
      contract.getGetCollectionData().then((used) => {
        setNodesAvailable(
          (prevState) => prevState - Number(used.next_item_index)
        );
      });
    }
  }, [contract]);

  useEffect(() => {
    if (contract && user?.wallet && tonconnectUI.account?.address) {
      contract
        .getTotalBought(Address.parse(tonconnectUI.account?.address))
        .then((total) => {
          setUserNodes(total.toString());
        })
        .catch((err) => {
          setUserNodes('0');
          console.log({ err });
        });
    }
  }, [contract, tonconnectUI.account?.address, user?.wallet]);

  const slides = useMemo(() => {
    return sliderItems(t).map((el) => {
      return { id: el.id, html: <SliderItem key={el?.id} item={el} /> };
    });
  }, []);

  useLayoutEffect(() => {
    let intervalId;

    const toAppearElements = document.querySelectorAll(
      `.${styles['to-appear']}`
    );
    let count = 0;

    intervalId = setInterval(() => {
      if (count < toAppearElements.length) {
        toAppearElements[count].classList.add(styles['to-appear_active']);
        count++;
      } else {
        clearInterval(intervalId);
      }
    }, 300);

    return () => clearInterval(intervalId);
  }, []);

  const onBuyNode = useCallback(async () => {
    try {
      console.log('connected', { connected });
      if (!contract) {
        return;
      }
      if (!connected) {
        if (tonConnectUI.connected) {
          await tonConnectUI?.disconnect();
        }
        await tonConnectUI.openModal();
        setConnected(true);
        return;
      }
      console.log({ contract });
      const price = await contract.getPricePerMint();
      console.log({ contract, price, referer });
      // const d = await contract.getGetCollectionData();
      //
      // console.log({ d });

      await contract.send(
        {
          send: async (args) => {
            const tx = getContractMessage(args);
            const data = await tonConnectUI.sendTransaction(tx);
            console.log({ data });
          }
        },
        { value: price },
        {
          $$type: 'Mint',
          query_id: 1n,
          referer: referer ? Address.parse(referer) : null
        }
      );
      toast.success('Payment was successfully');
    } catch (e) {
      console.log('onBuyNode error', e);
      toast.error(e.message);
      setConnected(false);
    }
  }, [connected, contract, referer, tonConnectUI]);

  return (
    <div className={styles.container}>
      <Header label={t('node.node')} />

      <div className={styles.content}>
        <div
          className={classNames(
            styles.card,
            styles.banner,
            styles['to-appear']
          )}>
          <video
            id="background-video"
            autoPlay
            loop
            muted
            playsInline
            controlsList="nofullscreen"
            poster="/assets/node-banner.jpg">
            <source src="/assets/node-banner.mp4" type="video/mp4" />
          </video>

          <div className={styles['banner-content']}>
            <div className={styles['banner-header']}>
              <div className={styles['banner-header_img']}>
                <LogoIcon />
              </div>
              <h1>{t('node.nodes')}</h1>
              <span>
                <CountUp delay={0.5} end={userNodes} />
              </span>
            </div>
          </div>
        </div>

        <div className={classNames(styles.card, styles['to-appear'])}>
          <div className={styles['buy-container']}>
            <div className={styles['buy-container__flex-left']}>
              <div className={styles['buy-container__description']}>
                {`${t('node.available')}: 1 000`}
              </div>
              <div className={styles['buy-container__cost']}>
                {nodesCost} <TonIcon  viewBox="0 -2 24 26"  />
              </div>
            </div>
            <div className={styles['buy-container__flex-right']}>
              <button
                type={'button'}
                onClick={onBuyNode}
                className={styles['buy-button']}
              >
                {t('node.buy')}
              </button>
            </div>
          </div>
        </div>

        <div
          className={classNames(
            styles['slider-container'],
            styles['to-appear']
          )}>
          <CardsSlider items={slides} timeout={5000} />
        </div>
      </div>
    </div>
  );
}
