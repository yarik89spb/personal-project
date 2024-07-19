import Router from 'express';
import { signUp, signIn, validateJWT } from '../controllers/userController.js';

const router = Router();

router.post('/signup', async (req, res) => {
  try{
    const userData = {
      userEmail: req.body.userEmail,
      userName: req.body.userName,
      userPassword: req.body.userPassword,
      userCompany: req.body.userCompany
    }
    if(!userData.userEmail || !userData.userPassword || !userData.userName){
      throw new Error('Incomplete user credentials');
    }
    const userObject = await signUp(userData);
    res.status(201).json(userObject);
  } catch(error) {
    console.error(error)
    res.status(400).json({text: `Failed to register user. ${error.message}`})
  }
})

router.post('/signin', async (req, res) => {
  try{
    const userData = {
      userEmail: req.body.userEmail,
      userPassword: req.body.userPassword,
    }
    if(!userData.userEmail || !userData.userPassword){
      throw new Error('Incomplete user credentials');
    }
    const userObject = await signIn(userData);
    res.status(201).json(userObject);
  } catch(error) {
    console.error(error)
    res.status(400).json({text: `Failed to login. ${error.message}`})
  }
})

router.get('/verify', (req, res) => {
  // Verify jwt validity
  try{
    const authHeader = req.headers.authorization;
    const userJWT = authHeader.split(' ')[1];
    if(!userJWT){
      throw new Error('Missing JWT')
    }
    const payload = validateJWT(userJWT);
    if(payload){
      res.status(200).json(payload);
    }else{
      throw new Error('JWT validation failed.')
    }
  } catch(error) {
    res.status(400).json({text: `Incorrect or epxired JWT. ${error.message}`})
  }
})

export default router;
