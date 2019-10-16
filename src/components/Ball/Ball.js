import React from 'react';
import './Ball.css';

function Ball({ pos, onMouseDown }) {
  let posStyle = {
    'left': pos.x,
    'top': pos.y
  }
  return (
    <div className="ball" style={posStyle} onMouseDown={onMouseDown}></div>
  )
}

export default Ball;