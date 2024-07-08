import { ChartOptions } from 'chart.js';

export const barChartOptions: ChartOptions<'bar'> = {
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
        color: 'dark-grey', 
        font: {
          size: 16, 
          weight: 'bold',
        },
      },
    },
  },
};

export const sankeyOptions = {
  sankey: {
    node: {
      interactivity: true,
      // [total, total positive, total negative, heart, like, dislike]
      colors:  ['#3366CC', '#109618', '#DE2311', '#0FCD54', '#9CF86C', '#C61254'],
      label: {
        fontName: 'Roboto',
        fontSize: 20,
        color: 'white',
        bold: true,
      }
    },
    link: {
      colorMode: 'gradient', // Use 'source' or 'target' for single color, 'gradient' for gradient
      colors: {
        'Total Reactions->Total Positive Reactions': '#FFFFFF',
        'Total Reactions->Total Negative Reactions': '#FFFFFF',
        'Total Positive Reactions->like': '#FFFFFF',
        'Total Positive Reactions->love': '#FFFFFF',
        'Total Positive Reactions->heart': '#FFFFFF',
      }
    }
  }
};