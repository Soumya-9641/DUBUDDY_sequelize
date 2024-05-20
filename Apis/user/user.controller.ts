import express, { Response, Request } from "express";
const router = express.Router();
import { registerUser,loginUser } from "./user.services";
import { IRegisterRequest,IRegisterResponse,ILoginRequest,ILoginResponse} from "./Types/user.types";
router.post(
    '/register',
    async (req: Request<{}, IRegisterResponse, IRegisterRequest>, res: Response<IRegisterResponse>) => {
      console.log(req.body)
      try {
        if (!req.body) {
            throw new Error('Request body is empty');
          }
        const {name,email,password,isTeacher} = req.body;
        //console.log(userData)
        console.log(name)
        if (!name || !email || !password) {
            throw new Error('Missing required fields');
          }
        const userData={name,email,password,isTeacher}
        const data = await registerUser(userData);
        res.status(201).json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ user: { name: '', email: '', password: '' }, message: 'Registration failed', token: '' });
      }
    }
  );

  router.get("/testing",async(req,res)=>{
    console.log(req.body)
    try{
            res.status(200).send("Hello")
    }catch(err){
        console.log(err);
        res.status(400).send('error');
    }
  })

  router.post("/login",async (req: Request<{}, ILoginResponse, ILoginRequest>, res: Response<ILoginResponse>)=>{
        try{
          if (!req.body) {
            throw new Error('Request body is empty');
          }
          const { email, password } = req.body;
          if(!email || !password){
            throw new Error('Missing required fields');
          }
          const userData={email,password}
        const data = await loginUser(userData);
        res.status(201).json(data);
        }catch(err){
          console.log(err);
          res.status(500).json({isUser:"null", user: { name: '', email: '', password: '' }, message: 'Login failed', token: '' });
        }
  })

export default router;