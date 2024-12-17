import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Canvas, Node, Edge } from 'reaflow';
import { MapContext } from '../context/MapContext';
import '../css/styles.css';
import api from '../api/api';

// BubbleMap component definition
const BubbleMap = ({ isEditing, mapData }) => {
  // Destructuring context values
  const { bubbles, setBubbles, connections, setConnections } = useContext(MapContext);
  const { mapId } = useParams(); // Get mapId from URL parameters
  const navigate = useNavigate(); // Hook for navigation
  const [loading, setLoading] = useState(true); // State for loading status

  // useEffect hook to load data when component mounts or dependencies change
  useEffect(() => {
    const loadData = async () => {
      if (mapData) {
        // If mapData is provided, use it to set bubbles and connections
        setBubbles(mapData.bubbles || []);
        setConnections(mapData.connections || []);
        setLoading(false);
        return;
      }

      if (mapId) {
        // If mapId is provided, fetch map data from API
        setLoading(true);
        try {
          const response = await api.get(`/maps/${mapId}`);
          const currentMap = response.data;
          setBubbles(currentMap.bubbles || []);
          setConnections(currentMap.connections || []);
        } catch (error) {
          console.error('Error fetching map data in BubbleMap:', error);
        }
        setLoading(false);
      } else {
        // If no mapId, set empty bubbles and connections
        setBubbles([]);
        setConnections([]);
        setLoading(false);
      }
    };

    loadData();
  }, [mapId, mapData, setBubbles, setConnections]);

  // Function to handle click on ellipse (bubble)
  const handleEllipseClick = (node) => {
    if (isEditing) {
      navigate(`/add-topic/${mapId}/${node.data.id}`);
    } else {
      navigate(`/topic-details/${mapId}/${node.data.id}`);
    }
  };

  // Function to save map before editing a topic
  const saveMapBeforeTopic = async () => {
    if (!mapId || !mapData) {
      return true;
    }

    const { name, description, public: isPublic } = mapData;
    if (!name || !description) {
      console.warn('BubbleMap: Missing name/description.');
      return true;
    }

    const mapUpdate = {
      name,
      description,
      bubbles,
      connections,
      public: isPublic || false,
    };

    try {
      await api.put(`/maps/${mapId}`, mapUpdate);
      return true;
    } catch (error) {
      console.error('BubbleMap: Error saving map before topic editing:', error);
      return false;
    }
  };

  // Function to add a new bubble
  const addBubble = () => {
    const lastBubble = bubbles[bubbles.length - 1];
    const newX = lastBubble ? lastBubble.x + 250 : 200;
    const newY = lastBubble ? lastBubble.y : 200;

    const newBubbleId = Date.now().toString();
    const newBubble = {
      id: newBubbleId,
      text: 'New Bubble',
      description: '',
      resources: [],
      x: newX,
      y: newY,
    };

    setBubbles((prevBubbles) => [...prevBubbles, newBubble]);

    if (lastBubble) {
      const newConnectionId = `${lastBubble.id}-${newBubbleId}`;
      const newConnection = {
        source: lastBubble.id,
        target: newBubbleId,
        id: newConnectionId,
      };
      setConnections((prevConnections) => [...prevConnections, newConnection]);
    }
  };

  // Function to handle removal of a bubble
  const handleRemoveBubble = async (bubbleId) => {
    const confirmed = window.confirm("Are you sure you want to delete this bubble?");
    if (!confirmed) return;

    const updatedBubbles = bubbles.filter((b) => b.id !== bubbleId);
    const updatedConnections = connections.filter((c) => c.source !== bubbleId && c.target !== bubbleId);

    setBubbles(updatedBubbles);
    setConnections(updatedConnections);

    if (mapId && mapData) {
      const mapUpdate = {
        name: mapData.name,
        description: mapData.description,
        bubbles: updatedBubbles,
        connections: updatedConnections,
        public: mapData.public || false,
      };
      try {
        await api.put(`/maps/${mapId}`, mapUpdate);
        console.log('BubbleMap: Map updated after bubble removal.');
      } catch (error) {
        console.error('BubbleMap: Error updating map after bubble removal:', error);
        alert('Failed to remove bubble. Please try again.');
      }
    }
  };

  // Render loading state if data is still loading
  if (loading) return <div>Loading...</div>;

  // Map bubbles to nodes for Canvas
  const mappedNodes = bubbles.map((bubble) => ({
    id: bubble.id,
    x: bubble.x,
    y: bubble.y,
    data: bubble,
    width: 140, 
    height: 80, 
    text: '',
  }));

  // Map connections to edges for Canvas
  const mappedEdges = connections.map((connection) => {
    let edgeId = connection.id || `${connection.source}-${connection.target}`;
    return {
      id: edgeId.toString(),
      from: connection.source,
      to: connection.target,
      fromAnchor: 'CENTER',
      toAnchor: 'CENTER',
    };
  });

  // Render the BubbleMap component
  return (
    <div className="bubble-map-container">
      {isEditing && (
        <div style={{ marginBottom: '10px' }}>
          <button onClick={addBubble} className="add-bubble-btn">
            Add Bubble
          </button>
        </div>
      )}

      <Canvas
        nodes={mappedNodes}
        edges={mappedEdges}
        node={
          <Node
            width={140} 
            height={80}
            showLabel={false}
            style={{ fill: 'transparent', stroke: 'transparent' }}
          >
            {({ node, width, height }) => (
              <g className="bubble-node" style={{ cursor: 'pointer' }}>
                {/* Ellipse representing the bubble */}
                <ellipse
                  cx={width / 2}
                  cy={height / 2}
                  rx={(width / 2) - 10} 
                  ry={(height / 2) - 10}
                  fill="#1877f2"
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => handleEllipseClick(node)}
                />
                {/* Text inside the bubble */}
                <text
                  x={width / 2}
                  y={height / 2}
                  textAnchor="middle"
                  alignmentBaseline="central"
                  style={{
                    fill: 'white',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    pointerEvents: 'none'
                  }}
                >
                  {node.data.text}
                </text>
                {/* Button to remove the bubble */}
                {isEditing && (
                  <foreignObject
                    x={width -30} 
                    y={-6} 
                    width="30"
                    height="30"
                  >
                    <button
                      className="delete-map-btn"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        handleRemoveBubble(node.data.id);
                      }}
                      title="Remove Bubble"
                      aria-label="Remove Bubble"
                      xmlns="http://www.w3.org/1999/xhtml" 
                    >
                      &times; {}
                    </button>
                  </foreignObject>
                )}
              </g>
            )}
          </Node>
        }
        edge={
          <Edge
            style={{ stroke: '#888', strokeWidth: 2 }}
            markerEnd="arrow"
            fromOffset={15}
            toOffset={15}
          />
        }
        fit={true}
        zoom={1.2}
        maxHeight={600}
        maxWidth={1000}
      />
    </div>
  );
};

export default BubbleMap;