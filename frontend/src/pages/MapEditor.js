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
        // Creating a new map scenario
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

    // Ensure name and description are not empty
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
        // Navigate to the newly created map's editor
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
    <div className="map-editor">
      <div className="editor-buttons">
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        <button className="save-btn" onClick={handleSave} disabled={loading}>
          {realMapId ? 'Update Map' : 'Create Map'}
        </button>
      </div>
      <h1>{realMapId ? 'Edit Map' : 'Create New Map'}</h1>
      <div className="map-details">
        <input
          type="text"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          placeholder="Map Name"
          className="map-title-input"
          required
        />
        <textarea
          value={mapDescription}
          onChange={(e) => setMapDescription(e.target.value)}
          placeholder="Map Description"
          className="map-description-input"
          required
        />
        <div className="public-checkbox">
          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Make this map public (visible to everyone)
          </label>
        </div>
      </div>
      {/* BubbleMap component with isEditing=true */}
      <BubbleMap
        isEditing={true}
        mapData={{
          name: mapName,
          description: mapDescription,
          bubbles,
          connections,
          public: isPublic
        }}
      />
    </div>
  );
}

export default MapEditor;
