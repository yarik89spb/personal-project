import { useState,  useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ProjectStats } from '../utils/interfaces.ts'
import { barChartOptions } from '../utils/chartOptions.ts'
import WordCloud, { Options } from 'react-wordcloud';
import './StatsView.css';


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


  useEffect(() => {
    async function fetchResponses(): Promise<void>{
      try{
        console.log(projectId)
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project-stats?projectId=${projectId}`)
        const responseJSON = await response.json();
        const responseData: ProjectStats = responseJSON.data;
        setProjectStats(responseData);

      } catch(error){
        console.error(`Failed to get project response. ${error}`)
      }
    }
    async function fetchWordCounts(){
      try{
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/word-counts?projectId=${projectId}`)
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

  function renderAnswers() {
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

  function renderWordCloud(){
    const options: Partial<Options> = {
      fontFamily: 'Arial',
      rotations: 2,
      rotationAngles: [-90, 0],
      scale: 'sqrt',
      fontSizes: [20, 50],
    };

  
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <WordCloud options={options} words={wordCounts} />
      </div>
    );
  }

  return (
    <div className="container-fluid bg-dark text-white">
      <div className="container mt-5">
        <h2> Statistics for {projectStats.projectName} </h2>
        <div>{renderAnswers()}</div>
      </div>
      <div className="container mt-5">
        <div>{renderWordCloud()}</div>
      </div>
    </div>
  )
}
