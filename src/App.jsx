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

import SharedLayout from './components/sharedLayout';
import { StartPage } from './pages/startPage';
import { FilesSystemPage } from './pages/filesSystemPage';
import { UpgradeStoragePage } from './pages/upgradeStorage';
import { FilesPage } from './pages/filesPage';
import { Balance } from './pages/balance';
import { Referral } from './pages/referral';
import { LeaderboardLeague } from './pages/leaderboard/league';
import { LeaderboardFriends } from './pages/leaderboard/friends';
import { TaskPage } from './pages/Task';
import { BoostPage } from './pages/boost';
import { GamePage } from './pages/game';
import { IntroPage } from './pages/intro';
import EarnPage from './pages/earn';
import FriendsPage from './pages/friends';
import NodesWelcomePage from './pages/nodes-welcome';
import NodesPage from './pages/nodes';

import './App.css';

export const tg = window.Telegram.WebApp;
const GA = 'G-VEPRY1XE4E';

function App() {
  const dispatch = useDispatch();
  const [tariffs, setTariffs] = useState(null);

  const currentUser = {
    initData:
      'query_id=AAG_vMAWAAAAAL-8wBbEW8Xa&user=%7B%22id%22%3A381729983%2C%22first_name%22%3A%22vad%22%2C%22last_name%22%3A%22vit%22%2C%22username%22%3A%22vadvit009%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1720523588&hash=7415540dd90bfc8e56e21ec5fc5e4b6e87c0ba11af732ae7cc74b0fa053b23fb'
  };

  useEffect(() => {
    ReactGA.initialize(GA);
  }, []);

  function splitString(str) {
    const halfLength = Math.floor(str.length / 2);
    return [str.substring(0, halfLength), str.substring(halfLength)];
  }
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
    onPageLoad();
  }, []);

  const onClose = () => {
    tg.close();
  };

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
          <Route path="/task" exact element={<TaskPage />} />
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
          <Route path="/game" exact element={<GamePage />} />
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
