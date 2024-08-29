// server.js

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Pour permettre les requêtes CORS

// Obtention du répertoire du fichier
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin du fichier de données
const dataFilePath = path.join(__dirname, 'data.json');

// Fonction pour lire les données depuis le fichier
const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ possessions: [] }));
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Fonction pour écrire les données dans le fichier
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Route pour obtenir toutes les possessions
app.get('/possession', (req, res) => {
  const data = readData();
  res.json(data.possessions);
});

// Route pour créer une nouvelle possession
app.post('/possession', (req, res) => {
  const { libelle, valeur, dateDebut, dateFin, taux } = req.body;
  const data = readData();

  // Vérifier si la possession existe déjà
  const existingPossession = data.possessions.find(p => p.libelle === libelle);
  if (existingPossession) {
    return res.status(400).json({ message: 'Possession déjà existante' });
  }

  // Ajouter la nouvelle possession
  const newPossession = { libelle, valeur, dateDebut, dateFin, taux, valeurActuelle: valeur };
  data.possessions.push(newPossession);
  writeData(data);
  res.status(201).json(newPossession);
});

// Route pour mettre à jour une possession existante
app.put('/possession/:libelle', (req, res) => {
  const { libelle } = req.params;
  const { valeur, dateDebut, dateFin, taux } = req.body;
  const data = readData();
  const index = data.possessions.findIndex(p => p.libelle === libelle);

  if (index !== -1) {
    data.possessions[index] = { ...data.possessions[index], valeur, dateDebut, dateFin, taux };
    writeData(data);
    res.status(200).json(data.possessions[index]);
  } else {
    res.status(404).json({ message: 'Possession non trouvée' });
  }
});

// Route pour supprimer une possession
app.delete('/possession/:libelle', (req, res) => {
  const { libelle } = req.params;
  const data = readData();
  const index = data.possessions.findIndex(p => p.libelle === libelle);

  if (index !== -1) {
    data.possessions.splice(index, 1);
    writeData(data);
    res.status(200).json({ message: 'Possession supprimée' });
  } else {
    res.status(404).json({ message: 'Possession non trouvée' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur le port ${PORT}`);
});