import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { addNewUser, searchUserByEmail } from '../models/queries.js'

function sanitizeData(inputString){
  const newString = inputString.trim().toLowerCase();
  return newString
}

async function hashPassword(userPassword){
  const saltRounds = 10;
  try {
    const pwdHash = await bcrypt.hash(userPassword, saltRounds)
    return pwdHash
  } catch (error) {
    throw new Error(`Failed to hash the password ${error}`); 
}}

function createJWT({userEmail, userName, userCompany}){
  const payload = {
    userEmail,
    userName,
    userCompany
  };
  try{
    const userJWT = jwt.sign(
      payload, 
      process.env.JWT_SECRET, {
      expiresIn: '2h',
      });
      return userJWT
  } catch (error) {
    throw new Error(`Failed to create a JWT ${error}`)
  }
  
  
}

export async function signUp(userData){
  try{
    const userEmail = sanitizeData(userData.userEmail);
    const userHashedPwd = await hashPassword(userData.userPassword);
    const userName = userData.userName ? userData.userName: 'User';
    const userCompany = userData.userCompany ? userData.userCompany: 'None';
    const userId = await addNewUser({
      userEmail, 
      userName, 
      userHashedPwd, 
      userCompany: userData.userCompany});
    const userJWT = createJWT({
      userEmail, 
      userName: userData.userName, 
      userCompany: userData.userCompany});
    const userObject = {userJWT, user: {userId, userEmail, userName, userCompany}};
    return userObject;

  } catch(error) {
    throw new Error(`${error.message}`);
  }
}

export async function signIn(userData){
  try{
    const userEmail = sanitizeData(userData.userEmail);
    // Search user by email
    const searchResult = await searchUserByEmail(userEmail);

    const correctPwd = searchResult.userHashedPwd;
    const {userName} = searchResult;
    const userId = searchResult._id;
    const {userCompany} = searchResult;
    
    const pwdValidity = await bcrypt.compare(userData.userPassword, correctPwd);
    if (!pwdValidity) {
      throw new Error('Invalid password');
    }

    const userJWT = createJWT({
      userEmail, 
      userName, 
      userCompany});
    const userObject = {userJWT, user: {userId, userEmail, userName, userCompany}};
    return userObject;

  } catch(error) {
    throw new Error(`${error.message}`);
  }
}