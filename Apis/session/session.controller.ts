import express, { Response, Request } from "express";
const router = express.Router();
import bcrypt from 'bcrypt';
//@ts-ignore
import {User} from "../../Models/"
 
//@ts-ignore
import {Session} from '../../Models/'
//@ts-ignore
import {Skill} from "../../Models/"
//@ts-ignore
import{Student} from "../../Models/"
//@ts-ignore
import{Post} from "../../Models/"
//@ts-ignore
import{Comment} from "../../Models/"
import {ICreateSessionRequest, ICreateSessionResponse}
from "./Types/session.types";

import isStudent from "../../middlewares/checkAuth";
import isTeacher from "../../middlewares/checkTeacher";
import {CustomRequest} from "../../middlewares/checkAuth"
import { bookSession,getallSessions ,getPendingSessionsForTeacher,getAllTeachers,updateSessionStatus,
  getAcceptedSessionsByTeacher,addSkillsToUser,addUsertoSkill,getUserWithSkills,getUsersWithSkill} from "./session.services";

router.post(
    "/book-session",
    isStudent,
    async (req: Request, res: Response) => {
      try {
        const { date, teacherId, details } = req.body;
        //@ts-ignore
        const usrid=req.user.id
        const userData= { date, teacherId, details };
        
        const data= await bookSession(usrid,userData);
       
        res.status(201).json(data);
      } catch (err) {
        console.error(err);
        res.status(500).json({session:{status: 'Pending' ,
        details: "",
        userId: 0,
        teacherId: 0}, message: "Teacher not found or is not a teacher" });
      }
    }
  );

  router.get("/sessions",isStudent,async(req:Request,res:Response)=>{
    try{
       //@ts-ignore
          const userId=req.user.id;
          //console.log(userId)
          const session= await getallSessions(userId);
          res.status(200).json({ data: session });
    }catch(err){
      res.status(500).json({ error: 'Internal server error' });
    }
  })


  router.get("/sessions/requests",isTeacher,async(req:Request,res:Response)=>{
    try{
        //@ts-ignore
        const teacherId=req.user.id;
        const resuestSession= await getPendingSessionsForTeacher(teacherId);
        res.status(201).json({data:resuestSession});
    }catch(err){
      res.status(500).json({ error: 'Internal server error' });
    }
  })

  router.get("/getallteachers",isStudent,async(req:Request,res:Response)=>{
    try{
      const teachers = await getAllTeachers();
      res.status(201).json({data:teachers});
    }catch(err){
      res.status(500).json({ error: 'Internal server error' });
    }
  })

  router.put("/sessions/:sessionId/update-status",isTeacher,async(req:Request,res:Response)=>{
    try{
      const { sessionId } = req.params;
      const { status } = req.body;
      //@ts-ignore
      const teacherId = req.user!.id; 
      const session = await updateSessionStatus(Number(sessionId), teacherId, status);
      if (!session) {
        return res.status(404).json({ error: 'Session not found or unauthorized.' });
      }
      res.status(200).send({data:session, message: 'Session status updated successfully.' });
    }catch(err){
      res.status(500).json({ error: 'Internal server error' });
    }

  })

  router.get("/sessions/acceptedrequests",isTeacher,async(req:Request,res:Response)=>{
    try{
      //@ts-ignore
      const teacherId = req.user!.id; // Assume req.user is set by isTeacher middleware

      const sessions = await getAcceptedSessionsByTeacher(teacherId);
  
      res.status(200).send(sessions);
    }catch(err){
      res.status(500).json({ error: 'Internal server error' });
    }
  })
  router.get("/testing",async(req,res)=>{
    try{

      res.status(200).send("hello")

    }catch(err){
      console.log(err);
    }
  })
  router.post("/skills",async(req: Request, res: Response)=>{
    try {
      const { name, userIds } = req.body;
  
      // Create the skill
      const data= await addUsertoSkill(name,userIds);
      
      res.status(201).json({data:data});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })

  router.post("/addSkills",isStudent,async(req:Request,res:Response)=>{
    try {
      //@ts-ignore
      const userId  = req.user.id;
      const { skillNames } = req.body; // Assuming skill names are provided
      const data= await addSkillsToUser(userId,skillNames);
      
      res.status(201).json({data:data});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  })

 
router.get("/getSkills",isStudent,async(req:Request,res:Response)=>{
  try{
      //@ts-ignore
      const userId= req.user.id;
      const data= await getUserWithSkills(userId);
      res.status(201).json({data:data});
  }catch(err){
    console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
})

router.get("/getuserWithSkill/:skillId",async(req:Request,res:Response)=>{
  try{
    const { skillId } = req.params;
    const data = await getUsersWithSkill(skillId);
    res.status(201).json({data:data});

  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post("/addskillwithuser",async(req:Request,res:Response)=>{
  try {
    const { name, email, password, isTeacher, skills } = req.body;

    //const skillInstances = [];

   // Loop through each skill name and find or create the skill
    // for (const skillName of skills) {
    //   const [skill] = await Skill.findOrCreate({ where: { name: skillName } });
    //   skillInstances.push(skill.dataValues);
    // }

   // console.log(skillInstances)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(
      {
        name,
        email,
        password:hashedPassword,
        isTeacher,
        skills: skills,
      },
      {
        include: [{ model: Skill, as: 'skills', through: 'UserSkill'}],
      }
    );

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})



router.post("/addpostcomment",async(req:Request,res:Response)=>{
  try {
    const { name, email, posts } = req.body;

    const user = await Student.create({ name, email });

    // Create posts and comments
    for (const post of posts) {
      const createdPost = await Post.create({
        title: post.title,
        content: post.content,
        StudentId: user.id, // Associate the post with the student
      });

      for (const comment of post.comments) {
        await Comment.create({
          content: comment.content,
          PostId: createdPost.id, // Associate the comment with the post
        });
      }
    }

    const createdUser = await Student.findOne({
      where: { id: user.id},
      include: {
        model: Post,
        include: [Comment],
      },
    });

    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/users-with-sessions', async (req:Request, res:Response) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Session,
          as: 'sessionsAsStudent',
          required: true, // INNER JOIN
        }
      ],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;