const initCanvas = (workSpace, container) => {
  return new fabric.Canvas(workSpace, {
    width: document.getElementById(container).offsetWidth,
    height: document.getElementById(container).offsetHeight,
    skipOffscreen: true,
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
  polygonOptions: {
    pointArray: [],
    lineArray: [],
    activeShape: null,
    activeLine: null,
  },
  prevZoom: 1,
  currentMode: "default",
};

const eventActions = {
  canvasZoomAction: (options) => {
    let delta = options.e.deltaY;
    let zoom = canvas.getZoom();
    projectOptions.prevZoom = zoom;
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    canvas.setZoom(zoom);
    //canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);
    options.e.preventDefault();
    options.e.stopPropagation();
  },
  windowResizeAction: () => {
    canvas.setWidth(document.getElementById(constants.container).clientWidth);
    canvas.setHeight(document.getElementById(constants.container).clientHeight);
  },
  canvasStartDrawingPolygon: (options) => {
    polyObject.addPoint(options);
  },
  canvasContinueDrawingPolygin: () => {},
  canvasStopDrawingPlygon: () => {},
};
const actionSetter = {
  setCanvasZoom: () => {
    canvas.on("mouse:wheel", eventActions.canvasZoomAction);
  },
  setWindowResize: () => {
    window.addEventListener("resize", eventActions.windowResizeAction);
  },
  setPolygonDraw: () => {
    canvas.on("mouse:down", eventActions.canvasStartDrawingPolygon);
  },
};

//POLYGON
const polyObject = {
  addPoint: (options) => {
    let circle = new fabric.Circle({
      radius: 5,
      fill: "#ffffff",
      stroke: "#333333",
      strokeWidth: 0.5,
      //canvas.getPointer(options.e, false).y
      left: options.e.layerX,
      top: options.e.layerY,
      // selectable: false,
      // hasBorders: false,
      // hasControls: false,
      // originX: "center",
      // originY: "center",
    });
    if (projectOptions.polygonOptions.pointArray.length === 0) {
      circle.set({
        fill: "red",
      });
    }
    projectOptions.polygonOptions.pointArray.push(circle);
    canvas.add(circle);
    console.log(canvas.getZoom() / projectOptions.prevZoom);
    console.log(circle);
    console.log(options.pointer);
    canvas.selection = false;
  },
};

const canvas = initCanvas(constants.workSpace, constants.container);
setBackground(constants.backgroundUrl, canvas);
actionSetter.setWindowResize();
actionSetter.setCanvasZoom();

const btn = document.getElementById("addBtn");
btn.addEventListener("click", () => {
  actionSetter.setPolygonDraw();
});
