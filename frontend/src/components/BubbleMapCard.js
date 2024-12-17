import React from 'react';
import { useNavigate } from 'react-router-dom';

function BubbleMapCard({ map }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/map/${map._id}`);
  };

  return (
    <div className="bubble-map-card" onClick={handleClick}>
      <h3>{map.name}</h3>
      <p>{map.description}</p>
      {}
    </div>
  );
}

export default BubbleMapCard;
