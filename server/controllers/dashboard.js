import { getUserActivity } from '../models/queries.js'

export async function getProjectStatistics(projectId){

  const {projectName, questionsContent, userActivity} = await getUserActivity(projectId);


  const questionAnswerCounts = {}
  for(let question of questionsContent){
    //question.id 
    //
    let questionAnswers = userActivity.find((q) => q.id == question.id).answers;
    // let asnwerCounts = questionAnswers.reduce( , 0)
    // console.log(questionActivity.answers.find((questionObject)=>questionObject.id == question.id))
    //console.log(questionActivity);

    // questionAnswerCounts[question.title] = 
  }
}
