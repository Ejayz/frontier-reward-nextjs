// pages/api/private/twilio.js

import twilio from 'twilio';
import dotenv from 'dotenv';
import { NextApiRequest, NextApiResponse } from 'next';

dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export default async function handler(req: NextApiRequest,res: NextApiResponse) {
  try {
    // Your condition to determine whether to send an SMS or not
    const shouldSendSMS = true; // Replace with your condition

    if (shouldSendSMS) {
      const message = await client.messages.create({
        body: 'Hello from Twilio',
        to: '+639654508419', // Replace with the recipient's phone number
        from: TWILIO_PHONE_NUMBER,
      });

      console.log(message.sid);
      res.status(200).json({ message: 'SMS sent successfully' });
    } else {
      res.status(200).json({ message: 'SMS not sent' });
    }
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ message: 'Error sending SMS' });
  }
}
