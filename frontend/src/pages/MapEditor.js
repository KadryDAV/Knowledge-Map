import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContext } from '../context/MapContext';
import api from '../api/api';
import BubbleMap from '../components/BubbleMap';

function MapEditor() {
  const { mapId } = useParams(); 
  const { bubbles, setBubbles, connections, setConnections } = useContext(MapContext);
  const [mapName, setMapName] = useState('');
  const [mapDescription, setMapDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const realMapId = (mapId && mapId !== 'undefined') ? mapId : null;

  useEffect(() => {
    console.log('MapEditor: mapId from URL is:', mapId, 'Real mapId:', realMapId);
    const fetchMap = async () => {
      if (realMapId) {
        // Editing existing map
        try {
          const response = await api.get(`/maps/${realMapId}`);
          const { name, description, bubbles, connections, public: mapPublic } = response.data;
          setMapName(name);
          setMapDescription(description);
          setBubbles(bubbles || []);
          setConnections(connections || []);
          setIsPublic(mapPublic || false);
          console.log('MapEditor: Fetched map data:', response.data);
        } catch (err) {
          console.error('Error fetching map in MapEditor:', err);
          setError('Failed to fetch map data. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        // Creating a new map
        setMapName('Untitled Map');
        setMapDescription('A brand new map.');
        setBubbles([]);
        setConnections([]);
        setIsPublic(false);
        setLoading(false);
      }
    };

    fetchMap();
  }, [realMapId, setBubbles, setConnections, mapId]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    // Make sure name and description are not empty
    if (!mapName || !mapDescription) {
      setLoading(false);
      setError('Name and description are required.');
      return;
    }

    const mapData = {
      name: mapName,
      description: mapDescription,
      bubbles,
      connections,
      public: isPublic,
    };
    console.log('MapEditor: Saving map with data:', mapData, 'realMapId:', realMapId);

    try {
      if (realMapId) {
        // Update existing map
        await api.put(`/maps/${realMapId}`, mapData);
        alert('Map updated successfully.');
      } else {
        // Create new map
        const response = await api.post('/maps', mapData);
        alert('Map created successfully.');
        // Navigate to the new map's editor
        navigate(`/map-editor/${response.data._id}`, { replace: true });
      }
    } catch (err) {
      console.error('Error saving map in MapEditor:', err);
      setError(err.response?.data?.message || 'Failed to save map. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div
      className="map-editor"
      style={{
        margin: '0 auto',
        padding: '20px',
        maxWidth: '1200px',
        backgroundColor: '#fff',
        borderRadius: '8px',
      }}
    >
      <div className="editor-buttons">
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>
        <button className="save-btn" onClick={handleSave} disabled={loading}>
          {realMapId ? 'Update Map' : 'Create Map'}
        </button>
      </div>
  
      <h1 style={{ marginBottom: '10px' }}>
        {realMapId ? 'Edit Map' : 'Create New Map'}
      </h1>
      <p style={{ marginBottom: '20px', fontSize: '14px', color: '#555' }}>
        Use the map editor to add, remove, or connect bubbles. 
        You can also modify the name and description of your knowledge map below.
      </p>
  
      {/* Flex container to split form (left) & bubble map (right) */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {/* Left column: title & description */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <div className="map-details" style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
              placeholder="Map Name"
              className="map-title-input"
              required
              style={{ 
                width: '90%',       // a bit narrower
                marginBottom: '10px',
                marginLeft: '5%',   // small horizontal space from the edge
              }}
            />
            <textarea
              value={mapDescription}
              onChange={(e) => setMapDescription(e.target.value)}
              placeholder="Map Description"
              className="map-description-input"
              required
              style={{ 
                width: '90%',
                marginBottom: '10px',
                marginLeft: '5%',
                minHeight: '80px',  // just to ensure a bit more room
              }}
            />
            <div className="public-checkbox" style={{ marginTop: '10px', marginLeft: '5%' }}>
              <label>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                {' '}Make this map public (visible to everyone)
              </label>
            </div>
          </div>
        </div>
  
        {/* Right column: BubbleMap */}
        <div style={{ flex: '2', maxWidth: '600px' }}>
          <BubbleMap
            isEditing={true}
            mapData={{
              name: mapName,
              description: mapDescription,
              bubbles,
              connections,
              public: isPublic,
            }}
          />
        </div>
      </div>
    </div>
  );  
}

export default MapEditor;
