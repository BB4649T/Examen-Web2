import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePossessionPage = () => {
  const [libelle, setLibelle] = useState('');
  const [valeur, setValeur] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [taux, setTaux] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPossession = {
        libelle,
        valeur: parseFloat(valeur),
        dateDebut,
        dateFin,
        taux: parseFloat(taux),
      };
      await axios.post('http://localhost:5000/api/possessions', newPossession);
      navigate('/possessions'); // Redirige vers la page des possessions après la création
    } catch (error) {
      setError('Une erreur est survenue lors de la création de la possession.');
    }
  };

  return (
    <div>
      <h1>Créer une Nouvelle Possession</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="libelle" className="form-label">Libelle</label>
          <input
            type="text"
            className="form-control"
            id="libelle"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="valeur" className="form-label">Valeur</label>
          <input
            type="number"
            className="form-control"
            id="valeur"
            value={valeur}
            onChange={(e) => setValeur(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateDebut" className="form-label">Date Début</label>
          <input
            type="date"
            className="form-control"
            id="dateDebut"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dateFin" className="form-label">Date Fin</label>
          <input
            type="date"
            className="form-control"
            id="dateFin"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="taux" className="form-label">Taux d'Amortissement</label>
          <input
            type="number"
            className="form-control"
            id="taux"
            value={taux}
            onChange={(e) => setTaux(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Créer</button>
      </form>
    </div>
  );
};

export default CreatePossessionPage;