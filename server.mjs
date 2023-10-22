import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cache from 'memory-cache'; // Add this line
dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;
const STEAM_API_KEY = process.env.STEAM_API_KEY;

app.get('/api/server-info', async (req, res) => {
  const ip = req.query.ip;

  // Check if the data is in cache
  const cachedData = cache.get(ip);
  if (cachedData) {
    return res.json(cachedData);
  }

  // If not in cache, fetch from Steam API
  const response = await fetch(`http://api.steampowered.com/IGameServersService/GetServerList/v1/?key=${STEAM_API_KEY}&filter=\\addr\\${ip}`);
  const data = await response.json();

  // Store in cache for 1 minute
  cache.put(ip, data, 60 * 1000);

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
