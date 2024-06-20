import { getUserActivity } from '../models/queries.js'
import jieba from 'node-jieba';
import sw from 'stopword';

// function sanitizeCommentsArray(commentsArray){
//   const commentsTokenized = jieba.cut(commentsArray.join(''))
//   const commentsSanitized = sw.removeStopwords(commentsTokenized, sw.zh);
//   return commentsSanitized;
// }

export async function getProjectStatistics(projectId){
  const {projectName, questionsContent, userActivity} = await getUserActivity(projectId);
  let answerCountsArray = [];
  let commentsAll = [];
  try{
    for(let question of questionsContent){
      let questionAnswersObj = {
        title:question.title,
        totalAnswers:0, 
        totalCorrectAnswers: 0,
        comments:[],
        answers: [],
        reactions: []
      }
      
      let questionAnswers = userActivity.find((q) => q.id == question.id).answers;
      let answerCounts = questionAnswers.reduce((acc, val) => {
        const answerText = val.text;
        questionAnswersObj.totalAnswers += 1;
        questionAnswersObj.totalCorrectAnswers += val.isCorrect ? 1 : 0;
        acc[answerText] = (acc[answerText] || 0) + 1;
        return acc;
      }, {})
      questionAnswersObj.answers =  Object.entries(answerCounts);
      const currentQuestionComments = userActivity
      .find((q) => q.id == question.id).comments
      .map((c) => c.text);
      questionAnswersObj.comments = currentQuestionComments;
      questionAnswersObj.commentsAmount = currentQuestionComments.length;
      // commentsAll.push(sanitizeCommentsArray(currentQuestionComments));
      answerCountsArray.push(questionAnswersObj);
    }
  } catch(error) {
    console.log(error)
  }
  
  return {projectName:projectName, data: answerCountsArray}
}
