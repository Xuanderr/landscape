import {PolygonDrawer} from "./module/polygon.js";

const initCanvas = (workSpace, container) => {
  return new fabric.Canvas(workSpace, {
    width: document.getElementById(container).clientWidth,
    height: document.getElementById(container).clientHeight,
    renderOnAddRemove: true
  });
};

const setBackground = (url, canvas) => {
  canvas.setBackgroundColor(
    {
      source: url,
      /*repeat: "repeat", crossOrigin: null*/
      crossOrigin: null,
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
  currentMode: "default",
};

const eventActions = {
  canvasZoomAction: (options) => {
    let delta = options.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);
    options.e.preventDefault();
    options.e.stopPropagation();
  },
  windowResizeAction: () => {
    canvas.setWidth(document.getElementById(constants.container).clientWidth);
    canvas.setHeight(document.getElementById(constants.container).clientHeight);
  },
};
const actionSetter = {
  setCanvasZoom: () => {
    canvas.on("mouse:wheel", eventActions.canvasZoomAction);
  },
  setWindowResize: () => {
    window.addEventListener("resize", eventActions.windowResizeAction);
  },
};

const canvas = initCanvas(constants.workSpace, constants.container);
setBackground(constants.backgroundUrl, canvas);
actionSetter.setWindowResize();
actionSetter.setCanvasZoom();

// let circle = new fabric.Circle({
//   left: 300,
//   top: 300,
//   radius: 40,
//   backgroundColor: 'red'
// });
// circle.setBackgroundColor( {
//       source: './img/checkmark.svg',
//       /*repeat: "repeat", crossOrigin: null*/
//       crossOrigin: null,
//     },
//     canvas.renderAll.bind(circle)
// )
// rect.on("moving", () => {
//   if (rect.intersectsWithObject(line, true, false)) {
//     console.log("kek");
//   }
//   console.log("1");
// });
// line.on("mouseover", (options) => {
//   if (
//     line.containsPoint(new fabric.Point(options.point.x, options.pointer.y))
//   ) {
//     console.log("kek");
//   }

//   // line.set({
//   //   stroke: "red",
//   // });
//   canvas.renderAll();
// });
// line.on("mouseout", () => {
//   console.log("kek1");
//   line.set({
//     stroke: "green",
//   });
//   canvas.renderAll();
// });
// canvas.add(line, rect);
// console.log(line);
// console.log(rect);

const btn = document.getElementById("addBtn");
btn.addEventListener("click", () => {
  if (projectOptions.currentMode === "default") {
    projectOptions.currentMode = "polygon";
    PolygonDrawer.canvasSetter(canvas);
    PolygonDrawer.eventSetter();
  } else {
    projectOptions.currentMode = "default";
    PolygonDrawer.eventRemover();
  }
});
