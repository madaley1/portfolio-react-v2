// vercel database client
import { createClient } from '@vercel/postgres';

// hashing functionality
import * as crypto from 'crypto';

export default async function handler(req: any, res: any) {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  await client.connect();
  if (req.query.email && req.query.password) {
    const queryPassword = req.query.password;
    const queryEmail = req.query.email;
    try {
      if (req.method === 'GET') {
        const { rows } =
          await client.sql`SELECT * FROM users WHERE email = ${queryEmail}`;
        if (!rows[0]) {
          res.status(200).json({ login: false, cause: 'Email' });
          return;
        }
        const acctpassword = rows[0].password;
        const acctSalt = rows[0].salt;

        const unhashedFinalPass = queryPassword + acctSalt;
        if (!process.env.NEXT_PUBLIC_PASS_HASH) {
          throw new Error('No hash found in environment variables');
        }
        const hash = process.env.NEXT_PUBLIC_PASS_HASH;

        const hashedFinalPass = crypto
          .pbkdf2Sync(unhashedFinalPass, acctSalt, 1000, 32, hash)
          .toString('hex');
        if (acctpassword === hashedFinalPass) {
          res.status(200).json({ login: true, message: 'Login Successful' });
        } else {
          res.status(200).json({ login: false, cause: 'Password' });
        }
      }
    } catch (e) {
      if (!(e instanceof Error)) return;
      res.status(500).json({ error: e.message });
    } finally {
      await client.end();
    }
    return;
  }
  try {
    res.status(200).json({ message: 'Please send a User and a Pasword' });
  } catch (e) {
    if (!(e instanceof Error)) return;
    res.status(500).json({ error: e.message });
  } finally {
    await client.end();
  }
}
