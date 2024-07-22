import { useState,  useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ProjectStats, ReactionTuple } from '../utils/interfaces.ts'
import { barChartOptions, sankeyOptions } from '../utils/chartOptions.ts'
import WordCloud, { Options } from 'react-wordcloud';
import { Chart } from "react-google-charts";
import './StatsView.css';
import { useCookies } from 'react-cookie';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);


// interface StatsViewProps{
//   projectId: string;
// }

export default function StatsView(){

  interface WordCount {
    text: string;
    value: number;
  }

  const { projectId } = useParams();
  const [projectStats, setProjectStats] = useState<ProjectStats>({
    projectName: 'No project',
    data: []
  });
  const [wordCounts, setWordCounts] = useState<WordCount[]>([{
    text:'nothing',
    value: 0}])
  const [plotType, setPlotType] = useState<String>('answers');
  const [loading, setLoading] = useState(true);
  const [cookies]  = useCookies(['jwt']);



  useEffect(() => {
    async function fetchResponses(): Promise<void>{
      try{
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/project-stats?projectId=${projectId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${cookies.jwt}`,
          },
        })
        const responseJSON = await response.json();
        const responseData: ProjectStats = responseJSON.data;
        setProjectStats(responseData);
        setLoading(false)

      } catch(error){
        console.error(`Failed to get project response. ${error}`)
      }
    }
    async function fetchWordCounts(){
      try{
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard/word-counts?projectId=${projectId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${cookies.jwt}`,
          },
        })
        const responseJSON = await response.json();
        const wordCounts = responseJSON.data;
        setWordCounts(wordCounts);

      } catch(error){
        console.error(`Failed to get project response. ${error}`)
      }
    }

    fetchResponses();
    fetchWordCounts();
  }, [])

  function renderBarChart(answers: [string, number][]){
    const labels = answers.map((a) => a[0]);
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Number of Answers',
          data: answers.map((a) => a[1]),
          backgroundColor: 'rgba(48, 101, 112, 0.8)',
          backgroundRadius: 5,
          borderColor: 'rgba(255, 255, 255, 0.8)',
          borderWidth: 5,
          borderRadius: 5, 
        },
      ],
    };

    // barChartOptions is exported from chartOptions...
    return <Bar data={data} options={barChartOptions} className="custom-bar"/>;
  }

  const renderSankeyDiagram = (reactionArray: ReactionTuple[]) => {
    // Reshape data into: ["From", "To", "Weight"]
    // Include links from total positive and total negative to individual reactions
    const positiveReactions = reactionArray.filter(([_, { sentiment }]) => sentiment === 'positive');
    const negativeReactions = reactionArray.filter(([_, { sentiment }]) => sentiment === 'negative');
  
    const positiveCount = positiveReactions.reduce((sum, [_, { count }]) => sum + count, 0);
    const negativeCount = negativeReactions.reduce((sum, [_, { count }]) => sum + count, 0);
  
    const totalLinks = [
      ["Total", "Positive", positiveCount],
      ["Total", "Negative", negativeCount],
      ...positiveReactions.map(([reactionType, { count }]) => ["Positive", reactionType, count]),
      ...negativeReactions.map(([reactionType, { count }]) => ["Negative", reactionType, count]),
    ];
  
    const data = [["From", "To", "Weight"], ...totalLinks];

    if(!projectStats || !projectStats.data){
      return (
        <div className="container">
          <h4> No reaction submitted...</h4>
        </div>
    )
    }
  
    return (
      <div className="row mb-3">
        <div className="col-12">
          <Chart
            chartType="Sankey"
            width="100%"
            height="300px"
            data={data}
            options={sankeyOptions}
          />
        </div>
      </div>
    );
  };

  function renderAnswers() {
    if(!projectStats || !projectStats.data){
      return (
        <div className="container">
          <h4> No answers submitted...</h4>
        </div>
    )
    }

    return (
      <div className="container">
        <div className="row">
          {projectStats.data.map((q) => (
            <div key={q.title} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-header">
                  <h5>Question: {q.title}</h5>
                </div>
                <div className="card-body">
                  {renderBarChart(q.answers.map((a) => [a[0], parseInt(a[1])]))}
                </div>
                <div className="card-footer">
                  <div className="row">
                    <div className="col-md-6 mb-3">Total answers: {q.totalAnswers}</div>
                    <div className="col-md-6 mb-3">Correct answers: {q.totalCorrectAnswers}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function displayPlot(plotType:String){
    if(plotType==='answers'){
      return (<div> {renderAnswers()} </div>)
    }else if(plotType==='reactions'){
      if(loading || !projectStats){
        return (
          <div className='container'>
            <h4> Data is loading...</h4>
          </div> 
          )
      }

      return (
      <div>{projectStats.data.map((questionData, index) => (
        <div key={index}>
          <div className="row">
            <div className="col-12">
              <h5 className='sankey question-title'>{questionData.title}</h5>
            </div>
          </div>
          {renderSankeyDiagram(questionData.reactions)}
        </div>
      ))}</div>
    )
    }
  }

  function renderWordCloud(){
    const options: Partial<Options> = {
      fontFamily: 'Arial',
      rotations: 4,
      rotationAngles: [-90, 0],
      scale: 'sqrt',
      fontSizes: [50, 80],
    };
    if(!wordCounts){
      return <h4> No word counts avaialble</h4>
    }
    return (

      <div style={{ width: '100%', height: '100%' }}>
        <WordCloud options={options} words={wordCounts} />
      </div>
    );
  }

  return (
    <div className="container-fluid bg-dark text-white">
      <div className="container mt-5">
        {projectStats && projectStats.projectName ? 
          <h2> Statistics for {projectStats.projectName} </h2> : 
          <h2> No Statistics available</h2>}
        <div className='row'>
          <div className='d-flex justify-content-center'>
            <button 
              className='plot-switcher left me-0'
              onClick={() => {setPlotType('answers')}}>
                Answers
            </button>
            <button 
              className='plot-switcher right me-0'
              onClick={() => {setPlotType('reactions')}}>
                Reactions
            </button>
          </div>
        </div>
        <div>{displayPlot(plotType)}</div>
      </div>
      <div className="container word-cloud mt-5">
        <h3 className='word-cloud-title'> Most used words </h3>
        <div>{renderWordCloud()}</div>
      </div>
    </div>
  )
}
