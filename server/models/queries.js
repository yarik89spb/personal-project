import ViewerResponse from './ViewerResponse.js';
import UserProject from './UserProject.js';
import ProjectResponses from './ProjectResponses.js'
import User from './User.js'
import BroadcastingStatus from './BroadcastingStatus.js';

export async function startBroadcasting(projectId){
  try{
    const broadcastingObj = await BroadcastingStatus.findOne({ projectId });
    broadcastingObj.isBroadcasting = true;
    await broadcastingObj.save();
    return true;
  } catch (error){
    throw new Error(`Could not start broadcasting ${error}`)
  }
}

export async function stopBroadcasting(projectId){
  try{
    const broadcastingObj = await BroadcastingStatus.findOne({ projectId });
    broadcastingObj.isBroadcasting = false;
    await broadcastingObj.save();
    return false;
  } catch (error){
    throw new Error(`Could not stop broadcasting ${error}`)
  }
}

export async function addNewUser({userEmail, userName, userHashedPwd, userCompany}){
  try{
    const searchResult = await User.findOne({ userEmail });
    if (searchResult) {
      throw new Error('User with this email already exists');
    }

  } catch(error){
    throw new Error(`Could not add new user: ${error}`)
  }
  
  const newUser = new User({userEmail, userName, userHashedPwd, userCompany, projects: []});
  const savedUser = await newUser.save();
  return savedUser._id;
}

export async function searchUserByEmail(userEmail){
  try{
    const result = await User.findOne({ userEmail });
    if(!result){
      throw new Error(`No user with email '${userEmail}'`);
    }
    return result

  } catch (error) {
    throw new Error(`Could no find the user data. ${error.message}`)
  }
}

export async function insertProjectData(dataObj) {
  try {
    // Project data
    const result = await UserProject.create(dataObj);
    const projectId = result._id;
    const {userId} = dataObj;
    const {projectName} = dataObj;
    console.log('Project inserted id:', projectId); 
    // Add project to the corresponding user projects
    const user = await User.findById(userId);
    const {userEmail} = user
    if (!user) {
      throw new Error('User not found');
    }
    user.projects.push({
      projectId, 
      projectName: projectName,
      description: dataObj.description
    });
    await user.save();
    // Create record in broadcasting-status collection
    await BroadcastingStatus.create({
      isBroadcasting: false,
      userId,
      userEmail,
      projectId,
      projectName
    });

    return projectId;
  } catch (error) {
    console.error(`Insert error occurred: ${error}`);
  }
}

export async function deleteProjectData(userId, projectId) {
  try {
    // Delete project questions and info
    const projectToDelete = await UserProject.findByIdAndDelete(projectId);
    if (!projectToDelete) {
      throw new Error(`Project with ID ${projectId} does not exist`);
    }
    // Delete project from projects list in user profile
    const user = await User.findById(userId);
    if(!user){
      throw new Error(`User with id ${userId} does not exist`)
    }
    user.projects = user.projects.filter((project)=>project.projectId !== projectId);
    await user.save();
    // Delete project responses
    const deletedDocument = await ProjectResponses.findOneAndDelete({projectId});
    if(!deletedDocument){
      console.error(`Project ${userId} has no responses`)
    }
    // Delete broadcasting object
    const broadcastingObj = await BroadcastingStatus.findOneAndDelete({projectId});
    if(!broadcastingObj){
      console.error(`Project ${userId} has no broadcasting records`)
    }
    return projectId;
  } catch (error) {
    console.error(`Deletion error occurred: ${error}`);
  }
}

export async function searchUserById(userId) {
  try {
    const userData = await User.findById(userId);
    if(!userData){
      throw new Error(`User not found`)
    }
    return userData;
  } catch (error) {
    console.error(`Failed to get project data: ${error}`);
  }
}

export async function searchProjectById(projectId) {
  try {
    const projectData = await UserProject.findById(projectId);
    if(!projectData){
      throw new Error('Project not found')
    }
    return projectData;
  } catch (error) {
    console.error(`Failed to get project data: ${error}`);
  }
}

export async function insertComments(projectId, questionId, comments) {
  try {
    console.log(`Inserting comments into projectId: ${projectId}, questionId: ${questionId}`);
    // Try to update the specific question's comments if it exists
    const result = await ProjectResponses.updateOne(
      { projectId: projectId, 'questions.id': questionId },
      { $push: { 'questions.$.comments': { $each: comments } } }
    );

    if (result.matchedCount === 0) {
      // If the specific question was not found, update the project to add the question
      const projectUpdateResult = await ProjectResponses.updateOne(
        { projectId: projectId },
        {
          $addToSet: {
            wordCounts: [],
            questions: {
              id: questionId,
              comments: comments,
              reactions: [],
              answers: []
            }
          }
        },
        { upsert: true } // Create the project if it doesn't exist
      );



      if (projectUpdateResult.matchedCount === 0 && projectUpdateResult.upsertedCount === 0) {
        console.error('Project not found and not created');
      } else {
        console.log('Project or question created and comments inserted successfully');
      }
    } else {
      console.log('Comments inserted into existing question successfully');
    }
  } catch (error) {
    console.error('Insert error occurred:', error);
  }
}

export async function insertEmoji(projectId, questionId, emojies) {
  try {
    console.log(`Inserting emojies into projectId: ${projectId}, questionId: ${questionId}`);
    // Try to update the specific question's emojies if it exists
    const result = await ProjectResponses.updateOne(
      { projectId: projectId, 'questions.id': questionId },
      { $push: { 'questions.$.reactions': { $each: emojies } } }
    );

    if (result.matchedCount === 0) {
      // If the specific question was not found, update the project to add the question
      const projectUpdateResult = await ProjectResponses.updateOne(
        { projectId: projectId },
        {
          $addToSet: {
            wordCounts: [],
            questions: {
              id: questionId,
              comments: [],
              reactions: emojies,
              answers: []
            }
          }
        },
        { upsert: true } // Create the project if it doesn't exist
      );



      if (projectUpdateResult.matchedCount === 0 && projectUpdateResult.upsertedCount === 0) {
        console.error('Project not found and not created');
      } else {
        console.log('Project or question created and emojies inserted successfully');
      }
    } else {
      console.log('Emojies inserted into existing question successfully');
    }
  } catch (error) {
    console.error('Insert error occurred:', error);
  }
}

export async function insertAnswer(projectId, answerData){
  try {
    const { id: questionId, userAnswer } = answerData;
    const result = await ProjectResponses.updateOne(
      { projectId: projectId, 'questions.id': questionId },
      { $push: { 'questions.$.answers': userAnswer } }
    );

    

    if (result.matchedCount === 0) {
      // If the specific question was not found, update the project to add the question
      const projectUpdateResult = await ProjectResponses.updateOne(
        { projectId: projectId },
        {
          $addToSet: {
            wordCounts: [], 
            questions: {
              id: questionId,
              comments: [],
              reactions: [],
              answers: [userAnswer],
            }
          }
        },
        { upsert: true } // Create the project if it doesn't exist
      );

      if (projectUpdateResult.matchedCount === 0 && projectUpdateResult.upsertedCount === 0) {
        console.error('Project not found and not created');
      } else {
        console.log('Project or question created and answer inserted successfully');
      }
    } else {
      console.log('Answer inserted into existing question successfully');
    }
  } catch (error) {
    console.error('Insert error occurred:', error);
  }
}


export async function getUserActivity(projectId) {
  try {
    const reactionData = await ProjectResponses.findOne({ projectId: projectId });
    const userActivity = reactionData.questions;
    const questionsData = await UserProject.findById(projectId);
    const projectName = questionsData.projectName;
    const questionsContent = questionsData.questions;

    return {projectName, questionsContent, userActivity};

  } catch (error) {
    console.error('Fetch error occurred:', error);
    throw error;
  }
}

export async function findProjectComments(projectId){
  try{
    const reactionData = await ProjectResponses.findOne({ projectId: projectId });
    if(reactionData === null){
      return []
    }
    return reactionData.questions;
  } catch (error) {
    console.error('Fetch error occurred:', error);
    throw error;
  }
}

export async function getWordCounts(projectId) {
  try {
    const reactionData = await ProjectResponses.findOne({ projectId: projectId });
    const wordCounts = reactionData.wordCounts;
    return wordCounts;

  } catch (error) {
    console.error('Fetch error occurred:', error);
    throw error;
  }
}
