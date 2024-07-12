const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const frontendUrl = process.env.VITE_APP_FRONTEND_URL;
const manifest = {
  url: frontendUrl,
  name: 'Ghost Bot',
  iconUrl: `${frontendUrl}/gd_logo.png`
};

const publicDir = path.join(__dirname, 'public');
const manifestPath = path.join(publicDir, 'tonconnect-manifest.json');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
