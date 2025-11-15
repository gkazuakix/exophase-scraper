const axios = require("axios");

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET'); // allow GET requests
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // allow content headers

  // You might need to handle preflight (OPTIONS) requests too:
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const url = "https://api.exophase.com/public/player/4983302/games";
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept":
          "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Referer": "https://www.exophase.com/",
        "Origin": "https://www.exophase.com",
        "DNT": "1",
        "Connection": "keep-alive",
      },
      decompress: true
    });
    const games = response.data.games;

    // Get the most recent game
    const recentGame = games
      .filter(game => game.lastplayed > 0)
      .sort((a, b) => b.lastplayed - a.lastplayed)[0];

    if (!recentGame) {
      return res.status(404).json({ error: "No games found" });
    }

    const result = {
      title: recentGame.meta.title,
      playtime: recentGame.playtime,
      image: recentGame.resource_tile,
      last_played_unix: recentGame.lastplayed,
      last_played: new Date(recentGame.lastplayed * 1000).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "medium",
        timeZone: "America/Chicago"
      })
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching games:", error.message);
    res.status(500).json({ error: "Failed to fetch games" });
  }
};
