export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { token, text } = req.body;
  if (!token || !text) {
    return res.status(400).json({ error: 'Missing token or text' });
  }
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'Translate to Chinese. Return only translation.' },
          { role: 'user', content: text }
        ],
        stream: false
      })
    });
    if (!response.ok) throw new Error('API failed');
    const data = await response.json();
    res.json({ translation: data.choices[0].message.content.trim() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
