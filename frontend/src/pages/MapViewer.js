// MapViewer.js

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import BubbleMap from '../components/BubbleMap';

function MapViewer() {
  const { mapId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    const fetchMap = async () => {
      if (!mapId) {
        console.warn('MapViewer: No mapId provided.');
        return;
      }
      try {
        const response = await api.get(`/maps/${mapId}`);
        setMapData(response.data);
      } catch (error) {
        console.error('Error fetching map data in MapViewer:', error);
      }
    };
    fetchMap();
  }, [mapId]);

  const handleEdit = () => {
    if (mapId) {
      navigate(`/map-editor/${mapId}`);
    } else {
      console.error('MapViewer: No mapId to edit.');
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('You must be logged in to save maps.');
      return;
    }
    if (!mapId) {
      console.error('MapViewer: No mapId to save.');
      return;
    }
    try {
      await api.post(`/users/${user._id}/save-map`, { mapId });
      alert('Map saved to your profile.');
    } catch (error) {
      console.error('Error saving map in MapViewer:', error);
      alert('Error saving map. Check console for details.');
    }
  };

  if (!mapData) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="map-viewer"
      style={{
        margin: '0 auto',
        padding: '20px',
        maxWidth: '1200px',
        backgroundColor: '#fff',
        borderRadius: '8px',
      }}
    >
      {}
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '20px' }}
      >
        Back
      </button>
      
      {/* Two-column layout: left info, right bubble map */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {/* Left column: Map title, description, and actions */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <h1 style={{ marginBottom: '10px' }}>{mapData.name}</h1>
          <p style={{ marginBottom: '20px' }}>{mapData.description}</p>

         

          <div style={{ marginTop: '20px' }}>
            {user && mapData.creatorId === user._id && (
              <button 
                onClick={handleEdit} 
                style={{ marginRight: '10px' }}
              >
                Edit Map
              </button>
            )}
            {user && mapData.creatorId !== user._id && (
              <button onClick={handleSave}>
                Save to Profile
              </button>
            )}
          </div>
        </div>

        {/* Right column: BubbleMap */}
        <div style={{ flex: '2', maxWidth: '600px' }}>
        <p style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
            Explore the map below to see how bubbles connect topics. 
            Click on any bubble for more details or resources.
          </p>
          <BubbleMap mapData={mapData} isEditing={false} />
        </div>
      </div>
    </div>
  );
}

export default MapViewer;
