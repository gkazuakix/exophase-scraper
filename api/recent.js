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
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
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
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching games:", error.message);
    res.status(500).json({ error: "Failed to fetch games" });
  }
};
