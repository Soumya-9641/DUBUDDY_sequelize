import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//@ts-ignore
import { User } from "../../Models/"

import { IRegisterRequest, IRegisterResponse, ILoginRequest, ILoginResponse } from "./Types/user.types";

export const registerUser = async (userData: IRegisterRequest): Promise<IRegisterResponse> => {
  const { name, email, password, isTeacher } = userData;
  console.log(userData.email)
  const existingUser = await User.findOne({ where: { email } });;
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    isTeacher
  });

  // Generate JWT token
  const token = jwt.sign({ userId: newUser.id }, 'secretkey', {
    expiresIn: '1h'
  });

  return { user: newUser, message: 'User registered successfully', token }
};

export const loginUser = async (userData: ILoginRequest): Promise<ILoginResponse> => {
  const { email, password } = userData;
  let token = "null";
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return ({ isUser: "", user: user, message: 'Authentication failed', token });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return ({ isUser: "", user: user, message: 'Authentication failed', token });
  }
  token = jwt.sign({ userId: user.id }, 'secretkey', {
    expiresIn: '30m', // Set token expiration time
  });
  return ({ isUser: "user", user: user, message: 'Authentication successful', token });
}