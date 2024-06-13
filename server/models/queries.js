import ViewerResponse from './ViewerResponse.js';
import UserProject from './UserProject.js';

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
