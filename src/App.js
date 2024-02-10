import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import { setUser } from "./store/reducers/userSlice";
import {
  setAllWorkspaces,
  setCurrentWorkspace,
  setWorkspacePlan,
} from "./store/reducers/workspaceSlice";
import { selectDirection, setFiles } from "./store/reducers/filesSlice";

import { getUserEffect } from "./effects/userEffects";
import { getWorkspacesEffect } from "./effects/workspaceEffects";
import { authorizeUser } from "./effects/authorizeUser";
import { storageListEffect } from "./effects/storageEffects";
import setToken from "./effects/set-token";
import { getFilesEffect } from "./effects/filesEffects";

import { StartPage } from "./components/startPage";
import { FilesSystemPage } from "./components/filesSystemPage";
import { UpgradeStoragePage } from "./components/upgradeStorage";
import { FilesPage } from "./components/filesPage";

import "./App.css";

const tg = window.Telegram.WebApp;

Sentry.init({
  dsn: "https://90a01121ff787d65425233b65fae9085@o4506717537042432.ingest.sentry.io/4506717540384768",
  integrations: [new BrowserTracing()],
});

function App() {
  const dispatch = useDispatch();
  const [tariffs, setTariffs] = useState(null);
  const fileDirection = useSelector(selectDirection);

  const currentUser = {
    initData: tg.initData,
  };

  const onPageLoad = async () => {
    try {
      Sentry.captureMessage(`currentUser: ${JSON.stringify(currentUser)}`);
      const { token } = await authorizeUser(currentUser);
      if (!token) throw new Error("token not found");
      Sentry.captureMessage(`token: ${token}`);
      setToken(token);
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
    } catch (error) {
      console.warn(error);
      Sentry.captureException(error);
    }
  };

  const getFiles = async () => {
    const { token } = await authorizeUser(currentUser);
    getFilesEffect(1, fileDirection, token).then((data) => {
      dispatch(setFiles(data.data));
    });
  };

  useEffect(() => {
    tg.ready();
    onPageLoad();
  }, []);

  useEffect(() => {
    getFiles();
  }, [fileDirection]);

  const onClose = () => {
    tg.close();
  };

  return (
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
  );
}

export default App;
