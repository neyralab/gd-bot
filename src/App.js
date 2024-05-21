import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import { setUser } from "./store/reducers/userSlice";
import {
  setAllWorkspaces,
  setCurrentWorkspace,
  setWorkspacePlan,
} from "./store/reducers/workspaceSlice";

import { getUserEffect } from "./effects/userEffects";
import { getWorkspacesEffect } from "./effects/workspaceEffects";
import { authorizeUser, connectUserV8 } from "./effects/authorizeUser";
import { storageListEffect } from "./effects/storageEffects";
import setToken from "./effects/set-token";

import { StartPage } from "./components/startPage";
import { FilesSystemPage } from "./components/filesSystemPage";
import { UpgradeStoragePage } from "./components/upgradeStorage";
import { FilesPage } from "./components/filesPage";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

import "./App.css";

const tg = window.Telegram.WebApp;

Sentry.init({
  dsn: "https://90a01121ff787d65425233b65fae9085@o4506717537042432.ingest.sentry.io/4506717540384768",
  integrations: [new BrowserTracing()],
});

function App() {
  const dispatch = useDispatch();
  const [tariffs, setTariffs] = useState(null);

  const currentUser = {
    initData: tg.initData,
  };

  function splitString(str) {
    const halfLength = Math.floor(str.length / 2);
    return [str.substring(0, halfLength), str.substring(halfLength)];
  }
  const onPageLoad = async () => {
    try {
      const [part1, part2] = splitString(JSON.stringify(currentUser));
      Sentry.captureMessage(`currentUser: ${JSON.stringify(currentUser)}`);
      Sentry.captureMessage(`currentUser1: ${JSON.stringify(part1)}`);
      Sentry.captureMessage(`currentUser2: ${JSON.stringify(part2)}`);
      const { token } = await authorizeUser(currentUser);
      if (!token) throw new Error("token not found");
      Sentry.captureMessage(`token: ${token}`);
      await setToken(token);
      await getUserEffect(token).then((data) => {
        Sentry.captureMessage(
          `getUserEffect response: ${JSON.stringify(data)}`
        );
        dispatch(setUser(data.user));
        dispatch(setCurrentWorkspace(data.current_workspace));
        dispatch(setWorkspacePlan(data.workspace_plan));
      });
      await getWorkspacesEffect(token).then((data) => {
        Sentry.captureMessage(
          `getWorkspacesEffect response: ${JSON.stringify(data)}`
        );
        dispatch(setAllWorkspaces(data));
      });
      await storageListEffect(token).then((data) => {
        Sentry.captureMessage(
          `storageListEffect response: ${JSON.stringify(data)}`
        );
        setTariffs(data);
      });
      Sentry.captureMessage(`App is successfully running`);
      await connectUserV8(tg.initDataUnsafe);
    } catch (error) {
      console.warn(error);
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    tg.ready();
    console.log("tg:", tg);
    onPageLoad();
  }, []);

  const onClose = () => {
    tg.close();
  };

  return (
    <TonConnectUIProvider
      manifestUrl="https://tg.dev.ghostdrive.com/tonconnect-manifest.json"
      actionsConfiguration={{
        twaReturnUrl: "https://tg.dev.ghostdrive.com",
      }}
      network="main">
      <div className="App">
        <Routes>
          <Route path="/" exact element={<StartPage onClose={onClose} />} />
          <Route path="/file-upload" exact element={<FilesSystemPage />} />
          <Route path="/ghostdrive-upload" exact element={<FilesPage />} />
          <Route path="/files" exact element={<FilesPage />} />
          <Route
            path="/upgrade"
            exact
            element={<UpgradeStoragePage tariffs={tariffs} />}
          />
        </Routes>
      </div>
    </TonConnectUIProvider>
  );
}

export default App;
