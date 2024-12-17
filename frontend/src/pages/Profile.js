import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import BubbleMapCard from '../components/BubbleMapCard';
import { useNavigate } from 'react-router-dom';
//Profile page where the user can see the maps created by them and the maps saved by them
function Profile() {
  const { user } = useContext(AuthContext);
  const [myMaps, setMyMaps] = useState([]);
  const [savedMaps, setSavedMaps] = useState([]);
  const navigate = useNavigate();
//fetching the maps created by the user and the maps saved by the user
  useEffect(() => {
    const fetchMyMaps = async () => {
      const response = await api.get(`/users/${user._id}/maps`);
      setMyMaps(response.data);
    };
    const fetchSavedMaps = async () => {
      const response = await api.get(`/users/${user._id}/saved-maps`);
      setSavedMaps(response.data);
    };
    fetchMyMaps();
    fetchSavedMaps();
  }, [user]);

//function to create a new map
  const handleCreateNewMap = async () => {
    try {
      // Create a new map first, then navigate to map-editor with the mapId
      const mapData = {
        name: 'Untitled Map',
        description: 'A brand new map',
        bubbles: [],
        connections: [],
      };
      console.log('Profile: Creating a new map before navigating...');
      const response = await api.post('/maps', mapData);
      const newMap = response.data;
      console.log('Profile: New map created with _id:', newMap._id);
      navigate(`/map-editor/${newMap._id}`);
    } catch (error) {
      console.error('Error creating new map in Profile:', error);
      alert('Failed to create a new map. Please ensure you are logged in and try again.');
    }
  };

  const handleDeleteMap = async (mapId) => {
    const confirmed = window.confirm("Are you sure you want to delete this map?");
    if (!confirmed) return;
  
    try {
      await api.delete(`/maps/${mapId}`);
      // Update the local state to remove the deleted map
      setMyMaps((prev) => prev.filter((m) => m._id !== mapId));
      alert('Map deleted successfully!');
    } catch (error) {
      console.error('Error deleting map:', error);
      alert('Error deleting map. Check console for details.');
    }
  };

  return (
    <div className="profile-page">
      <h1>{user.username}'s Profile</h1>
      <button onClick={handleCreateNewMap}>Create a New Map</button>
      <h2>My Maps</h2>
      <div className="maps-grid">
        {myMaps.map((map) => (
          <div className="map-card-wrapper" key={map._id} style={{ position: 'relative' }}>
            <BubbleMapCard map={map} />
            {/* Hover-based delete button */}
            <button
              className="delete-map-btn"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                fontSize: '12px',
                lineHeight: '20px',
                textAlign: 'center',
                padding: '0',
                display: 'none'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteMap(map._id);
              }}
              title="Delete Map"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
