import React from 'react';
import './Ball.css';

function Ball({ pos }) {
  let posStyle = {
    'left': pos.x,
    'top': pos.y
  }
  return (
    <div className="ball" style={posStyle}></div>
  )
}

export default Ball;