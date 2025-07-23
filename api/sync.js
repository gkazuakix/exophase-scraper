export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.exophase.com/account/sync/manual', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryD3gG39NL53q5ghrj',
        'Cookie': `ACCESS_TOKEN=${process.env.EXOPHASE_ACCESS_TOKEN}`,
      },
      body: '------WebKitFormBoundaryD3gG39NL53q5ghrj--'
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return res.status(response.status).json({ error: 'Failed to sync', body: errorBody });
    }

    res.status(200).json({ message: 'Sync triggered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Request failed', details: err.message });
  }
}
