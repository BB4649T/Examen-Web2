// PossessionsContext.jsx
import React, { createContext, useState, useContext } from 'react';

const PossessionsContext = createContext();

export const PossessionsProvider = ({ children }) => {
  const [possessions, setPossessions] = useState([]);

  return (
    <PossessionsContext.Provider value={{ possessions, setPossessions }}>
      {children}
    </PossessionsContext.Provider>
  );
};

export const usePossessions = () => useContext(PossessionsContext);