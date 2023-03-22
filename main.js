const canvas = new fabric.Canvas("work_space", {
  width: document.getElementById("container").clientWidth,
  height: document.getElementById("container").clientHeight,
});
const bgUrl = "ooorganize.svg";
canvas.setBackgroundColor(
  {
    source: bgUrl,
    //repeat: "repeat",
    // crossOrigin: null
  },
  canvas.renderAll.bind(canvas)
);

window.addEventListener("resize", function () {
  canvas.setWidth(document.getElementById("container").clientWidth);
  canvas.setHeight(document.getElementById("container").clientHeight);
});

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
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});

// function gridSizeZooming(delta, element) {
//   let gridZoom = parseInt(element.style.backgroundSize.split(" ")[0]);
//   if (delta < 0) {
//     gridZoom += 1;
//   } else {
//     gridZoom -= 1;
//   }
//   element.style.backgroundSize = `${gridZoom}px ${gridZoom}px`;
// }

// function gridPositionZooming(delta, previousCoords, afterCoords, element) {
//   let gridLeftPosition = parseInt(
//     element.style.backgroundPosition.split(" ")[0]
//   );
//   let gridTopPosition = parseInt(
//     element.style.backgroundPosition.split(" ")[1]
//   );
//   console.log(gridLeftPosition, gridTopPosition);
//   if (delta < 0) {
//     gridLeftPosition -= Math.abs(previousCoords.x - afterCoords.x);
//     gridTopPosition -= Math.abs(previousCoords.y - afterCoords.y);
//     console.log(gridLeftPosition, gridTopPosition);
//   } else {
//     gridLeftPosition += Math.abs(previousCoords.x - afterCoords.x);
//     gridTopPosition += Math.abs(previousCoords.y - afterCoords.y);
//     console.log(gridLeftPosition, gridTopPosition);
//   }
//   element.style.backgroundPosition = `${gridLeftPosition}px ${gridTopPosition}px`;
// }
