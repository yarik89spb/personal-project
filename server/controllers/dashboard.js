import { getUserActivity } from '../models/queries.js'

export async function getProjectStatistics(projectId){

  const {projectName, questionsContent, userActivity} = await getUserActivity(projectId);

  let answerCountsArray = []
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
    questionAnswersObj.comments = userActivity
    .find((q) => q.id == question.id).comments
    .map((c) => c.text);
    questionAnswersObj.commentsAmount = questionAnswersObj.comments.length;

    answerCountsArray.push(questionAnswersObj);
  }
  console.log(answerCountsArray);
  return {projectName:projectName, data: answerCountsArray}
}

getProjectStatistics('b84a11fs68ccs3');