import React, { useState, useEffect, useRef } from 'react';
import './Wheel.css';
import Ball from '../Ball/Ball';

var fps = 10; // target frame rate
var frameDuration = 1000 / fps; // how long, in milliseconds, a regular frame should take to be drawn
var time = 0; // time value, to be sent to shaders, for example
var lastTime = 0; // when was the last frame drawn

const WHEEL_RADIUS = 200;
const BALL_INIT_X = WHEEL_RADIUS;
const BALL_INIT_Y = 0;
function Wheel(props) {
  var [pos, setPos] = useState({ x: BALL_INIT_X, y: BALL_INIT_Y })
  var reqAnimRef = useRef();
  function drawBall(elapsed) {
    time += 0.05;
    setPos((prevState) => {
      return {
        x: BALL_INIT_X + Math.cos(time) * WHEEL_RADIUS,
        y: BALL_INIT_X + Math.sin(time) * WHEEL_RADIUS
      };
    })
    reqAnimRef.current = requestAnimationFrame(drawBall);
  }
  useEffect(() => {
    reqAnimRef.current = requestAnimationFrame(drawBall);
    return () => cancelAnimationFrame(reqAnimRef.current)
  }, [])
  return (
    <div className="wheel" style={{ width: WHEEL_RADIUS * 2, height: WHEEL_RADIUS * 2 }}><Ball pos={pos} /></div>
  )
}

export default Wheel;