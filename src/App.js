import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { StartPage, FilesSystemPage } from "./components/pages";
import { UpgradeStoragePage } from "./components/upgradeStorage";
import { FilesPage } from "./components/filesPage";

import "./App.css";

const tg = window.Telegram.WebApp;

function App() {
  useEffect(() => {
    tg.ready();
  }, []);

  const onClose = () => {
    tg.close();
  };
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<StartPage />} />
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
          element={<UpgradeStoragePage onClose={onClose} />}
        />
      </Routes>
    </div>
  );
}

export default App;
