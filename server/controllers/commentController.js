import { insertComments } from '../models/queries.js'

let commentCount = 0;
let comments = {};
export async function storeComment(projectId, comment){
  commentCount++;
  if(!comments[projectId]){
    comments[projectId] = [comment]
  }else{
    comments[projectId].push(comment);
  }
  // Insert every 20 comments 
  if(commentCount % 10 === 0){
    await insertComments(projectId, comment.questionId, comments[projectId])
    commentCount = 0;
    comments[projectId] = [];
  }
}