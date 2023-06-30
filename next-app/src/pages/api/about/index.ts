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
      res.status(200).json({ rows });
    } else if (req.method === 'POST') {
      const { title, text } = req.query;
      const query = `INSERT INTO about (about_section, about_text) VALUES('${title}', '${text}')`;
      const { rows } = await client.query(query);
      res.status(200).json(rows);
    } else if (req.method === 'PATCH') {
      const { title, text, id } = req.query;
      if (!id) {
        res.status(400).json({ error: 'id is required' });
      } else if (!title) {
        const query = `UPDATE about SET about_text = '${text}' WHERE id = ${id};`;
        await client.query(query);
        res.status(200).json({ message: 'updated' });
      } else if (!text) {
        const query = `UPDATE about SET about_section = '${title}' WHERE id = ${id};`;
        await client.query(query);
        res.status(200).json({ message: 'updated' });
      } else {
        const query = `UPDATE about SET about_section = '${title}', about_text = '${text}' WHERE id = ${id};`;
        await client.query(query);
        res.status(200).json({ message: 'updated' });
      }
    } else if (req.method === 'DELETE') {
      const query = `DELETE FROM about WHERE id = ${req.query.id}`;
      await client.query(query);
      res.status(200).json({ message: 'deleted' });
    }
  } catch (e) {
    if (!(e instanceof Error)) return;

    res.status(500).json({ error: e.message });
  }
}
