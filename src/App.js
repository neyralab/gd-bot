import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

import { setInitData, setLink, setUser } from './store/reducers/userSlice';
import {
  setAllWorkspaces,
  setCurrentWorkspace,
  setWorkspacePlan
} from './store/reducers/workspaceSlice';

import { getUserEffect } from './effects/userEffects';
import { getWorkspacesEffect } from './effects/workspaceEffects';
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
import { Leaderboard } from './pages/leaderboard';
import { TaskPage } from './pages/Task';
import { BoostPage } from './pages/boost';
import { TapPage } from './pages/tap';
import { IntroPage } from './pages/intro';

import './App.css';

const tg = window.Telegram.WebApp;

Sentry.init({
  dsn: 'https://90a01121ff787d65425233b65fae9085@o4506717537042432.ingest.sentry.io/4506717540384768',
  integrations: [new BrowserTracing()]
});

function App() {
  const dispatch = useDispatch();
  const [tariffs, setTariffs] = useState(null);

  const currentUser = {
    initData: tg.initData
  };

  function splitString(str) {
    const halfLength = Math.floor(str.length / 2);
    return [str.substring(0, halfLength), str.substring(halfLength)];
  }
  const onPageLoad = async () => {
    try {
      dispatch(setInitData(tg.initData));
      const [part1, part2] = splitString(JSON.stringify(currentUser));
      Sentry.captureMessage(`currentUser: ${JSON.stringify(currentUser)}`);
      Sentry.captureMessage(`currentUser1: ${JSON.stringify(part1)}`);
      Sentry.captureMessage(`currentUser2: ${JSON.stringify(part2)}`);
      const { token } = await authorizeUser(
        currentUser,
        tg?.initDataUnsafe?.start_param
      );
      if (!token) throw new Error('token not found');
      await getUserEffect(token).then((data) => {
        const code = data.user?.referral?.code;
        const prefix = 'https://t.me/share/';
        const botUrl = `https://t.me/${process.env.REACT_APP_BOT_NAME}?start=${code}`;
        const url = `${prefix}?url=${botUrl}`;
        const linkPayload = {
          copy: botUrl,
          send: url,
          label: `@t.me/${code}`
        };
        dispatch(setLink(linkPayload));
        dispatch(setUser({ ...data.user, points: data?.points || 0 }));
        dispatch(setCurrentWorkspace(data.current_workspace));
        dispatch(setWorkspacePlan(data.workspace_plan));
      });
      await getWorkspacesEffect(token).then((data) => {
        dispatch(setAllWorkspaces(data));
      });
      await storageListEffect(token).then((data) => {
        setTariffs(data);
      });
      Sentry.captureMessage(`App is successfully running`);
    } catch (error) {
      Sentry.captureMessage(
        `Error ${error?.response?.status} in App in request '${error?.response?.config?.url}': ${error?.response?.data?.message}`
      );
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    tg.ready();
    tg?.expand();
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
            element={<StartPage onClose={onClose} />}
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
          <Route path="/ref" exact element={<Referral />} />
          <Route path="/task" exact element={<TaskPage />} />
          <Route path="/leadboard" exact element={<Leaderboard />} />
          <Route
            path="/boost"
            exact
            element={<BoostPage tariffs={tariffs} />}
          />
        </Routes>
      </SharedLayout>
    </TonConnectUIProvider>
  );
}

export default App;
