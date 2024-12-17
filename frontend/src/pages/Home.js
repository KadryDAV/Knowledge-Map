import React, { useEffect, useState } from 'react';
import api from '../api/api';
import BubbleMapCard from '../components/BubbleMapCard';

function Home() {
  const [maps, setMaps] = useState([]);

  useEffect(() => {
    const fetchMaps = async () => {
      const response = await api.get('/maps');
      setMaps(response.data);
    };
    fetchMaps();
  }, []);

  return (
    <div className="home-feed">
      <h1>Explore Bubble Maps</h1>
      <div className="maps-grid">
        {maps.map((map) => (
          <BubbleMapCard key={map._id} map={map} />
        ))}
      </div>
    </div>
  );
}

export default Home;
