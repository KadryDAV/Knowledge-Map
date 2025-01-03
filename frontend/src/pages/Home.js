import React, { useEffect, useState } from 'react';
import api from '../api/api';
import BubbleMapCard from '../components/BubbleMapCard';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [maps, setMaps] = useState([]);
  const [error, setError] = useState(null); // State for error messages
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaps = async () => {
      try {
        const response = await api.get('/maps');
        setMaps(response.data);
        setError(null); // Clear error on successful fetch
      } catch (error) {
        console.error('Error fetching maps:', error);
        setError('Failed to load maps. Please try again later.'); // Set error message
      }
    };
    fetchMaps();
  }, []);

  const handleCreateNewMap = async () => {
    try {
      const mapData = {
        name: 'Untitled Map',
        description: 'A brand new map',
        bubbles: [],
        connections: [],
      };
      console.log('Home: Creating a new map before navigating...');
      const response = await api.post('/maps', mapData);
      const newMap = response.data;
      console.log('Home: New map created with _id:', newMap._id);
      // Navigate to the newly created map's editor
      navigate(`/map-editor/${newMap._id}`);
    } catch (error) {
      console.error('Error creating new map in Home:', error);
      alert('Failed to create a new map. Please ensure you are logged in and try again.');
    }
  };

  return (
    <div className="home-feed">
      {/* Intro Section */}
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <h2>Welcome to Knowledge Maps!</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto' }}>
          Knowledge Maps let you visually organize topics and resources
          into interactive “bubbles.” Click on a map below to explore an existing 
          knowledge map, or create your own to get started!
        </p>
        {/* Button to create a new map */}
        <button
          onClick={handleCreateNewMap}
          style={{ marginTop: '15px', padding: '10px 20px' }}
        >
          Create a New Map
        </button>
      </div>

      {/* Show error message if fetching maps fails */}
      {error && (
        <div style={{ color: 'red', textAlign: 'center', margin: '20px 0' }}>
          {error}
        </div>
      )}

      {/* Existing Map Cards */}
      <div className="maps-grid">
        {maps.length > 0 ? (
          maps.map((map) => <BubbleMapCard key={map._id} map={map} />)
        ) : !error ? ( // Show message only if no error and no maps
          <p style={{ textAlign: 'center' }}>No maps available. Create one to get started!</p>
        ) : null}
      </div>
    </div>
  );
}

export default Home;
