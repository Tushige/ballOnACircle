var mouse = {
  x: 0,
  y: 0
};

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
})

export default mouse;