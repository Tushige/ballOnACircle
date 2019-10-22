


export function captureMouse(element) {
  var mouse = {
    x: 0,
    y: 0
  };
  var prevMouse = {
    x: 0,
    y: 0
  }
  element.addEventListener('mousemove', function (e) {
    var x, y;
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    const mx = mouse.x;
    const my = mouse.y
    const padding = +window.getComputedStyle(element, null).getPropertyValue('padding').split('px')[0]
    mouse.x = x - element.offsetLeft - padding;
    mouse.y = y - element.offsetTop - padding;
    if (mouse.x !== mx) {
      prevMouse.x = mx;
    }
    if (mouse.y !== my) {
      prevMouse.y = my;
    }
    console.log(`(${mouse.x}, ${mouse.y})`)
  }, false)
  return [mouse, prevMouse];
}

