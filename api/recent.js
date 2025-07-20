import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://www.exophase.com/nintendo/user/56e497b70d5d0d54/');
    const html = await response.text();
    const $ = cheerio.load(html);

    const games = [];

    $('.game-card').each((i, el) => {
      const title = $(el).find('.game-title').text().trim();
      const timePlayed = $(el).find('.gametime').text().trim();
      const img = $(el).find('img').attr('src');
      if (title) {
        games.push({ title, timePlayed, img });
      }
    });

    res.status(200).json(games.slice(0, 5));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
