export interface IUser {
    name: string;
    email: string;
    password: string;
    isTeacher?: boolean;
  }
  
//   export interface IUserDocument extends IUser, Document {
//     _id: string;
//   }
  
  export interface IRegisterRequest {
    name: string;
    email: string;
    password: string;
    isTeacher?: boolean;
  }
  
  export interface ILoginRequest {
    email: string;
    password: string;
  }
  
  export interface IRegisterResponse {
    user: IUser;
    message: string;
    token: string;
  }
  
  export interface ILoginResponse {
    isUser: string;
    user: IUser;
    message: string;
    token: string;
  }