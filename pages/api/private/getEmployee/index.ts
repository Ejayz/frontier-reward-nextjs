import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import Cookies from "cookies";
import instance from "../../db";
import { RowDataPacket } from "mysql2/promise";
dotenv.config();


const JWT_SECRET=process.env.JWT_SECRET || "";


export default async function handler( req: NextApiRequest, res: NextApiResponse){
    if(req.method !== "GET"){
        return res.status(405).json({code:405,message:"Method not allowed"});
    }
    const auth = new Cookies(req,res).get("auth") || "";
    const connection = await instance.getConnection();
    const {page,keyword}=req.query;
    const formattedKeyword = `*${keyword}*`;
    const offset=page?parseInt(page.toString())*10:0;
  const limit=10;
    
    try{
        const verify = jwt.verify(auth,JWT_SECRET);
        if(typeof verify === "string"){
            return res.status(401).json({code:401,message:"User is not authenticated"});
        }
        let employeeResult
        if(keyword==""){
         [employeeResult]=<RowDataPacket[]>await connection.query(`SELECT *,employee_info.id AS CoreId FROM employee_info LEFT JOIN users ON users.id=employee_info.user_id LEFT JOIN user_type ON users.user_type=user_type.id where employee_info.is_exist=1 AND users.user_type!=1 LIMIT ? OFFSET ?`,[ limit,offset]);
        }else{
         [employeeResult]=<RowDataPacket[]>await connection.query(`SELECT *,employee_info.id AS CoreId FROM employee_info LEFT JOIN users ON users.id=employee_info.user_id LEFT JOIN user_type ON users.user_type=user_type.id where (MATCH (users.email) AGAINST (? IN BOOLEAN MODE) OR MATCH (employee_info.first_name) AGAINST (? IN BOOLEAN MODE) OR MATCH (employee_info.middle_name) AGAINST (? IN BOOLEAN MODE) OR MATCH (employee_info.last_name) AGAINST (? IN BOOLEAN MODE) OR MATCH (users.phone_number) AGAINST (? IN BOOLEAN MODE)) AND employee_info.is_exist=1 AND users.user_type!=1 LIMIT ? OFFSET ?`,[formattedKeyword,formattedKeyword,formattedKeyword,formattedKeyword,formattedKeyword, limit,offset]);

        }
        return res.status(200).json({code:200,message:"Success",data:employeeResult});
    }catch(error:any){
        console.log(error);
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({code:401,message:"Token expired"});
        }else if(error.name === "JsonWebTokenError"){
            return res.status(401).json({code:401,message:"Invalid token"});
        }else if(error.name === "NotBeforeError"){
            return res.status(401).json({code:401,message:"Invalid token"});
        }
        return res.status(500).json({code:500,message:"Internal server error"});
    }finally{
        await connection.release();
    }

}