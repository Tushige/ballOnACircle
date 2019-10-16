


export function captureMouse(element) {
  var mouse = {
    x: 0,
    y: 0
  };
  element.addEventListener('mousemove', function (e) {
    var x, y;
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    mouse.x = x;
    mouse.y = y;
  }, false)
  return mouse;
}

