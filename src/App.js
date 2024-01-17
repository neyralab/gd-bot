import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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

function App() {
  const dispatch = useDispatch();
  const [tariffs, setTariffs] = useState(null);
  const fileDirection = useSelector(selectDirection);
  const currentUser = {
    id: tg.initDataUnsafe.user.id,
    username: tg.initDataUnsafe.user.username,
    first_name: tg.initDataUnsafe.user.first_name,
    last_name: tg.initDataUnsafe.user.last_name,
    hash: tg.initDataUnsafe.hash,
    auth_date: tg.initDataUnsafe.auth_date,
    // hardcode for local
    // id: 769774901,
    // username: "sir_Malinfield",
  };

  const onPageLoad = async () => {
    try {
      const { token } = await authorizeUser(currentUser);
      setToken(token);
      await getUserEffect(token).then((data) => {
        dispatch(setUser(data.user));
        dispatch(setCurrentWorkspace(data.current_workspace));
        dispatch(setWorkspacePlan(data.workspace_plan));
      });
      await getWorkspacesEffect(token).then((data) =>
        dispatch(setAllWorkspaces(data))
      );
      await storageListEffect(token).then((data) => {
        setTariffs(data);
      });
    } catch (error) {
      console.warn(error);
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
