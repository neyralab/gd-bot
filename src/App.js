import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { WelcomePage, UploadPage, FilesSystemPage } from "./components/pages";
import { UpgradeStoragePage } from "./components/upgradeStorage";

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
        <Route path="/" exact element={<WelcomePage onClose={onClose} />} />
        <Route path="/upload" exact element={<UploadPage />} />
        <Route
          path="/file-upload"
          exact
          element={<FilesSystemPage onClose={onClose} />}
        />
        <Route path="/upgrade" exact element={<UpgradeStoragePage />} />
      </Routes>
    </div>
  );
}

export default App;
