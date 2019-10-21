import React, { useState, useEffect, useRef } from 'react';
import './Wheel.css';
import Ball from '../Ball/Ball';
import { captureMouse } from '../../utils/mouse.js';

var angle = - Math.PI / 2; // time value, to be sent to shaders, for example
var thetaTraveled = 0;
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

var anim = false;

var prevPosition = {
  x: BALL_INIT_X,
  y: BALL_INIT_Y
}
var quad = 1;
var a, b, c, theta;
function circumference(radius) {
  return Math.PI * radius * 2;
}

function getQuadrant(theta) {
  if (theta <= 0 && theta > - Math.PI / 2) {
    return 1;
  } else if (theta <= - Math.PI / 2 && theta > -Math.PI) {
    return 2;
  } else if (theta >= Math.PI / 2 && theta < Math.PI) {
    return 3;
  } else {
    return 2;
  }
}

function distance(x1, y1, x2, y2, printIt) {
  const distance = Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
  return distance;
}

function lawOfCosC(a, b, c) { // bug here
  return Math.acos((Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b));
}

function degreesToRadians(theta) {
  return theta * Math.PI / 180;
}

function radToDeg(theta) {
  return theta * 180 / Math.PI;
}

var isMouseDown = false;
var mouse = null;

function Wheel(props) {
  var [pos, setPos] = useState({ x: BALL_INIT_X, y: BALL_INIT_Y })
  var [isAnimating, setAnimating] = useState(false);
  var [isText, setText] = useState('hi component');
  var wheelEl = useRef(null);

  function moveBall() {
    const mx = mouse.x;
    const my = mouse.y;
    a = distance(BALL_CENTER_X, BALL_CENTER_Y, mx, my);
    b = distance(BALL_CENTER_X, BALL_CENTER_Y, pos.x, pos.y);
    c = distance(mx, my, pos.x, pos.y, true);
    theta = lawOfCosC(a, b, c);
    setAnimating(true);
  }
  var reqAnimRef = useRef();

  function drawBall(elapsed) {
    console.log('drawing ball')
    if (isAnimating) {
      if (Math.abs(thetaTraveled - theta) <= 0.01) {
        cancelAnimationFrame(reqAnimRef.current)
        thetaTraveled = 0;
        setAnimating(false);
        return;
      }
      let thetaToTarget = theta - thetaTraveled;
      let thetaPerFrame = thetaToTarget * easing;
      angle += thetaPerFrame;
      thetaTraveled += thetaPerFrame;
      const newX = Math.cos(angle) * WHEEL_RADIUS;
      const newY = Math.sin(angle) * WHEEL_RADIUS;
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
    if (!mouse) return;
    const mx = mouse.x;
    const my = mouse.y;
    a = distance(BALL_CENTER_X, BALL_CENTER_Y, mx, my);
    b = distance(BALL_CENTER_X, BALL_CENTER_Y, pos.x, pos.y);
    c = distance(mx, my, pos.x, pos.y, true);
    theta = lawOfCosC(a, b, c);
  }, [pos]);

  useEffect(() => {
    mouse = captureMouse(wheelEl.current);
    window.addEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    console.log(`isAnimating: ${isAnimating}`)
    if (isAnimating) {
      console.log('starting animation')
      reqAnimRef.current = requestAnimationFrame(drawBall);
      return () => {
        setAnimating(false)
        reqAnimRef.current && cancelAnimationFrame(reqAnimRef.current)
      }
    }
  }, [isAnimating])
  function onMouseDown(e) {
    isMouseDown = true
    // moveBall();
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
      moveBall();
    }
  }
  const monitor = mouse ? (
    <div className="monitor">
      <p>overallAngle: {radToDeg(angle)}</p>
      <p>mouse: ({mouse.x}, {mouse.y})</p>
      <p>quad: {quad}</p>
      <p>pos: ({pos.x}, {pos.y})</p>
      <p>a: {a}</p>
      <p>b: {b}</p>
      <p>c: {c}</p>
      <p>thetaToTravel: {radToDeg(theta)}</p>
    </div>
  ) : null
  return (
    <>
      <div ref={wheelEl} className="wheel" style={{ width: WHEEL_RADIUS * 2, height: WHEEL_RADIUS * 2 }} onMouseUp={onMouseUp}>
        <Ball pos={pos} onMouseDown={onMouseDown} />
      </div>
      <button onClick={moveBall}>move ball</button>
      {/* <h1>{isMouseDown ? 'mousing' : 'not mousing'}</h1> */}

      {monitor}
    </>
  )
}

export default Wheel;

    /**
     * 
     * BUG: moveBall doesn't see the latest of pos. It always sees (200,0)
     * This presents a challenge. How to give latest state values to callback functions
 */