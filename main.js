const initCanvas = (workSpace, container) => {
  return new fabric.Canvas(workSpace, {
    width: document.getElementById(container).clientWidth,
    height: document.getElementById(container).clientHeight,
  });
};

const setBackground = (url, canvas) => {
  canvas.setBackgroundColor(
    {
      source: url,
      /*repeat: "repeat", crossOrigin: null*/
    },
    canvas.renderAll.bind(canvas)
  );
};

const constants = {
  workSpace: "work_space",
  container: "container",
  backgroundUrl: "./img/grid.svg",
};

const projectOptions = {
  pointArray: [],
  lineArray: [],
  modes: ["polygon"],
  currentMode: "",
  activeShape: null,
};

//console.log(typeof projectOptions.activeShape);
const canvas = initCanvas(constants.workSpace, constants.container);
setBackground(constants.backgroundUrl, canvas);

window.addEventListener("resize", () => {
  canvas.setWidth(document.getElementById(constants.container).clientWidth);
  canvas.setHeight(document.getElementById(constants.container).clientHeight);
});

const setZoomEvents = (canvas) => {
  canvas.on("mouse:wheel", function (options) {
    console.log(options);
    console.log(options.e.target);
    console.log(options.e.target.id);
    let delta = options.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);
    options.e.preventDefault();
    options.e.stopPropagation();
  });
};

const setPolygonDrawEvent = (canvas) => {
  canvas.on("mouse:down", (options) => {
    if (options.target && options.target.id == pointArray[0].id) {
      prototypefabric.polygon.generatePolygon(pointArray);
    }
    if (polygonMode) {
      prototypefabric.polygon.addPoint(options);
    }
  });
};
const removePolygonDrawEvent = (canvas) => {};

setZoomEvents(canvas);

//POLYGON
const polyObject = {
  drawPolygon: function () {
    projectOptions.currentMode = "polygon";
    projectOptions.pointArray = new Array();
    projectOptions.lineArray = new Array();
  },
};
const btn = document.getElementById("addBtn");
btn.addEventListener("click", () => {
  if (projectOptions.currentMode === "") {
    projectOptions.currentMode = projectOptions.modes[0];
    setPolygonDrawEvent(canvas);
  } else {
    projectOptions.currentMode = "";
  }
  console.log(projectOptions.currentMode);
});

// let mouseDown = false;
// function addLines() {
//   canvas.on("mouse:down", startAddLine);
//   canvas.on("mouse:move", startDrawLine);
//   canvas.on("mouse:up", stopDrawingLine);
//   canvas.selection = false;
// }

// let line;
// function startAddLine(opt) {
//   mouseDown = true;
//   line = new fabric.Line(
//     [opt.pointer.x, opt.pointer.y, opt.pointer.x, opt.pointer.y],
//     {
//       stroke: "red",
//       strokeWidth: 3,
//     }
//   );
//   canvas.add(line);
//   canvas.requestRenderAll();
// }

// function startDrawLine(opt) {
//   if (mouseDown) {
//     line.set({
//       x2: opt.pointer.x,
//       y2: opt.pointer.y,
//     });
//   }
//   canvas.requestRenderAll();
// }

// function stopDrawingLine(opt) {
//   mouseDown = false;
//   console.log(line);
// }

// let circle1 = new fabric.Circle({
//   radius: 50,
//   fill: "red",
//   left: 0,
// });
// let circle2 = new fabric.Circle({
//   radius: 50,
//   fill: "green",
//   left: 100,
// });
// let circle3 = new fabric.Circle({
//   radius: 50,
//   fill: "blue",
//   left: 200,
// });
// let group = new fabric.Group([circle1, circle2, circle3], {
//   left: 200,
//   top: 100,
// });
// canvas.add(group);
