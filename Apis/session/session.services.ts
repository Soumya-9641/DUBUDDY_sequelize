
import express, { Response, Request } from "express";
import {ICreateSessionRequest, ICreateSessionResponse,ISession}
from "./Types/session.types";
import {IUser} from "../user/Types/user.types"
import isStudent from "../../middlewares/checkAuth";
//@ts-ignore
import {User} from "../../Models/"
//@ts-ignore
import {Skill} from "../../Models/"
//@ts-ignore
import {Session} from '../../Models/'
export const bookSession = async(userid:number,userData:any)=>{
    const { date, teacherId, details }= userData;
    const teacher = await User.findByPk(teacherId);
        console.log(teacher.dataValues)
        //@ts-ignore
        const student = await User.findByPk(userid); 
  
        if (!teacher.dataValues || !teacher.dataValues.isTeacher) {
          return ({session:{status: 'Pending' ,
            details: "",
            userId: 0,
            teacherId: 0}, message: "Teacher not found or is not a teacher" });
        }
  
        if (!student.dataValues) {
          return ({session:{status: 'Pending' ,
          details: "",
          userId: 0,
          teacherId: 0}, message: "Student not found or is not a student" });
        }
  

        //@ts-ignore
        const usrid=userid
        const session = await Session.create({
          userId:usrid ,
          teacherId,
          date: new Date(date),
          details
        });

       return  ({session:{status: 'Pending' ,
        details: details,
        userId: usrid,
        teacherId: teacherId}, message: "Booked succesffully" });
}

export const getallSessions= async(userId:number)=>{
    console.log(`Fetching sessions for userId: ${userId}`);
  
    try {
      const sessions = await Session.findAll({
        where: { userId },
        include: [{ model: User, as: 'teacher', attributes: ['name', 'email'] }],
      });
  
      console.log(`Fetched sessions: ${JSON.stringify(sessions)}`);
      return sessions;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw new Error('Unable to fetch sessions');
    }
}

export const getPendingSessionsForTeacher = async (teacherId: number): Promise<ISession[]> => {
    try {
      const sessionsData = await Session.findAll({
        where: {
          teacherId,
          status: 'Pending',
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['name', 'email'],
          },
        ],
      });
  
      const sessions = sessionsData.filter((session:any) => session.user !== null);
      return sessions;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching sessions');
    }
  };

  export const getAllTeachers = async (): Promise<IUser[]> => {
    try {
      const teachers = await User.findAll({
        where: { isTeacher: true },
        attributes: ['id', 'name'], // Only select the fields you need
      });
  
      return teachers;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching teachers');
    }
  };

  export const updateSessionStatus = async (sessionId: number, teacherId: number, status: string): Promise<ISession | null> => {
    const session = await Session.findOne({ where: { id: sessionId, teacherId } });
  
    if (!session) {
      return null;
    }
  
    session.status = status;
    await session.save();
  
    return session;
  };
  export const getAcceptedSessionsByTeacher = async (teacherId: number): Promise<ISession[]> => {
    const sessions = await Session.findAll({
      where: { teacherId, status: 'Accepted' },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
    });
  
    return sessions;
  };


  export const addSkillsToUser = async (userId:number,skillNames: string[]) => {
    try {
       
      const user = await User.findByPk(userId);
      if (!user) {
        return ({ message: 'User not found' });
      }
  
      // Ensure all skills exist, create any that don't
      const skills = await Promise.all(
        skillNames.map(async (name: string) => {
          let skill = await Skill.findOne({ where: { name } });
          if (!skill) {
            skill = await Skill.create({ name });
          }
          return skill;
        })
      );
  
     
      await user.addSkills(skills);
  
      return ({ message: 'Skills added to user successfully' });
    } catch (error) {
      console.error(error);
      return ({ error: 'Internal server error' });
    }
  };


 export const addUsertoSkill = async(name:string,userIds:number[])=>{
      try{
        const skill = await Skill.create({ name });
  
 
      if (userIds && userIds.length > 0) {
        const users = await User.findAll({ where: { id: userIds } });
        await skill.addUsers(users);
      }
  
      return ({ message: 'Skill created and associated with users successfully' });  

      }catch(err){
          return ({ message: 'Internal server error' }); 
      }
 }

 export const getUserWithSkills = async (userId:number) => {
  try {
    

    
    const user = await User.findByPk(userId, {
      include: [{
        model: Skill,
        as: 'skills',
        through: { attributes: [] } 
      }]
    });

    if (!user) {
      return ({ message: 'User not found' });
    }

    return user;
  } catch (error) {
    console.error(error);
    return ({ error: 'Internal server error' });
  }
};

export const getUsersWithSkill = async (skillId:any) => {
  try {
    //const { skillId } = req.params;

    const skill = await Skill.findByPk(skillId, {
      include: [{
        model: User,
        as: 'users',
        through: { attributes: [] } 
      }]
    });

    if (!skill) {
      return ({ message: 'Skill not found' });
    }

    return skill;
  } catch (error) {
    console.error(error);
    return ({ error: 'Internal server error' });
  }
};