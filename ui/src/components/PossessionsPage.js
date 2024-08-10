import React, { useState } from "react";
import { Table, Form, Button, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles.css"; // Assure-toi que le chemin est correct
import Possession from "../models/Possession"; // Assure-toi que le chemin est correct

function PossessionsPage() {
  const [selectedPerson, setSelectedPerson] = useState("");
  const [people, setPeople] = useState([]);
  const [libelle, setLibelle] = useState("");
  const [valeurInitiale, setValeurInitiale] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [amortissement, setAmortissement] = useState("");
  const [possessions, setPossessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalValue, setTotalValue] = useState(0);

  const addPerson = (name) => {
    setPeople([...people, name]);
  };

  const addPossession = () => {
    const newPossession = new Possession(
      libelle,
      valeurInitiale,
      dateDebut,
      dateFin,
      amortissement
    );
    setPossessions([
      ...possessions,
      { ...newPossession, person: selectedPerson },
    ]);
    setLibelle("");
    setValeurInitiale("");
    setDateDebut("");
    setDateFin("");
    setAmortissement("");
  };

  const calculateTotalValue = () => {
    const total = possessions
      .filter((possession) => possession.person === selectedPerson)
      .reduce((acc, possession) => {
        return (
          acc +
          new Possession(
            possession.libelle,
            possession.valeurInitiale,
            possession.dateDebut,
            possession.dateFin,
            possession.amortissement
          ).getValeurActuelle(selectedDate)
        );
      }, 0);

    setTotalValue(total);
  };

  return (
    <Container className="mt-4">
      <h1>Gestion des Possessions</h1>

      <Form className="mb-4">
        <Form.Group controlId="formAddPerson" className="form-group-custom">
          <Form.Label className="form-label-custom">
            Ajouter une Personne
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Nom de la personne"
            id="newPerson"
            className="form-control-custom"
          />
          <Button
            variant="primary"
            className="button-custom"
            onClick={() => {
              const personName = document.getElementById("newPerson").value;
              addPerson(personName);
              document.getElementById("newPerson").value = "";
            }}
          >
            Ajouter Personne
          </Button>
        </Form.Group>
      </Form>

      <Form className="mb-4">
        <Form.Group controlId="formSelectPerson" className="form-group-custom">
          <Form.Label className="form-label-custom">
            Sélectionner une personne
          </Form.Label>
          <Form.Control
            as="select"
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
            className="form-control-custom"
          >
            <option value="">Sélectionnez une personne</option>
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>

      <Form className="mb-4">
        <Form.Label className="form-label-custom">
          Ajouter une Possession
        </Form.Label>
        <Form.Group className="form-group-custom">
          <Form.Control
            type="text"
            placeholder="Libellé"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            className="form-control-custom"
          />
        </Form.Group>
        <Form.Group className="form-group-custom">
          <Form.Control
            type="number"
            placeholder="Valeur Initiale"
            value={valeurInitiale}
            onChange={(e) => setValeurInitiale(e.target.value)}
            className="form-control-custom"
          />
        </Form.Group>
        <Form.Group className="form-group-custom">
          <Form.Control
            type="date"
            placeholder="Date Début"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="form-control-custom"
          />
        </Form.Group>
        <Form.Group className="form-group-custom">
          <Form.Control
            type="date"
            placeholder="Date Fin"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="form-control-custom"
          />
        </Form.Group>
        <Form.Group className="form-group-custom">
          <Form.Control
            type="number"
            placeholder="Amortissement (%)"
            value={amortissement}
            onChange={(e) => setAmortissement(e.target.value)}
            className="form-control-custom"
          />
        </Form.Group>
        <Button
          variant="primary"
          className="button-custom"
          onClick={addPossession}
        >
          Ajouter Possession
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Valeur Initiale</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Amortissement</th>
            <th>Valeur Actuelle</th>
          </tr>
        </thead>
        <tbody>
          {possessions
            .filter((possession) => possession.person === selectedPerson)
            .map((possession, index) => (
              <tr key={index}>
                <td>{possession.libelle}</td>
                <td>{possession.valeurInitiale} €</td>
                <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
                <td>{new Date(possession.dateFin).toLocaleDateString()}</td>
                <td>{possession.amortissement} %</td>
                <td>
                  {new Possession(
                    possession.libelle,
                    possession.valeurInitiale,
                    possession.dateDebut,
                    possession.dateFin,
                    possession.amortissement
                  )
                    .getValeurActuelle(selectedDate)
                    .toFixed(2)}{" "}
                  €
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Form inline className="mt-4">
        <Form.Label className="mr-2">Date:</Form.Label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
        <Button
          variant="primary"
          onClick={calculateTotalValue}
          className="ml-2"
        >
          Calculer
        </Button>
      </Form>
      <h2 className="mt-4">
        Valeur Totale du Patrimoine: {totalValue.toFixed(2)} €
      </h2>
    </Container>
  );
}

export default PossessionsPage;