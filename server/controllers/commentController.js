import { insertComments, findProjectComments } from '../models/queries.js'

let comments = {};
let QUESTION_ID;
// Insert every 10 comments
let commentBatchSize = 10;

export async function storeComment(projectId, commentObj){
  QUESTION_ID = commentObj.questionId;
  if(!comments[projectId]){
    comments[projectId] = [commentObj];
  }else{
    comments[projectId].push(commentObj);
  }
  if(comments[projectId] && comments[projectId].length % commentBatchSize === 0){
    await storeCommentBatch(projectId, commentObj.questionId)
  }
  return comments[projectId];
}

export async function storeCommentBatch(projectId){
  if(comments[projectId] && comments[projectId].length > 0){
    console.log('Sending comments to DB...')
    await insertComments(projectId, QUESTION_ID, comments[projectId])
    comments[projectId] = [];
    return comments[projectId]
  }
}

export async function getProjectComments(projectId){
  const questionResponses = await findProjectComments(projectId);
  // Return flatten array of all comments
  // const projectComments = questionResponses.flatMap((question) => {
  //   return question.comments;
  // })
  //return projectComments;
  return questionResponses;
}

