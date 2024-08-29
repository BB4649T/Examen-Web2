// src/chart.js

import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Assurez-vous que le package est installé pour les formats de date

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, TimeScale);

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
            return `${label}: ${context.raw.toFixed(2)}`;
          }
          return context.raw.toFixed(2);
        },
      },
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'month', // Utilisez 'month' pour afficher les données mensuelles
        tooltipFormat: 'MMM yyyy', // Format pour les infobulles
        displayFormats: {
          month: 'MMM yyyy', // Format d'affichage des dates sur l'axe des X
        },
      },
      title: {
        display: true,
        text: 'Date',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Valeur Amortie',
      },
      ticks: {
        callback: (value) => `${value.toFixed(2)}`, // Format des ticks de l'axe des Y
      },
    },
  },
});