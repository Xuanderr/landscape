let canvas = new fabric.Canvas("work_space", {
  width: document.getElementById("container").offsetWidth,
  height: document.getElementById("container").offsetHeight,
});

window.addEventListener("resize", function () {
  canvas.setWidth(document.getElementById("container").offsetWidth);
  canvas.setHeight(document.getElementById("container").offsetHeight);
});

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
  console.log(opt.e.deltaY);
  let delta = opt.e.deltaY;
  let zoom = canvas.getZoom();
  console.log("ZOOM = " + zoom);
  zoom *= 0.999 ** delta;
  let gridZoom = parseInt(
    document.getElementById("container").style.backgroundSize.split(" ")[0]
  );
  gridZoom *= 0.999 ** delta;
  console.log("GRID_ZOOM = " + gridZoom);
  console.log("ZOOM = " + zoom);
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  document.getElementById("container").style.backgroundSize = toString(
    gridZoom + "px" + " " + gridZoom + "px"
  );
  console.log(document.getElementById("container").style.backgroundSize);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});
