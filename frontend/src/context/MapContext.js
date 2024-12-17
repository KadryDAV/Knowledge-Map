import React, { createContext, useState } from 'react';

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [bubbles, setBubbles] = useState([]);
  const [connections, setConnections] = useState([]);
  const [mapTitle, setMapTitle] = useState('');

  return (
    <MapContext.Provider value={{ bubbles, setBubbles, connections, setConnections, mapTitle, setMapTitle }}>
      {children}
    </MapContext.Provider>
  );
};
