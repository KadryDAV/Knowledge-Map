// Import necessary modules and hooks from React and react-router-dom
import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContext } from '../context/MapContext';
import api from '../api/api';

// Define the AddTopic component
const AddTopic = () => {
  // Extract mapId and bubbleId from URL parameters
  const { mapId, bubbleId } = useParams();
  // Initialize navigate function to programmatically navigate
  const navigate = useNavigate();
  // Extract bubbles, setBubbles, and connections from MapContext
  const { bubbles, setBubbles, connections } = useContext(MapContext);

  // Define state variables for form inputs and error handling
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [resourceInput, setResourceInput] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState(null);

  // Function to ensure URLs are absolute
  const formatUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // useEffect hook to populate form fields if editing an existing bubble
  useEffect(() => {
    if (bubbleId) {
      const bubble = bubbles.find((b) => b.id === bubbleId);
      if (bubble) {
        setName(bubble.text);
        setDescription(bubble.description);
        setResourceInput(bubble.resources.join(', ')); // Convert array to comma-separated string for input
        setIsNew(false);
      } else {
        setIsNew(true);
      }
    } else {
      setIsNew(true);
    }
  }, [bubbleId, bubbles]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mapId
    if (!mapId) {
      setError('Invalid map ID.');
      return;
    }

    // Validate name and description
    if (!name.trim() || !description.trim()) {
      setError('Name and description are required.');
      return;
    }

    // Convert the comma-separated string back to an array, ensuring URLs are formatted
    const resourcesArray = resourceInput
      .split(',')
      .map((resource) => formatUrl(resource.trim()))
      .filter((resource) => resource !== '');

    // Create or update bubble object
    const updatedBubble = {
      id: bubbleId || Date.now().toString(),
      text: name,
      description: description,
      resources: resourcesArray, 
      x: 200, 
      y: 200,
    };

    // Update bubbles array
    let updatedBubbles;
    if (isNew) {
      updatedBubbles = [...bubbles, updatedBubble];
    } else {
      updatedBubbles = bubbles.map((b) => (b.id === bubbleId ? updatedBubble : b));
    }

    // Update bubbles in context
    setBubbles(updatedBubbles);
    console.log('AddTopic: Updated Bubbles:', updatedBubbles); // Debugging log

    // Save changes to the server
    try {
      const mapData = {
        bubbles: updatedBubbles,
        connections: connections,
      };
      await api.put(`/maps/${mapId}`, mapData);
      alert('Topic updated successfully.');
      navigate(`/map-editor/${mapId}`);
    } catch (error) {
      console.error('AddTopic: Error updating map after topic save:', error);
      setError('Failed to save topic. Please try again.');
    }
  };

  // Render the form
  return (
    <div className="add-topic">
      <h1>{isNew ? 'Add Topic' : 'Edit Topic'}</h1>
      <button type="button" onClick={() => navigate(`/map-editor/${mapId}`)}>
        Back to Map Editor
      </button>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Topic Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter topic name"
            required
          />
        </div>
        <div>
          <label htmlFor="description">Topic Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter topic description"
            required
          />
        </div>
        <div>
          <label htmlFor="resources">Resources (comma-separated URLs):</label>
          <input
            type="text"
            id="resources"
            value={resourceInput}
            onChange={(e) => setResourceInput(e.target.value)}
            placeholder="e.g., https://example.com, https://another.com"
          />
        </div>
        <button type="submit">{isNew ? 'Add Topic' : 'Update Topic'}</button>
      </form>
    </div>
  );
};

export default AddTopic;
