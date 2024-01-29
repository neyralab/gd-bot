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

  const getHash = () => {
    const data = tg.initData;
    const hashRegex = /&hash=([a-zA-Z0-9]+)/;
    const match = data.match(hashRegex);

    if (match && match[1]) {
      const hash = match[1];
      return hash;
    } else {
      alert("Something is wrong, please try again later");
    }
  };

  const getAuthDate = () => {
    const data = tg.initData;

    const authDateRegex = /&auth_date=(\d+)/;
    const authDateMatch = data.match(authDateRegex);

    if (authDateMatch && authDateMatch[1]) {
      const authDate = parseInt(authDateMatch[1]);
      return authDate;
    } else {
      alert("Something is wrong, please try again later");
    }
  };

  const currentUser = {
    id: 659092804,
    username: "hanna_vazhlivtseva",
    first_name: "Hanna",
    last_name: "Vazhlivtseva",
    photo_url:
      "https://t.me/i/userpic/320/9LNe-my3z_dbFDMUJW78_bsgWkRmDkzSZ7HNGWvDnFw.jpg",
    hash: "1a749da5cef1de0d6fdc1be1534ca666ad7cca80dcf839a9326234c22816a335",
    auth_date: 1706516445,
  };

  const onPageLoad = async () => {
    try {
      const { token } = await authorizeUser(currentUser);
      setToken(token);
      alert(token);
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
