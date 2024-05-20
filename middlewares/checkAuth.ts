import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {IUser} from '../Apis/user/Types/user.types'
//@ts-ignore
import {User} from "../Models/";
import dotenv from 'dotenv';

dotenv.config();
export interface CustomRequest<T = any> extends Request {
    user?: IUser; 
    body: T;
  }

const isStudent=async(req:CustomRequest,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const decoded: any = jwt.verify(token, 'secretkey');
    
        const user = await User.findByPk(decoded.userId); 
    
        if (!user) {
          return res.status(403).json({ message: 'User access denied' });
        }
    
        if (!user.isTeacher) {
          req.user = user;
          next();
        } else {
          return res.status(403).json({ message: 'Only students can fill the session request' });
        }
      } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Authentication failed' });
      }
    
  
}

export default isStudent