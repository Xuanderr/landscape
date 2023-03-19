let canvas = new fabric.Canvas("work_space", {
  width: document.getElementById("container").clientWidth,
  height: document.getElementById("container").clientHeight,
  selection: false,
});

window.addEventListener("resize", function () {
  canvas.setWidth(document.getElementById("container").clientWidth);
  canvas.setHeight(document.getElementById("container").clientHeight);
});

// let circle = new fabric.Circle({
//   radius: 20,
//   fill: "green",
//   left: 100,
//   top: 100,
// });
// let triandle = new fabric.Triangle({
//   width: 20,
//   height: 30,
//   fill: "blue",
//   left: 500,
//   top: 500,
// });
// let rect = new fabric.Rect({
//   left: 1000,
//   top: 100,
//   fill: "red",
//   width: 200,
//   height: 100,
// });
// canvas.add(circle, triandle, rect);

let circle1 = new fabric.Circle({
  radius: 50,
  fill: "red",
  left: 0,
});
let circle2 = new fabric.Circle({
  radius: 50,
  fill: "green",
  left: 100,
});
let circle3 = new fabric.Circle({
  radius: 50,
  fill: "blue",
  left: 200,
});
let group = new fabric.Group([circle1, circle2, circle3], {
  left: 200,
  top: 100,
});
canvas.add(group);

canvas.on("mouse:wheel", function (opt) {
  let delta = opt.e.deltaY;
  let zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  gridZooming(delta);
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});

function gridZooming(delta) {
  let grid = document.getElementById("container");
  let gridZoom = parseInt(grid.style.backgroundSize.split(" ")[0]);
  if (delta < 0) {
    gridZoom += 1;
  } else {
    gridZoom -= 1;
  }
  grid.style.backgroundSize = `${gridZoom}px ${gridZoom}px`;
}
