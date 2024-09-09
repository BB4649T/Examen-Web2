import express, { json } from 'express';
import cors from 'cors';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Configuration des chemins et initialisation de l'application Express
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(cors());
app.use(json());

const dataPath = join(__dirname, 'data.json');

// Fonction pour lire les données à partir du fichier data.json
const readData = () => {
    if (!existsSync(dataPath)) {
        writeFileSync(dataPath, JSON.stringify({ possessions: [] }));
    }
    return JSON.parse(readFileSync(dataPath, 'utf8'));
};

// Fonction pour écrire des données dans le fichier data.json
const writeData = (data) => {
    writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Route GET pour récupérer toutes les possessions
app.get('/api/possessions', (req, res) => {
    const data = readData();
    res.json([{
        model: 'Patrimoine',
        data: {
            possessions: data.possessions
        }
    }]);
});


// Route POST pour ajouter une nouvelle possession
app.post('/api/possessions', (req, res) => {
    const data = readData();
    const newPossession = { id: Date.now(), ...req.body };
    data.possessions.push(newPossession);
    writeData(data);
    res.status(201).json(newPossession);
});

// Route PUT pour mettre à jour une possession existante
app.put('/api/possessions/:id', (req, res) => {
    const data = readData();
    const index = data.possessions.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).send('Possession non trouvée.');
    data.possessions[index] = { ...data.possessions[index], ...req.body };
    writeData(data);
    res.json(data.possessions[index]);
});

// Route DELETE pour supprimer une possession
app.delete('/api/possessions/:id', (req, res) => {
    const data = readData();
    const index = data.possessions.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).send('Possession non trouvée.');
    const removed = data.possessions.splice(index, 1);
    writeData(data);
    res.json(removed[0]);
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});