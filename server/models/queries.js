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

export async function insertComments(projectId, commentsArray){
  try{
    const result = await ProjectResponses.findOneAndUpdate(
      { 
        projectId: projectId,
        'questions.id': questionId
      },
      {
        $push: { 'questions.$.comments': { $each: commentsArray } }
      },
      {
        new: true // Return the updated document
      }
    );

    if (result) {
      console.log('Comments inserted successfully');
    } else {
      console.error('Project or question not found');
    }
  } catch (error) {
    console.error(`Insert error occurred: ${error}`);
  }
}

export async function insertAnswer(projectId, answerData){
  try {
    const questionId = answerData.id
    const result = await ProjectResponses.findOneAndUpdate(
      { 
        projectId: projectId,
        'questions.id': questionId
      },
      {
        $push: { 'questions.$.answers': answerData.userAnswer }
      },
      {
        new: true // Return the updated document
      }
    );

    if (!result) {
      // Project or question not found, create a new project
      const newProject = new ProjectResponses({
        projectId: projectId,
        questions: [{
          id: questionId,
          answers: [answerData.userAnswer]
        }]
      });
      await newProject.save();
      console.log('Project and answer inserted successfully');
    } else {
      console.log('Answer inserted successfully');
    }
  } catch (error) {
    console.error(`Insert error occurred: ${error}`);
  }
}
