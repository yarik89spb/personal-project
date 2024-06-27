import { insertEmoji } from '../models/queries.js'

let emojies = {};
let QUESTION_ID;

export async function storeEmoji(projectId, emojiObj){
  QUESTION_ID = emojiObj.questionId;
  if(!emojies[projectId]){
    emojies[projectId] = [emojiObj]
  }else{
    emojies[projectId].push(emojiObj);
  }
  // Insert every 20 emoji
  if(emojies[projectId] && emojies[projectId].length % 10 === 0){
    await storeCurrentBatch(projectId, emojiObj.questionId)
  }
}

export async function storeCurrentBatch(projectId){
  if(emojies[projectId] && emojies[projectId].length > 0){
    console.log('Sending emoji to DB...')
    await insertEmoji(projectId, QUESTION_ID, emojies[projectId])
    emojies[projectId] = [];
  }
}