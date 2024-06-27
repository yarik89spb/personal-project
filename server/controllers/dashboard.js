import { getUserActivity } from '../models/queries.js'

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
        totalReactions: 0,
        totalPositiveReactions: 0,
        comments:[],
        answers: [],
        reactions: []
      }
      // Answers
      let questionAnswers = userActivity.find((q) => q.id == question.id).answers;
      let answerCounts = questionAnswers.reduce((acc, val) => {
        const answerText = val.text;
        questionAnswersObj.totalAnswers += 1;
        questionAnswersObj.totalCorrectAnswers += val.isCorrect ? 1 : 0;
        acc[answerText] = (acc[answerText] || 0) + 1;
        return acc;
      }, {})
      questionAnswersObj.answers =  Object.entries(answerCounts);
      // Reactions (emoji)
      let questionReactions = userActivity.find((q) => q.id == question.id).reactions;
      let reactionCounts = questionReactions.reduce((acc, val) => {
        const reactionType = val.type;
        const isPositive = val.isPositive;
        // Irrelevant to reduce, but utilize the for loop
        questionAnswersObj.totalReactions += 1;
        questionAnswersObj.totalPositiveReactions += val.isPositive ? 1 : 0;
        //
        if (!acc[reactionType]) {
          acc[reactionType] = { count: 0, sentiment: isPositive ? 'positive' : 'negative' };
        }
        acc[reactionType].count += 1;
        return acc;
      }, {})
      questionAnswersObj.reactions =  Object.entries(reactionCounts);

      const currentQuestionComments = userActivity
      .find((q) => q.id == question.id).comments
      .map((c) => c.text);
      questionAnswersObj.comments = currentQuestionComments;
      questionAnswersObj.commentsAmount = currentQuestionComments.length;
      answerCountsArray.push(questionAnswersObj);
    }
  } catch(error) {
    console.log(error)
  }
  
  return {projectName:projectName, data: answerCountsArray}
}
