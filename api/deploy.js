const WEBASE = 'http://8.137.93.11:5002/WeBASE-Front';

export default async function handler(req, res) {
  try {
    const r    = await fetch(`${WEBASE}/contract/deploy`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(req.body),
    });
    const text = await r.text();
    res.status(r.status).send(text);
  } catch (e) {
    res.status(502).json({ message: `无法连接 WeBASE-Front: ${e.message}` });
  }
}
