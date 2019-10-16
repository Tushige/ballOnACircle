import React, { useState, useEffect, useRef } from 'react';
import './Wheel.css';
import Ball from '../Ball/Ball';
import { captureMouse } from '../../utils/mouse.js';

var angle = - Math.PI / 2; // time value, to be sent to shaders, for example
var lastTime = 0; // when was the last frame drawn

const WHEEL_RADIUS = 200;

const BALL_CENTER_X = WHEEL_RADIUS;
const BALL_CENTER_Y = WHEEL_RADIUS;

const BALL_INIT_X = WHEEL_RADIUS;
const BALL_INIT_Y = 0;

const NUM_SLICES = 2;
const fps = 60;
const duration = 0.3;
const numFrames = fps * duration;
var easing = 0.1;

var distanceToTravel = 0;
var distanceToTarget = 0;
var distanceTraveled = 0;
var distancePerFrame = 0;
var anim = false;

var prevPosition = {
  x: BALL_INIT_X,
  y: BALL_INIT_Y
}
var mouse = captureMouse(window);

function circumference(radius) {
  return Math.PI * radius * 2;
}
var isMouseDown = false;

function Wheel(props) {
  var [pos, setPos] = useState({ x: BALL_INIT_X, y: BALL_INIT_Y })
  var [isAnimating, setAnimating] = useState(false);

  function moveBall() {
    distanceTraveled = 0;
    distanceToTravel = circumference(WHEEL_RADIUS) / NUM_SLICES; // arclength
    setAnimating(true);
  }

  var reqAnimRef = useRef();

  function drawBall(elapsed) {
    if (isAnimating) {
      distanceToTarget = distanceToTravel - distanceTraveled;
      // distance we'll cover in this frame is proportional to distance that's left to cover
      const arcLength = distanceToTarget * easing;
      distanceTraveled += arcLength;
      angle += arcLength / WHEEL_RADIUS;
      const newX = Math.cos(angle) * WHEEL_RADIUS;
      const newY = Math.sin(angle) * WHEEL_RADIUS;

      distanceTraveled += arcLength; // bug here. idk what it is

      setPos((prevState) => {
        return {
          x: BALL_CENTER_X + newX,
          y: BALL_CENTER_Y + newY
        };
      })
    }
    reqAnimRef.current = requestAnimationFrame(drawBall);
  }
  useEffect(() => {
    if (isAnimating) {
      reqAnimRef.current = requestAnimationFrame(drawBall);
      return () => {
        reqAnimRef.current && cancelAnimationFrame(reqAnimRef.current)
      }
    }
  }, [isAnimating])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
  }, [])

  function onMouseDown(e) {
    console.log('mouse down')
    isMouseDown = true
  }
  // has to be applied to the window object
  function onMouseUp(e) {
    if (isMouseDown) {
      isMouseDown = false;
    }
  }
  function onMouseMove(e) {
    //only do stuff when mouse is down
    if (isMouseDown) {
      // moveBall();
    }
  }
  return (
    <>
      <div className="wheel" style={{ width: WHEEL_RADIUS * 2, height: WHEEL_RADIUS * 2 }} onMouseUp={onMouseUp}>
        <Ball pos={pos} onMouseDown={onMouseDown} />
      </div>
      <button onClick={moveBall}>move ball</button>
      {/* <h1>{isMouseDown ? 'mousing' : 'not mousing'}</h1> */}
    </>
  )
}

export default Wheel;