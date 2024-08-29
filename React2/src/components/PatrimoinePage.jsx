// src/components/PatrimoinePage.jsx

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, LinearScale, Tooltip, Legend, TimeScale, CategoryScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { getLineChartOptions } from '../chart';
import { Button } from 'react-bootstrap';
import './PatrimoinePage.css'; // Assurez-vous d'importer le fichier CSS pour le style

ChartJS.register(LineElement, LinearScale, Tooltip, Legend, TimeScale, CategoryScale);

const API_URL = 'http://localhost:3000';

const PatrimoinePage = () => {
  const [possessions, setPossessions] = useState([]);
  const [graphData, setGraphData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetch(`${API_URL}/possession`)
      .then(response => response.json())
      .then(data => {
        setPossessions(data);
        generateGraphData(data);
      })
      .catch(error => console.error('Erreur de récupération des possessions:', error));
  }, []);

  const generateGraphData = (data) => {
    const labels = [];
    const values = [];

    if (data.length === 0) return;

    // Trouver la date la plus ancienne
    const startDate = new Date(Math.min(...data.map(p => new Date(p.dateDebut))));
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 10); // 10 mois après la date la plus ancienne

    let currentDate = new Date(startDate);

    // Générer les labels pour chaque mois
    while (currentDate <= endDate) {
      labels.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Calculer les valeurs d'amortissement pour chaque mois
    const dataPoints = {};
    labels.forEach(date => {
      dataPoints[date.toISOString()] = 0;
    });

    data.forEach(p => {
      const start = new Date(p.dateDebut);
      const amortRate = p.taux / 100;

      let currentDate = new Date(start);
      let currentValue = p.valeur;

      while (currentDate <= endDate) {
        const monthsElapsed = Math.floor((currentDate - start) / (1000 * 60 * 60 * 24 * 30));
        const amortizedValue = currentValue * Math.pow(1 - amortRate, monthsElapsed);

        if (dataPoints[currentDate.toISOString()]) {
          dataPoints[currentDate.toISOString()] += amortizedValue;
        }

        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    });

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Valeur Amortie Totale',
          data: labels.map(date => ({
            x: date,
            y: 100 - (dataPoints[date.toISOString()] / 1000) // Ajustez le facteur de conversion selon vos besoins
          })),
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1,
        },
      ],
    };

    setGraphData(chartData);
  };

  const calculateTotalPatrimoine = () => {
    const totalValue = possessions.reduce((total, p) => {
      const startDate = new Date(p.dateDebut);
      const endDate = p.dateFin ? new Date(p.dateFin) : new Date();
      const amortRate = p.taux / 100;

      let currentDate = new Date(startDate);
      let currentValue = p.valeur;
      let totalAmortizedValue = 0;

      while (currentDate <= endDate) {
        const monthsElapsed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 30));
        totalAmortizedValue += currentValue * Math.pow(1 - amortRate, monthsElapsed);

        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      return total + totalAmortizedValue;
    }, 0);

    return totalValue;
  };

  return (
    <div>
      <h2>Patrimoine</h2>
      <Button className="custom-button" onClick={() => alert(`Valeur totale du patrimoine: ${calculateTotalPatrimoine().toFixed(2)} Ar`)}>
        Calculer la valeur totale
      </Button>
      <div>
        <h3>Graphique de Valeur Amortie</h3>
        <Line data={graphData} options={getLineChartOptions()} />
      </div>
    </div>
  );
};

export default PatrimoinePage;