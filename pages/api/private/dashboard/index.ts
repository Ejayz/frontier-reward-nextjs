import { NextApiRequest, NextApiResponse } from "next";
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'


export default async function handler(req:NextApiRequest, res:NextApiResponse){
    if(req.method !== 'GET'){
        return res.status(405).json({message: 'Method not allowed'})
    }
   

}