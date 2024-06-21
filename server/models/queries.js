import ViewerResponse from './ViewerResponse.js';
import UserProject from './UserProject.js';
import ProjectResponses from './ProjectResponses.js'

export async function testQuery() {
  try {
    const document = await ViewerResponse.findOne();
    console.log("Query result:", document);
    return document;
  } catch (error) {
    console.error("Query error:", error);
    throw error;
  }
}

export async function insertTestData(dataObj) {
  try {
    const result = await UserProject.create(dataObj);
    console.log('Project inserted id:', result._id);
  } catch (error) {
    console.error(`Insert error occurred: ${error}`);
  }
}

export async function insertTestResponse(responseObj) {
  try {
    const result = await ViewerResponse.create(responseObj);
    console.log('Response inserted id:', result._id);
  } catch (error) {
    console.error(`Insert error occurred: ${error}`);
  }
}

export async function getProjectData(projectId) {
  try {
    const projectData = await UserProject.findById(projectId);
    console.log(projectData)
    return projectData;
  } catch (error) {
    console.error(`Query error occurred: ${error}`);
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

export async function insertAnswer(projectId, answerData){
  try {
    const { id: questionId, userAnswer } = answerData;
    console.log(userAnswer);
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

    const questionsData = await UserProject.findOne({ projectId: projectId });
    const projectName = questionsData.projectName;
    const questionsContent = questionsData.questions;

    return {projectName, questionsContent, userActivity};

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
