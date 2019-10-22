import React, { useState, useEffect, useRef } from 'react';
import './Wheel.css';
import Ball from '../Ball/Ball';
import { captureMouse } from '../../utils/mouse.js';

var angle = - Math.PI / 2; // time value, to be sent to shaders, for example

const WHEEL_RADIUS = 200;
const BALL_RADIUS = 25;
const BALL_CENTER_X = WHEEL_RADIUS;
const BALL_CENTER_Y = WHEEL_RADIUS;

const BALL_INIT_X = WHEEL_RADIUS;
const BALL_INIT_Y = 0;
var quadrant = 0;

var quad = 1;
var a, b, c, theta;
function circumference(radius) {
  return Math.PI * radius * 2;
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
var prevMouse = null;
var quad1Backwards = false;
var quad2Backwards = false;
var quad3Backwards = false;
var quad4Backwards = false;

function Wheel(props) {
  var [pos, setPos] = useState({ x: BALL_INIT_X, y: BALL_INIT_Y })

  var wheelEl = useRef(null);

  function getQuadrant() {
    if (pos.x > WHEEL_RADIUS && pos.y <= WHEEL_RADIUS) {
      return 1;
    } else if (pos.x <= WHEEL_RADIUS && pos.y < WHEEL_RADIUS) {
      return 2;
    } else if (pos.x < WHEEL_RADIUS && pos.y >= WHEEL_RADIUS) {
      return 3;
    } else if (pos.x >= WHEEL_RADIUS && pos.y > WHEEL_RADIUS) {
      return 4;
    }
    return 'something went wrong';
  }
  function isMouseInBounds() {
    if (mouse.x < 0 || mouse.x > WHEEL_RADIUS * 2 || mouse.y < 0 || mouse.y > WHEEL_RADIUS * 2) {
      return false;
    }
    return true
  }
  function isMovingLeft() {
    return mouse.x < prevMouse.x;
  }
  function isMovingRight() {
    return mouse.x > prevMouse.x;
  }
  function isMovingUp() {
    return mouse.y < prevMouse.y;
  }
  function isMovingDown() {
    return mouse.y > prevMouse.y;
  }
  function moveBall() {
    const mx = mouse.x;
    const my = mouse.y;
    a = distance(BALL_CENTER_X, BALL_CENTER_Y, mx, my);
    b = distance(BALL_CENTER_X, BALL_CENTER_Y, pos.x, pos.y);
    c = distance(mx, my, pos.x, pos.y, true);
    theta = lawOfCosC(a, b, c);
    quadrant = getQuadrant();
    quad1Backwards = false;
    quad2Backwards = false;
    quad3Backwards = false;
    quad4Backwards = false;
    if (quadrant === 1 && isMovingUp()) {
      // console.log('quad 1 backwards')
      quad1Backwards = true;
      theta *= -1;
    }
    else if (quadrant === 2 && isMovingDown()) {
      // console.log('quad 2 backwards')
      quad2Backwards = true
      theta *= -1;
    }
    // else if (quadrant === 3 && mx >= pos.x && my > pos.y) {
    else if (quadrant === 3 && isMovingDown()) {
      // console.log('quad 3 backwards')
      quad3Backwards = true;
      theta *= -1;
    }
    else if (quadrant === 4 && isMovingUp()) {
      // console.log('quad 4 backwards')
      quad4Backwards = true;
      theta *= -1;
    }
    console.log('moving')
    angle += 0.05 * theta;
    // console.log(`theta: ${theta}`)
    // console.log(`(${pos.x},${pos.y})`)
    // angle = theta;
    const newX = Math.cos(angle) * WHEEL_RADIUS;
    const newY = Math.sin(angle) * WHEEL_RADIUS;

    setPos((prevState) => {
      return {
        x: BALL_CENTER_X + newX,
        y: BALL_CENTER_Y + newY
      };
    })
  }
  useEffect(() => {
    [mouse, prevMouse] = captureMouse(wheelEl.current);
  }, []);
  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove);
    return function () {
      window.removeEventListener('mousemove', onMouseMove);
    }
  }, [pos])

  function onMouseDown(e) {
    isMouseDown = true
  }
  // has to be applied to the window object
  function onMouseUp(e) {
    isMouseDown = false;
  }
  function onMouseMove(e) {
    //only do stuff when mouse is down
    if (isMouseDown && isMouseInBounds()) {
      moveBall();
    }
  }
  const monitor = pos && mouse ? (
    <div className="monitor">
      <p>quadrant: {quadrant}</p>
      <p>theta: {radToDeg(theta)}</p>
      <p>angle: {radToDeg(angle)}</p>
      <p>mouse.x is greater than WHEEL_RADIUS : {mouse.x >= WHEEL_RADIUS ? 'true' : 'false'}</p>
      <p>mouse.y is less than prevMouse.y : {mouse.y < prevMouse.y ? 'true' : 'false'}</p>
      <p>quadrant 1 going backward {quad1Backwards ? 'YES' : 'NO'} </p>
      <p>quadrant 2 going backward {quad2Backwards ? 'YES' : 'NO'} </p>
      <p>quadrant 3 going backward {quad3Backwards ? 'YES' : 'NO'} </p>
      <p>quadrant 4 going backward {quad4Backwards ? 'YES' : 'NO'} </p>
      <p>mouse : ({mouse.x}, {mouse.y})</p>
      <p>prevMouse : ({prevMouse.x}, {prevMouse.y})</p>
      <p>pos : ({pos.x}, {pos.y})</p>
    </div>
  ) : null;
  return (
    <>
      <div className="wheel-container" ref={wheelEl}>
        <div className="wheel" style={{ width: WHEEL_RADIUS * 2, height: WHEEL_RADIUS * 2 }}>
          <Ball pos={pos} onMouseDown={onMouseDown} />
        </div>
      </div>
      {monitor}
      <button onClick={moveBall}>move ball</button>
    </>
  )
}

export default Wheel;

        /**
         * 
         * BUG: moveBall doesn't see the latest of pos. It always sees (200,0)
         * This presents a challenge. How to give latest state values to callback functions
 */