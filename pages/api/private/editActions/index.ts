import Cookies from 'cookies';
import { NextApiRequest, NextApiResponse } from 'next';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import Connection from '../../db';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
 
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  // Get a database connection
    const connection = await Connection.getConnection();

    // Ensure the request has a valid JWT token
    const auth = new Cookies(req, res).get('auth') || '';
    try {
    const verify = jwt.verify(auth, JWT_SECRET);

    // Extract data from the request body
    const { id, name, description, updated_at } = req.body;

    // Validate that required parameters are present
    if (!id || !name || !description  || !updated_at) {
      return res.status(400).json({
        code: 400,
        message: 'Missing required parameters',
      });
    }

  
    // Update the action in the database
    const [UpdateActionsResult, UpdateActionsFields] = await connection.query(
      `UPDATE actions SET name=?, description=?, updated_at=? WHERE id=?`,
      [name, description, updated_at, id]
    );

    // Respond with success status
    return res.status(200).json({
      code: 200,
      message: 'Update Actions successfully',
    });
  } catch (error) {
    console.error(error);

    // Respond with an internal server error status
    return res.status(500).json({
      error: 'Internal Server Error',
    });
  } finally {
    // Release the database connection in the finally block
    await Connection.releaseConnection(connection);
  }
}
