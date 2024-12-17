import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import BubbleMap from '../components/BubbleMap';

function MapViewer() {
  const { mapId } = useParams(); // Get the mapId from the URL parameters
  const { user } = useContext(AuthContext); // Get the user from the AuthContext
  const navigate = useNavigate(); // Get the navigate function from react-router-dom
  const [mapData, setMapData] = useState(null); // State to hold the map data

  useEffect(() => {
    const fetchMap = async () => {
      if (!mapId) {
        console.warn('MapViewer: No mapId provided in URL'); 
        return;
      }
      console.log('MapViewer: Fetching map with mapId:', mapId); // Log the mapId being fetched
      try {
        const response = await api.get(`/maps/${mapId}`); // Fetch the map data from the API
        console.log('MapViewer: Fetched mapData:', response.data); 
        setMapData(response.data); 
      } catch (error) {
        console.error('Error fetching map data in MapViewer:', error); // Log any errors
      }
    };
    fetchMap(); 
  }, [mapId]); 

  const handleEdit = () => {
    // Function to handle editing the map
    if (mapId) {
      navigate(`/map-editor/${mapId}`); // Navigate to the map editor with the current mapId
    } else {
      console.error('MapViewer: No mapId to edit'); // Log an error if no mapId
    }
  };

  const handleSave = async () => {
    // Function to handle saving the map
    if (!user) {
      alert('You must be logged in to save maps.'); // Alert if the user is not logged in
      return;
    }
    if (!mapId) {
      console.error('MapViewer: No mapId to save'); // Log an error if no mapId
      return;
    }
    try {
      await api.post(`/users/${user._id}/save-map`, { mapId }); // Save the map to the user's profile
      alert('Map saved to your profile.'); // Alert the user that the map was saved
    } catch (error) {
      console.error('Error saving map in MapViewer:', error); // Log any errors
      alert('Error saving map. Check console for details.'); // Alert the user of an error
    }
  };

  if (!mapData) {
    return <div>Loading...</div>; // Show a loading message if mapData is null
  }

  console.log('MapViewer: Rendering with mapData:', mapData); // Log the mapData being rendered

  return (
    <div className="map-viewer">
      <h1>{mapData.name}</h1> {/* Display the map name */}
      <p>{mapData.description}</p> {/* Display the map description */}
      <button onClick={() => navigate(-1)}>Back</button> {/* Button to navigate back */}
      <BubbleMap mapData={mapData} isEditing={false} /> {/* Render the BubbleMap component with mapData */}
      <div className="map-actions">
        {user && mapData.creatorId === user._id && (
          <button onClick={handleEdit}>Edit Map</button> // Show edit button if the user is the creator
        )}
        {user && mapData.creatorId !== user._id && (
          <button onClick={handleSave}>Save to Profile</button> // Show save button if the user is not the creator
        )}
      </div>
    </div>
  );
}

export default MapViewer;
