// chart.js
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
            return `${label}: ${context.raw.toFixed(2)}`; // Affiche la valeur
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
        unit: 'year',
        tooltipFormat: 'MMM yyyy', // Utiliser 'yyyy' pour l'année
        displayFormats: {
          year: 'yyyy', // Utiliser 'yyyy' pour l'année
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
        callback: (value) => value.toFixed(2),
      },
    },
  },
});