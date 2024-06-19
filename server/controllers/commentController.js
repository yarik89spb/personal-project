import { insertComments } from '../models/queries.js'

let commentCount = 0;
let comments = {};
let QUESTION_ID;
export async function storeComment(projectId, comment){
  QUESTION_ID = comment.questionId;
  commentCount++;
  if(!comments[projectId]){
    comments[projectId] = [comment]
  }else{
    comments[projectId].push(comment);
  }
  // Insert every 20 comments
  if(commentCount % 10 === 0){
    await storeCurrentBatch(projectId, comment.questionId)
  }
}

export async function storeCurrentBatch(projectId){
  if(comments[projectId].length > 0){
    console.log('Sending comments to DB...')
    await insertComments(projectId, QUESTION_ID, comments[projectId])
    commentCount = 0;
    comments[projectId] = [];
  }
}