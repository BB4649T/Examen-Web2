// PossessionsPage.jsx
import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { usePossessions } from './PossessionsContext';

const API_URL = 'http://localhost:3000/possession';

const PossessionsPage = () => {
  const { possessions, setPossessions } = usePossessions();
  const [libelle, setLibelle] = useState("");
  const [valeurInitiale, setValeurInitiale] = useState("");
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(null);
  const [amortissement, setAmortissement] = useState("");
  const [editingPossession, setEditingPossession] = useState(null);

  useEffect(() => {
    fetchPossessions();
  }, []);

  const fetchPossessions = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPossessions(data);
    } catch (error) {
      alert('Erreur de récupération des possessions: ' + error.message);
    }
  };

  const handleCreatePossession = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          libelle,
          valeur: valeurInitiale,
          dateDebut,
          dateFin,
          taux: amortissement,
        }),
      });
      const newPossession = await response.json();
      setPossessions([...possessions, newPossession]);
      resetForm();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const handleUpdatePossession = async () => {
    try {
      const response = await fetch(`${API_URL}/${editingPossession}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          libelle,
          valeur: valeurInitiale,
          dateDebut,
          dateFin,
          taux: amortissement,
        }),
      });
      const updatedPossession = await response.json();
      setPossessions(possessions.map(p => p.libelle === editingPossession ? updatedPossession : p));
      setEditingPossession(null);
      resetForm();
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const handleDeletePossession = async (libelle) => {
    try {
      await fetch(`${API_URL}/${libelle}`, {
        method: 'DELETE',
      });
      setPossessions(possessions.filter(p => p.libelle !== libelle));
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const handleEditPossession = (possession) => {
    setLibelle(possession.libelle);
    setValeurInitiale(possession.valeur);
    setDateDebut(new Date(possession.dateDebut));
    setDateFin(possession.dateFin ? new Date(possession.dateFin) : null);
    setAmortissement(possession.taux);
    setEditingPossession(possession.libelle);
  };

  const resetForm = () => {
    setLibelle("");
    setValeurInitiale("");
    setDateDebut(new Date());
    setDateFin(null);
    setAmortissement("");
  };

  return (
    <div>
      <h2>Gestion des Possessions</h2>
      <Form>
        <Form.Group controlId="formLibelle">
          <Form.Label>Libelle</Form.Label>
          <Form.Control type="text" value={libelle} onChange={(e) => setLibelle(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formValeurInitiale">
          <Form.Label>Valeur Initiale</Form.Label>
          <Form.Control type="number" value={valeurInitiale} onChange={(e) => setValeurInitiale(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formDateDebut">
          <Form.Label>Date Début</Form.Label>
          <Form.Control type="date" value={dateDebut.toISOString().split('T')[0]} onChange={(e) => setDateDebut(new Date(e.target.value))} />
        </Form.Group>
        <Form.Group controlId="formDateFin">
          <Form.Label>Date Fin</Form.Label>
          <Form.Control type="date" value={dateFin ? dateFin.toISOString().split('T')[0] : ''} onChange={(e) => setDateFin(e.target.value ? new Date(e.target.value) : null)} />
        </Form.Group>
        <Form.Group controlId="formAmortissement">
          <Form.Label>Amortissement (%)</Form.Label>
          <Form.Control type="number" value={amortissement} onChange={(e) => setAmortissement(e.target.value)} />
        </Form.Group>
        <Button onClick={editingPossession ? handleUpdatePossession : handleCreatePossession}>
          {editingPossession ? 'Mettre à Jour' : 'Créer Possession'}
        </Button>
      </Form>
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
                <Button onClick={() => handleEditPossession(p)}>Éditer</Button>
                <Button onClick={() => handleDeletePossession(p.libelle)} variant="danger">Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PossessionsPage;