import { insertComments } from '../models/queries.js'

let commentCount = 0;
let comments = {};
let QUESTION_ID;
export async function storeComment(projectId, comment){
  console.log(comments.length)
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
    commentCount = 0;
    comments[projectId] = [];
  }
}

export async function storeCurrentBatch(projectId){
  console.log('Sending comments to DB...')
  if(comments.length > 0){
    await insertComments(projectId, QUESTION_ID, comments[projectId])
  }
}