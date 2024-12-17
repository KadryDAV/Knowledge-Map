import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContext } from '../context/MapContext';
import '../css/styles.css'; // Ensure you have appropriate styling

// TopicDetails component
const TopicDetails = () => {
  const { mapId, bubbleId } = useParams();
  const navigate = useNavigate();
  const { bubbles } = useContext(MapContext);

  const [bubble, setBubble] = useState(null);
  const [error, setError] = useState(null);

  // Fetch the specific bubble based on bubbleId from context
  useEffect(() => {
    const foundBubble = bubbles.find((b) => b.id === bubbleId);
    if (foundBubble) {
      setBubble(foundBubble);
    } else {
      setError('Topic not found.');
    }
  }, [bubbleId, bubbles]);

  // Function to ensure URLs are absolute
  const formatUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Default to https if no protocol is provided
    return `https://${url}`;
  };

  if (error) return <div className="error">{error}</div>;
  if (!bubble) return <div>Loading...</div>;

  return (
    <div className="topic-details">
      <h1>{bubble.text}</h1>
      <p>{bubble.description}</p>
      
      <h3>Resources:</h3>
      {bubble.resources && bubble.resources.length > 0 ? (
        <ul>
          {bubble.resources.map((resource, index) => (
            <li key={index}>
              <a href={formatUrl(resource)} target="_blank" rel="noopener noreferrer">
                {resource}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No resources available.</p>
      )}

      <button onClick={() => navigate(`/map/${mapId}`)}>Back to Map Viewer</button>
    </div>
  );
};

export default TopicDetails;
