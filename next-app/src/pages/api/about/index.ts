// vercel database client
import { createClient } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  const client = createClient({
    connectionString: process.env.NEXT_PUBLIC_POSTGRES_URL_NON_POOLING,
  });
  await client.connect();
  try {
    if (req.method === 'GET') {
      const { rows } = await client.query('SELECT * FROM about');
      console.log(rows);
      res.status(200).json({ rows });
    } else if (req.method === 'POST') {
      const { rows } = await client.query('SELECT * FROM about');
    } else if (req.method === 'PATCH') {
      const { rows } = await client.query('SELECT * FROM about');
    } else if (req.method === 'DELETE') {
      const { rows } = await client.query('SELECT * FROM about');
    }
  } catch (e) {
    if (!(e instanceof Error)) return;
    res.status(500).json({ error: e.message });
  }
}
