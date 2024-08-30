import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { getLineChartOptions } from '../chart';
import { usePossessions } from './PossessionsContext';

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, TimeScale);

const API_URL = 'http://localhost:3000';

const PatrimoinePage = () => {
  const { possessions } = usePossessions();
  const [graphData, setGraphData] = useState({ labels: [], datasets: [] });
  const [total, setTotal] = useState(0);
  const [selectedPossession, setSelectedPossession] = useState(null);

  useEffect(() => {
    if (selectedPossession) {
      generateGraphData(selectedPossession);
      calculateTotal(selectedPossession);
    }
  }, [possessions, selectedPossession]);

  const generateGraphData = (possession) => {
    if (!possession) return;

    const labels = [];
    const values = [];
    const startDate = new Date(possession.dateDebut);
    const endDate = possession.dateFin ? new Date(possession.dateFin) : new Date();
    const amortRate = possession.taux / 100;

    let currentDate = new Date(startDate);
    let currentValue = possession.valeur;

    while (currentDate <= endDate) {
      labels.push(currentDate.toISOString()); // Use ISO string for time scale
      values.push(currentValue);
      currentValue -= currentValue * amortRate;
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }

    setGraphData({
      labels,
      datasets: [
        {
          label: `Valeur Amortie: ${possession.libelle}`,
          data: values,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
      ],
    });
  };

  const calculateTotal = (possession) => {
    if (!possession) return;

    const startDate = new Date(possession.dateDebut);
    const endDate = possession.dateFin ? new Date(possession.dateFin) : new Date();
    const amortRate = possession.taux / 100;

    let currentValue = possession.valeur;

    while (startDate <= endDate) {
      currentValue -= currentValue * amortRate;
      startDate.setFullYear(startDate.getFullYear() + 1);
    }

    // Ensure that total is a number
    setTotal(currentValue);
  };

  return (
    <div>
      <h2>Patrimoine</h2>
      <Line data={graphData} options={getLineChartOptions()} />
      <h3>Total du Patrimoine: {(Number(total) || 0).toFixed(2)} Ar</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Libelle</th>
            <th>Valeur Initiale</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Amortissement</th>
            <th>Actions</th>
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
              <td>
                <Button onClick={() => setSelectedPossession(p)}>Voir Valeur Amortie</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PatrimoinePage;