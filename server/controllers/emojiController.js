import { insertEmoji } from '../models/queries.js'

let emojies = {};
let QUESTION_ID;
// Insert every 10 emoji
const emojiBatchSize = 10;

export async function storeEmoji(projectId, emojiObj){
  QUESTION_ID = emojiObj.questionId;
  if(!emojies[projectId]){
    emojies[projectId] = [emojiObj]
  }else{
    emojies[projectId].push(emojiObj);
  }
  if(emojies[projectId] && emojies[projectId].length % emojiBatchSize === 0){
    await storeEmojiBatch(projectId, emojiObj.questionId)
  }
}

export async function storeEmojiBatch(projectId){
  if(emojies[projectId] && emojies[projectId].length > 0){
    console.log('Sending emoji to DB...')
    await insertEmoji(projectId, QUESTION_ID, emojies[projectId])
    emojies[projectId] = [];
  }
}