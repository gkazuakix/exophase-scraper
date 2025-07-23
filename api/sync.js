import FormData from 'form-data';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new FormData();

    const response = await fetch('https://api.exophase.com/account/sync/manual', {
      method: 'POST',
      headers: {
        'Cookie': `ACCESS_TOKEN=${process.env.EXOPHASE_ACCESS_TOKEN}`,
        ...form.getHeaders(), // very important!
      },
      body: form,
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to sync', body: text });
    }

    res.status(200).json({ message: 'Sync triggered successfully', body: text });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
