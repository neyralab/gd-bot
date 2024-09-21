import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

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
