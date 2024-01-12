  import Cookies from 'cookies';
  import { NextApiRequest, NextApiResponse } from 'next';
  import * as jwt from 'jsonwebtoken';
  import * as dotenv from 'dotenv';
  import Connection from '../../db';
  import { RowDataPacket } from 'mysql2/promise';

  dotenv.config();
  const JWT_SECRET=process.env.JWT_SECRET||'';
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    const connection=await Connection.getConnection();
    const auth= new Cookies(req,res).get('auth')||'';
      try {
    const verify=jwt.verify(auth,JWT_SECRET);
    const { id, name, description, created_at, updated_at } = req.body;

    if (!id || !name || !description || !created_at || !updated_at) {
      return res.status(400).json({ code: 400, message: "Missing required parameters" });
    }
    const [UpdateActionsResult, UpdateActionsFields] = await connection.query(
      `UPDATE actions SET name=?, description=?, updated_at=? WHERE id=?`,
      [name, description, created_at, updated_at, id]
    );
    return res.status(200).json({ code: 200, message: "Update Actions successfully" });

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }finally{
        await Connection.releaseConnection(connection);
      }
  }
