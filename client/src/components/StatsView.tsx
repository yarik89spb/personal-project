import { useState,  useEffect} from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ProjectStats } from '../utils/interfaces.ts'
import { barChartOptions } from '../utils/chartOptions.ts'
import './StatsView.css';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);


// interface StatsViewProps{
//   projectId: string;
// }

export default function StatsView(){

  const [projectStats, setProjectStats] = useState<ProjectStats>({
    projectName: 'No project',
    data: []
  });

  useEffect(() => {
    async function fetchData(): Promise<void>{
      try{
        const response = await fetch('/api/project-stats')
        const responseJSON = await response.json();
        const responseData: ProjectStats = responseJSON.data;
        console.log(responseData);
        setProjectStats(responseData);
      } catch(error){
        console.error(`Failed to get project data. ${error}`)
      }
    }
    fetchData();
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

  return (
    <div className="container-fluid bg-dark text-white">
      <div className="container mt-5">
        <h2> Statistics for {projectStats.projectName} </h2>
        <div>{renderAnswers()}</div>
      </div>
    </div>
  )
}
