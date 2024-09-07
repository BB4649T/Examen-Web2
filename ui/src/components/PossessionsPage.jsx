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
        if (Array.isArray(response.data)) {
          setPossessions(response.data);
        } else {
          throw new Error('Les données récupérées ne sont pas un tableau.');
        }
      } catch (error) {
        setError('Une erreur est survenue lors de la récupération des possessions.');
      } finally {
        setLoading(false);
      }
    };

    fetchPossessions();
  }, []);

  const handleClose = async (libelle) => {
    try {
      await axios.delete(`http://localhost:5000/api/possessions/${libelle}`);
      setPossessions(prevPossessions => prevPossessions.filter(p => p.libelle !== libelle));
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
              <tr key={p.libelle}>
                <td>{p.libelle}</td>
                <td>{p.valeur}</td>
                <td>{p.dateDebut ? new Date(p.dateDebut).toLocaleDateString() : 'N/A'}</td>
                <td>{p.dateFin ? new Date(p.dateFin).toLocaleDateString() : 'N/A'}</td>
                <td>{p.taux ? `${p.taux}%` : 'N/A'}</td>
                <td>
                  {(p.valeur * Math.pow(1 - (p.taux ? p.taux / 100 : 0), 
                  (new Date() - new Date(p.dateDebut)) / (1000 * 60 * 60 * 24 * 30)))
                  .toFixed(2)}
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleClose(p.libelle)}>Clôturer</button>
                  <Link className="btn btn-secondary ms-2" to={`/possession/update/${p.libelle}`}>Modifier</Link>
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

export default PossessionsPage;