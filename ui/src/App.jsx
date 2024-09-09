import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PatrimoinePage from './components/PatrimoinePage';
import PossessionsPage from './components/PossessionsPage';
import CreatePossessionPage from './components/CreatePossessionPage';
import EditPossessionPage from './components/EditPossessionPage'; // Importation du composant d'édition
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="container">
        <header>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Gestion du Patrimoine</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/patrimoine">Patrimoine</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/possessions">Possessions</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/possession/create">Créer une Possession</Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/patrimoine" element={<PatrimoinePage />} />
            <Route path="/possessions" element={<PossessionsPage />} />
            <Route path="/possession/create" element={<CreatePossessionPage />} />
            <Route path="/possession/update/:id" element={<EditPossessionPage />} /> {/* Route d'édition */}
            <Route path="/" element={<h1>Bienvenue sur la Gestion du Patrimoine</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
