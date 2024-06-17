import { Fragment, useState, useRef, useEffect} from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ProjectStats } from '../utils/interfaces.ts'


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
    async function fetchData(){
      try{
        const response = await fetch('http://localhost:3000/api/project-stats')
        const responseJSON = await response.json();
        const responseData = responseJSON.data;
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
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            display: false, // Hide the y-axis numbers
          },
          grid: {
            display: false, // Hide the y-axis grid lines
          },
        },
        x: {
          grid: {
            display: false, // Hide the x-axis grid lines
          },
        },
      },
      plugins: {
        legend: {
          display: false, // Hide the legend
        },
      }
    };

    return <Bar data={data} options={options} />;
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
                  {renderBarChart(q.answers)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2> Statistics for {projectStats.projectName} </h2>
      <div>{renderAnswers()}</div>
    </div>
  )
}
