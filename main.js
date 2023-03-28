import { PolygonDrawer } from "./module/polygon.js";

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
      crossOrigin: null,
    },
    canvas.renderAll.bind(canvas)
  );
};

const constants = {
  workSpace: "work_space",
  container: "container",
  backgroundUrl: "img/grid.svg",
};

let currentMode = "default";

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

const btn = document.getElementById("addBtn");
const polygonDrawer = new PolygonDrawer(canvas);
btn.addEventListener("click", () => {
  if (currentMode === "default") {
    console.log("kek");
    currentMode = "polygon";
    polygonDrawer.eventSetter();
  }
  if (currentMode === "polygon") {
    currentMode = "default";
    polygonDrawer.eventRemover();
  }
  console.log(projectOptions.currentMode);
});
