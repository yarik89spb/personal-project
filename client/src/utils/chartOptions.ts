import { ChartOptions } from 'chart.js';

export const barChartOptions: ChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      display: true,
      color: 'white', // Font color for counts
      font: {
        size: 14, // Font size
        weight: 'bold', // Font weight
      },
      formatter: (value) => value.toString(), // Display value on top of each bar
      backgroundColor: 'rgba(48, 101, 112, 0.5)', // Background color for labels (options)
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
        color: 'white', // Font color for labels (options)
        font: {
          size: 12, // Font size
          weight: 'bold', // Font weight
        },
      },
    },
  },
};