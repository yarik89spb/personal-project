import { insertComments, findProjectComments } from '../models/queries.js'

let comments = {};
let QUESTION_ID;
export async function storeComment(projectId, commentObj){
  QUESTION_ID = commentObj.questionId;
  if(!comments[projectId]){
    comments[projectId] = [commentObj]
  }else{
    comments[projectId].push(commentObj);
  }
  // Insert every 20 comments
  if(comments[projectId] && comments[projectId].length % 10 === 0){
    await storeCommentBatch(projectId, commentObj.questionId)
  }
}

export async function storeCommentBatch(projectId){
  if(comments[projectId] && comments[projectId].length > 0){
    console.log('Sending comments to DB...')
    await insertComments(projectId, QUESTION_ID, comments[projectId])
    comments[projectId] = [];
  }
}

export async function getProjectComments(projectId){
  const questionResponses = await findProjectComments(projectId);
  // Return flatten array of all comments
  const projectComments = questionResponses.flatMap((question) => {
    return question.comments;
  })
  return projectComments;
}

