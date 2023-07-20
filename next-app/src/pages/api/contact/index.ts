import axios from 'axios';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'POST') {
      console.log(req.body);

      const verifyRecaptcha = async (token: string) => {
        const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY;

        const verificationUrl =
          'https://www.google.com/recaptcha/api/siteverify?secret=' +
          secretKey +
          '&response=' +
          token;

        return await axios.post(verificationUrl);
      };
      res.status(200).json({ name: 'John Doe' });
    }
  } catch (e) {
    if (!(e instanceof Error)) return;
    res.status(500).json({ error: e.message });
  }
}
