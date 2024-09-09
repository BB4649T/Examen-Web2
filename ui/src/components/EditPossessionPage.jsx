import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPossessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [possession, setPossession] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPossession = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/possessions/${id}`);
        setPossession(response.data);
      } catch (error) {
        setError('Erreur lors de la récupération des détails de la possession.');
      } finally {
        setLoading(false);
      }
    };

    fetchPossession();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPossession(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/api/possessions/${id}`, possession);
      navigate('/possessions');
    } catch (error) {
      setError('Erreur lors de la mise à jour de la possession.');
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!possession) {
    return <p>Aucune possession trouvée.</p>;
  }

  return (
    <div>
      <h1>Modifier la Possession</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="libelle" className="form-label">Libelle</label>
          <input
            type="text"
            className="form-control"
            id="libelle"
            name="libelle"
            value={possession.libelle}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="valeur" className="form-label">Valeur</label>
          <input
            type="number"
            className="form-control"
            id="valeur"
            name="valeur"
            value={possession.valeur}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateDebut" className="form-label">Date Début</label>
          <input
            type="date"
            className="form-control"
            id="dateDebut"
            name="dateDebut"
            value={possession.dateDebut ? new Date(possession.dateDebut).toISOString().split('T')[0] : ''}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateFin" className="form-label">Date Fin</label>
          <input
            type="date"
            className="form-control"
            id="dateFin"
            name="dateFin"
            value={possession.dateFin ? new Date(possession.dateFin).toISOString().split('T')[0] : ''}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tauxAmortissement" className="form-label">Taux d'Amortissement</label>
          <input
            type="number"
            className="form-control"
            id="tauxAmortissement"
            name="tauxAmortissement"
            value={possession.tauxAmortissement}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Enregistrer</button>
      </form>
    </div>
  );
};

export default EditPossessionPage;