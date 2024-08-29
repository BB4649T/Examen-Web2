// App.jsx

import React from 'react';
import Header from './components/Header';
import PatrimoinePage from './components/PatrimoinePage';
import PossessionsPage from './components/PossessionsPage';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Container>
        {/* Vous pouvez choisir quelle page afficher ici, ou gérer cela avec un routeur */}
        <PatrimoinePage />
        <PossessionsPage />
      </Container>
    </div>
  );
};

export default App;