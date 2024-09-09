import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PossessionsPage = () => {
  const [possessions, setPossessions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPossessions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/possessions');
        console.log('Réponse du serveur:', response.data); // Vérifiez la structure des données

        // Adaptez la structure des données ici
        if (response.data && response.data[0] && response.data[0].data && response.data[0].data.possessions) {
          setPossessions(response.data[0].data.possessions);
        } else {
          throw new Error('Les données récupérées ne sont pas au format attendu.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des possessions:', error.message);
        setError(`Une erreur est survenue lors de la récupération des possessions: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPossessions();
  }, []);

  const handleClose = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/possessions/${id}`);
      setPossessions(prevPossessions => prevPossessions.filter(p => p.id !== id));
    } catch (error) {
      setError('Une erreur est survenue lors de la clôture de la possession.');
    }
  };

  if (loading) {
    return <p>Chargement des possessions...</p>;
  }

  return (
    <div>
      <h1>Liste des Possessions</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <Link className="btn btn-primary" to="/possession/create">Créer une nouvelle possession</Link>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Libelle</th>
            <th>Valeur</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Taux</th>
            <th>Valeur Actuelle</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(possessions) && possessions.length > 0 ? (
            possessions.map(p => (
              <tr key={p.id}>
                <td>{p.libelle}</td>
                <td>{p.valeur}</td>
                <td>{p.dateDebut ? new Date(p.dateDebut).toLocaleDateString() : 'N/A'}</td>
                <td>{p.dateFin ? new Date(p.dateFin).toLocaleDateString() : 'N/A'}</td>
                <td>{p.tauxAmortissement ? `${p.tauxAmortissement}%` : 'N/A'}</td>
                <td>
                  {calculateCurrentValue(p)}
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleClose(p.id)}>Clôturer</button>
                  <Link className="btn btn-secondary ms-2" to={`/possession/update/${p.id}`}>Modifier</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Aucune possession trouvée.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Fonction de calcul de la valeur actuelle d'une possession
const calculateCurrentValue = (possession) => {
  const { valeur, dateDebut, tauxAmortissement } = possession;
  if (!dateDebut) return valeur;

  const startDate = new Date(dateDebut);
  const now = new Date();
  const monthsElapsed = (now.getFullYear() - startDate.getFullYear()) * 12 + now.getMonth() - startDate.getMonth();

  const depreciationRate = (tauxAmortissement / 100) || 0;
  const currentValue = valeur * Math.pow(1 - depreciationRate, monthsElapsed);

  return currentValue.toFixed(2);
};

export default PossessionsPage;