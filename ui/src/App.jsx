// App.jsx
import React from 'react';
import { PossessionsProvider } from './components/PossessionsContext';
import PossessionsPage from './components/PossessionsPage';
import PatrimoinePage from './components/PatrimoinePage';

const App = () => (
  <PossessionsProvider>
    <PossessionsPage />
    <PatrimoinePage />
  </PossessionsProvider>
);

export default App;