
//@ts-ignore
import {User} from '../../../Models/'

 
  export interface ICreateSessionRequest {
    date: string;
    teacherId: number;
    details: string;
  }
  
  export interface ICreateSessionResponse {
    session: {
      status: 'Pending' | 'Accepted' | 'Rejected';
      details: string;
      userId: number;
      teacherId: number;
    };
    message: string;
  }
  export interface ISession {
    id: number;
    date: Date;
    status: 'Pending' | 'Accepted' | 'Rejected';
    details: string;
    userId: number;
    teacherId: number;
    user?: {
      name: string;
      email: string;
    };
  }