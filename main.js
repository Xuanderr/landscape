let canvas = new fabric.Canvas("work_space", {
  width: document.getElementById("container").offsetWidth,
  height: document.getElementById("container").offsetHeight,
});

window.addEventListener("resize", resize);

function resize() {
  canvas.setWidth(document.getElementById("container").offsetWidth);
  canvas.setHeight(document.getElementById("container").offsetHeight);
}

let circle = new fabric.Circle({
  radius: 20,
  fill: "green",
  left: 100,
  top: 100,
});
let triandle = new fabric.Triangle({
  width: 20,
  height: 30,
  fill: "blue",
  left: 500,
  top: 500,
});
let rect = new fabric.Rect({
  left: 1000,
  top: 100,
  fill: "red",
  width: 200,
  height: 100,
});
canvas.add(circle, triandle, rect);

canvas.on("mouse:wheel", function (opt) {
  let delta = opt.e.deltaY;
  let zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});

canvas.on("mouse:up", function (opt) {
  this.setViewportTransform(this.viewportTransform);
  this.isDragging = false;
  this.selection = true;
});

canvas.on("mouse:down", function (opt) {
  let evt = opt.e;
  if (evt.altKey === true) {
    this.isDragging = true;
    this.selection = false;
    this.lastPosX = evt.clientX;
    this.lastPosY = evt.clientY;
  }
});
