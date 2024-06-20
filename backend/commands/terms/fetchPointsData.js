import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

let cachedPointsData = null;
let lastFetchTime = null;

async function fetchPointsData() {
  if (!cachedPointsData || Date.now() - lastFetchTime > 600000) {
    // 10 minutes in milliseconds
    const response = await fetch(`${process.env.GD_BACKEND_URL}/api/gd/points`);
    if (!response.ok) {
      throw new Error('Failed to fetch points data');
    }
    cachedPointsData = await response.json();
    lastFetchTime = Date.now();
  }
  return cachedPointsData;
}

export default fetchPointsData;
