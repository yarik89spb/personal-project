import { ChartOptions } from 'chart.js';

export const barChartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      display: true,
      color: 'white', 
      font: {
        size: 14, 
        weight: 'bold', 
      },
      formatter: (value) => value.toString(),
      backgroundColor: 'rgba(48, 101, 112, 0.5)', 
      borderRadius: 4, 
      padding: {
        top: 4,
        bottom: 4,
        left: 8,
        right: 8,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        display: false,
      },
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'white', 
        font: {
          size: 16, 
          weight: 'bold',
        },
      },
    },
  },
};