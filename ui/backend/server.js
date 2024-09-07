import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, 'data.json');

const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ possessions: [] }));
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.get('/api/possessions', (req, res) => {
  const data = readData();
  res.json(data.possessions);
});

app.post('/api/possessions', (req, res) => {
  const { libelle, valeur, dateDebut, dateFin, taux } = req.body;
  const data = readData();

  const newPossession = { libelle, valeur: parseFloat(valeur), dateDebut, dateFin, taux: parseFloat(taux), valeurActuelle: parseFloat(valeur) };
  data.possessions.push(newPossession);
  writeData(data);

  res.status(201).json(newPossession);
});

app.delete('/api/possessions/:libelle', (req, res) => {
  const { libelle } = req.params;
  const data = readData();

  data.possessions = data.possessions.filter(p => p.libelle !== libelle);
  writeData(data);

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});