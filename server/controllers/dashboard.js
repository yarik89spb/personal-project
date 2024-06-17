import { getUserActivity } from '../models/queries.js'

export async function getProjectStatistics(projectId){

  const {projectName, questionsContent, userActivity} = await getUserActivity(projectId);


  const answerCountsArray = []
  for(let question of questionsContent){
    //question.id 
    //
    // let questionAnswers = userActivity.find((q) => q.id == question.id).answers;
    // let questionComments= userActivity.find((q) => q.id == question.id).comments;
    // let answerCounts = questionAnswers.map((q) => q.text).reduce((acc, val) => {
    //   console.log(val)
    //   if(acc[val]){
    //     acc[val] += 1;
    //   } else{
    //     acc[val] = 1;
    //   }    
    //   return acc;
    // }, {})
    // answerCountsArray.push({title:question.title, answers: answerCounts});
    // let asnwerCounts = questionAnswers.reduce( , 0)
    // console.log(questionActivity.answers.find((questionObject)=>questionObject.id == question.id))
    //console.log(questionActivity);

    // questionAnswerCounts[question.title] = 
  }
  // const formattedOutput = JSON.stringify(answerCountsArray, null, 2);
  console.log(answerCountsArray)
}
