import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const accountSid = 'ACa8885500a174ce819aa528dff9a5715e';
  const authToken = 'ad17cdf417595e3a4ad0a08e5b162294';
  const client = new twilio.Twilio(accountSid, authToken);

  const numbers = req.body.numbers; // Array of phone numbers
  const message = 'Your bulk message here!';

  try {
    const promises = numbers.map((number:any) => {
      return client.messages.create({
        to: number,
        from: '17855092315',
        body: message,
      });
    });

    await Promise.all(promises);

    res.status(200).json({ success: true, message: 'Bulk messages sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error sending bulk messages' });
  }
}
