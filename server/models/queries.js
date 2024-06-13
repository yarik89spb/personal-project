import ViewerResponse from './ViewerResponse.js';
import UserProject from './UserProject.js';

export async function testQuery() {
  try {
    const firstViewerResponse = await ViewerResponse.findOne();
    console.log("First viewer response:", firstViewerResponse);
  } catch (error) {
    console.error(`Query error occurred: ${error}`);
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

export async function getProjectData(projectId) {
  console.log('Hi')
  try {
    const projectData = await UserProject.findById(projectId);
    return projectData;
  } catch (error) {
    console.error(`Query error occurred: ${error}`);
  }
}
