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

  
const isTeacher = async (req: CustomRequest, res: Response, next: NextFunction) => {
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
        return res.status(403).json({ message: 'Only teacher can fill the session request' });
      } else {
        req.user = user;
        next();
       
      }
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Authentication failed' });
    }
  };
  
  export default isTeacher;