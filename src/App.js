import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";

import { setUser } from "./store/reducers/userSlice";
import {
  setAllWorkspaces,
  setCurrentWorkspace,
  setWorkspacePlan,
} from "./store/reducers/workspaceSlice";

import { getUserEffect } from "./effects/userEffects";
import { getWorkspacesEffect } from "./effects/workspaceEffects";
import { authorizeUser } from "./effects/authorizeUser";
import { storageListEffect } from "./effects/storageEffects";

import { StartPage } from "./components/startPage";
import { FilesSystemPage } from "./components/filesSystemPage";
import { UpgradeStoragePage } from "./components/upgradeStorage";
import { FilesPage } from "./components/filesPage";

import "./App.css";

const tg = window.Telegram.WebApp;

function App() {
  const dispatch = useDispatch();
  const [tariffs, setTariffs] = useState(null);
  const currentUser = {
    id: tg.initDataUnsafe.user.id,
    username: tg.initDataUnsafe.user.username,
    first_name: tg.initDataUnsafe.user.first_name,
    last_name: tg.initDataUnsafe.user.last_name,
  };

  const onPageLoad = async () => {
    try {
      const { token } = await authorizeUser(currentUser);
      localStorage.setItem("token", token);
      await getUserEffect(token).then((data) => {
        dispatch(setUser(data.user));
        dispatch(setCurrentWorkspace(data.current_workspace));
        dispatch(setWorkspacePlan(data.workspace_plan));
      });
      await getWorkspacesEffect(token).then((data) =>
        dispatch(setAllWorkspaces(data))
      );
      await storageListEffect().then((data) => {
        setTariffs(data);
      });
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    tg.ready();
    onPageLoad();
  }, []);

  const onClose = () => {
    tg.close();
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<StartPage onClose={onClose} />} />
        <Route path="/file-upload" exact element={<FilesSystemPage />} />
        <Route
          path="/ghostdrive-upload"
          exact
          element={<FilesPage initiator={"upload"} />}
        />
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
