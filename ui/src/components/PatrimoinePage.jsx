import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { getLineChartOptions } from '../chart';

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, TimeScale);

const API_URL = 'http://localhost:3000';

const PatrimoinePage = () => {
  const [possessions, setPossessions] = useState([]);
  const [graphData, setGraphData] = useState({ labels: [], datasets: [] });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/possession`)
      .then(response => response.json())
      .then(data => {
        setPossessions(data);
        generateGraphData(data);
        calculateTotal(data);
      })
      .catch(error => console.error('Erreur de récupération des possessions:', error));
  }, []);

  const generateGraphData = (data) => {
    const labels = [];
    const values = [];

    data.forEach((p) => {
      const startDate = new Date(p.dateDebut);
      const endDate = p.dateFin ? new Date(p.dateFin) : new Date();
      const amortRate = p.taux / 100;

      let currentDate = new Date(startDate);
      let currentValue = p.valeur;

      while (currentDate <= endDate) {
        labels.push(currentDate.toISOString()); // Formatage en ISO pour compatibilité
        const monthsElapsed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24 * 30));
        const amortizedValue = currentValue * Math.pow(1 - amortRate, monthsElapsed);
        values.push(amortizedValue);

        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    });

    setGraphData({
      labels,
      datasets: [
        {
          label: 'Valeur Amortie',
          data: values,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1,
        },
      ],
    });
  };

  const calculateTotal = (data) => {
    const total = data.reduce((sum, p) => sum + parseFloat(p.valeurActuelle || p.valeur), 0);
    setTotal(total);
  };

  return (
    <div className="patrimoine-page">
      <h2>Patrimoine</h2>
      <Button variant="primary" onClick={() => calculateTotal(possessions)}>
        Calculer le Total
      </Button>
      <div className="total-display">
        <h4>Total des Patrimoines: {total.toFixed(2)} Ar</h4>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Libelle</th>
            <th>Valeur</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Amortissement</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((p) => (
            <tr key={p.libelle}>
              <td>{p.libelle}</td>
              <td>{p.valeur}</td>
              <td>{new Date(p.dateDebut).toLocaleDateString()}</td>
              <td>{p.dateFin ? new Date(p.dateFin).toLocaleDateString() : 'N/A'}</td>
              <td>{p.taux}%</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        <h3>Graphique de Valeur Amortie</h3>
        <Line data={graphData} options={getLineChartOptions()} />
      </div>
    </div>
  );
};

export default PatrimoinePage;