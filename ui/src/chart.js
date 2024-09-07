// src/chart.js

import { Chart as ChartJS, LineElement, LinearScale, Tooltip, Legend, TimeScale, CategoryScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, LinearScale, Tooltip, Legend, TimeScale, CategoryScale);

export const getLineChartOptions = () => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.dataset.label || '';
          if (label) {
            return `${label}: ${context.raw.y.toFixed(2)}% (${context.raw.x.toLocaleDateString()})`;
          }
          return `${context.raw.y.toFixed(2)}% (${context.raw.x.toLocaleDateString()})`;
        },
      },
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'month',
        tooltipFormat: 'MMM yyyy',
        displayFormats: {
          month: 'MMM yyyy',
        },
      },
      title: {
        display: true,
        text: 'Date',
      },
      ticks: {
        source: 'data',
      },
    },
    y: {
      min: 0,
      max: 100,
      title: {
        display: true,
        text: 'Taux d\'Amortissement (%)',
      },
      ticks: {
        stepSize: 10,
      },
    },
  },
});