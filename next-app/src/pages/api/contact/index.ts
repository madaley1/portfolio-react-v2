import sgMail from '@sendgrid/mail';

export default async function handler(req: any, res: any) {
  const values = req.body;

  const sgApiKey = process.env.SENDGRID_API_KEY;
  const sgEmail = process.env.SENDGRID_EMAIL;
  if (!sgApiKey || !sgEmail) {
    res.status(500).json({ message: 'error', error: 'SendGrid key not found' });
  } else {
    sgMail.setApiKey(sgApiKey);
    const html = `
    <p>First Name: ${values.fname}</p>
    <p>Last Name: ${values.lname}</p>
    <p>Email: ${values.email}</p>
    <p>Message: ${values.message}</p>
    `;
    const data = {
      to: sgEmail,
      from: sgEmail,
      subject: `New Message from ${values.fname} ${values.lname}`,
      text: values.message,
      html,
    };
    try {
      await sgMail.send(data);
      res.status(200).send('Email sent successfully');
    } catch (error) {
      res.status(500).send('Error sending email');
    }
  }
}
