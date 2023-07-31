import axios from 'axios';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'POST') {
      const response = async () => {
        const { recaptchaResponse } = req.body;
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
        return await axios.post(url);
      };
      const responseData = await response();
      const { data } = responseData;
      const { success } = data;
      if (!data) {
        res.status(500).json({ error: 'Recaptcha failed' });
      } else {
        res.status(200).json({ success });
      }
    }
  } catch (err) {
    console.log(err);
  }
}
