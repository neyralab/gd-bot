import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import ReactGA from 'react-ga4';

import { setInitData, setLink, setUser } from './store/reducers/userSlice';
import {
  setCurrentWorkspace,
  setWorkspacePlan
} from './store/reducers/workspaceSlice';
import { setExperienceLevel } from './store/reducers/gameSlice';

import { getUserEffect } from './effects/userEffects';
import { authorizeUser } from './effects/authorizeUser';
import { storageListEffect } from './effects/storageEffects';
import { API_WEB_APP_URL } from './utils/api-urls';
import { useLanguage } from './utils/useLanguage';
import { isDevEnv } from './utils/isDevEnv';
import { isPhone } from './utils/client';

import SharedLayout from './components/sharedLayout';
import { StartPage } from './pages/startPage';
import { FilesSystemPage } from './pages/filesSystemPage';
import { UpgradeStoragePage } from './pages/upgradeStorage';
import { FilesPage } from './pages/filesPage';
import { Balance } from './pages/balance';
import { Referral } from './pages/referral';
import { LeaderboardLeague } from './pages/leaderboard/league';
import { LeaderboardFriends } from './pages/leaderboard/friends';
import { LanguagePage } from './pages/language';
import { BoostPage } from './pages/boost';
import { GamesPage } from './pages/games';
import { GamePage } from './pages/game';
import { IntroPage } from './pages/intro';
import EarnPage from './pages/earn';
import FriendsPage from './pages/friends';
import NodesWelcomePage from './pages/nodes-welcome';
import NodesPage from './pages/nodes';
import NotAllow from './pages/notAllow';

import { isEnabledMobileOnly } from './utils/featureFlags';
import { isWebPlatform} from './utils/client';

import './App.css';

const ALLOW_PREVIEW = !!isEnabledMobileOnly || !isWebPlatform();

export const tg = window.Telegram.WebApp;
const GA = 'G-VEPRY1XE4E';

function App() {
  useLanguage();
  const dispatch = useDispatch();
  const [tariffs, setTariffs] = useState(null);

  const currentUser = {
    initData: tg.initData
  };

  useEffect(() => {
    ReactGA.initialize(GA);
    tg.disableVerticalSwipes();
  }, []);

  const onPageLoad = async () => {
    try {
      dispatch(setInitData(currentUser.initData));
      const { token } = await authorizeUser(
        currentUser,
        tg?.initDataUnsafe?.start_param
      );
      if (!token) throw new Error('token not found');
      await getUserEffect(token).then((data) => {
        const code = data?.referral_code;
        const prefix = 'https://t.me/share/';
        const botUrl = `https://t.me/${import.meta.env.VITE_BOT_NAME}?start=${code}`;
        const url = `${prefix}?url=${botUrl}`;
        const linkPayload = {
          copy: botUrl,
          send: url,
          label: `@t.me/${code}`
        };
        dispatch(setLink(linkPayload));
        dispatch(setUser(data));
        dispatch(setExperienceLevel(data.current_level.level));
        dispatch(setCurrentWorkspace(data?.ws_id));
        dispatch(setWorkspacePlan(data?.workspace_plan));
      });
      await storageListEffect(token).then((data) => {
        setTariffs(data);
      });
    } catch (error) {
      console.log('onStart Error', { error });
    }
  };

  useEffect(() => {
    tg.ready();
    tg?.expand();
    tg?.enableClosingConfirmation();
    console.log('tg:', tg);
    ALLOW_PREVIEW && onPageLoad();
  }, []);

  const onClose = () => {
    tg.close();
  };

  if (!ALLOW_PREVIEW) {
    return <NotAllow />
  }

  return (
    <TonConnectUIProvider
      manifestUrl={`${API_WEB_APP_URL}/tonconnect-manifest.json`}
      actionsConfiguration={{
        twaReturnUrl: API_WEB_APP_URL
      }}
      network="main">
      <SharedLayout>
        <Routes>
          <Route path="/" exact element={<IntroPage />} />
          <Route
            path="/start"
            exact
            element={<StartPage onClose={onClose} tariffs={tariffs} />}
          />
          <Route path="/file-upload" exact element={<FilesSystemPage />} />
          <Route path="/ghostdrive-upload" exact element={<FilesPage />} />
          <Route path="/files" exact element={<FilesPage />} />
          <Route
            path="/upgrade"
            exact
            element={<UpgradeStoragePage tariffs={tariffs} />}
          />
          <Route path="/balance" exact element={<Balance />} />
          <Route path="/point-tracker" exact element={<Referral />} />
          <Route path="/games" exact element={<GamesPage />} />
          <Route path="/language" exact element={<LanguagePage />} />
          <Route
            path="/leadboard/league"
            exact
            element={<LeaderboardLeague />}
          />
          <Route
            path="/leadboard/friends"
            exact
            element={<LeaderboardFriends />}
          />
          <Route path="/friends" exact element={<FriendsPage />} />
          <Route path="/game-3d" exact element={<GamePage />} />
          <Route
            path="/boost"
            exact
            element={<BoostPage tariffs={tariffs} />}
          />
          <Route path="/earn" exact element={<EarnPage />} />
          <Route path="/nodes-welcome" exact element={<NodesWelcomePage />} />
          <Route path="/nodes" exact element={<NodesPage />} />
        </Routes>
      </SharedLayout>
    </TonConnectUIProvider>
  );
}

export default App;
