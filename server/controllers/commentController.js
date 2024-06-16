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
  console.log(commentCount % 10)
  if(commentCount % 10 === 0){
    console.log('Fire!')
    comments[projectId] = [];
    commentCount = 0;
    await insertComments(projectId, comments[projectId])
  }
}