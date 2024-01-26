// pages/api/actions.js
import { NextApiRequest, NextApiResponse } from "next";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import Cookies from "cookies";
import instance from "../../db";
import { RowDataPacket } from "mysql2";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
    const auth = new Cookies(req, res).get("auth") || "";
  const verify = jwt.verify(auth, JWT_SECRET);
  const connection = await instance.getConnection();
    let current_user = 0;
    if (typeof verify === "string") {
      res.status(401).json({ code:401,message: "Invalid token" });
    } else if (verify?.main_id) {
      current_user = verify.main_id;
    
    } else {
      res.status(401).json({ code:401,message: "Invalid token format" })
    }

    const { name, description,start_date,end_date,status, package_id,employee_id, created_at, updated_at,removed_at, is_exist } = req.body;
    try {
      const [results,fields] =<RowDataPacket[]> await connection.query(`INSERT INTO campaign (name,description,start_date,end_date,status,package_id,employee_id,is_exist) VALUES (?,?,?,?,?,?,?,?)`
      , [name,description,new Date(start_date).toISOString().slice(0, 19).replace('T', ' '),new Date(end_date).toISOString().slice(0, 19).replace('T', ' '),"active",package_id,current_user,1])
        if(results.affectedRows>0){
            res.status(201).json({code:201,message:"Campaign created successfully"});
        }else{
            res.status(500).json({code:500,message:"Something went wrong.Please try again"});
        }
   
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    } finally{
      await connection.release()
    }
 

 
}
