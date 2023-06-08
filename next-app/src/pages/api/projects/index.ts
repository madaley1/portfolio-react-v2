export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      res.status(200).json({ name: 'John Doe' });
    }
  } catch (e) {
    if (!(e instanceof Error)) return;
    res.status(500).json({ error: e.message });
  }
}
