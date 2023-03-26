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

const projectOptions = {
  polygonOptions: {
    pointArray: [],
    lineArray: [],
    activeShape: null,
    activeLine: null,
  },
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
  canvasStartDrawingPolygon: (options) => {
    polyObject.addPoint(options);
  },
  canvasContinueDrawingPolygon: (options) => {
    polyObject.addLine(options);
  },
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
    // canvas.on("mouse:up", eventActions.canvasStartDrawingPolygon);
    canvas.on("mouse:move", eventActions.canvasContinueDrawingPolygon);
  },
};

//POLYGON
const polyObject = {
  addPoint: (options) => {
    let pointer = canvas.getPointer(options.e, false);
    let circle = new fabric.Circle({
      radius: 5,
      fill: "#ffffff",
      stroke: "#333333",
      strokeWidth: 0.5,
      left: pointer.x,
      top: pointer.y,
      selectable: false,
      hasBorders: false,
      hasControls: false,
      originX: "center",
      originY: "center",
    });
    if (projectOptions.polygonOptions.pointArray.length === 0) {
      circle.set({ fill: "red" });
    }
    // projectOptions.polygonOptions.pointArray.push(circle);
    // canvas.add(circle);
    //let linePoints = [ pointer.x, pointer.y, pointer.x, pointer.y, ];
    let line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      strokeWidth: 2,
      fill: "#999999",
      stroke: "#999999",
      class: "line",
      originX: "center",
      originY: "center",
      selectable: false,
      hasBorders: false,
      hasControls: false,
      evented: false,
    });
    if (projectOptions.polygonOptions.activeShape) {
      let points = projectOptions.polygonOptions.activeShape.get("points");
      points.push({
        x: pointer.x,
        y: pointer.y,
      });
      let polygon = new fabric.Polygon(points, {
        stroke: "#333333",
        strokeWidth: 1,
        fill: "#cccccc",
        opacity: 0.1,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
      });
      canvas.remove(projectOptions.polygonOptions.activeShape);
      canvas.add(polygon);
      projectOptions.polygonOptions.activeShape = polygon;
      canvas.renderAll();
    } else {
      let points = [
        {
          x: pointer.x,
          y: pointer.y,
        },
      ];
      let polygon = new fabric.Polygon(points, {
        stroke: "#333333",
        strokeWidth: 1,
        fill: "#cccccc",
        opacity: 0.1,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
      });
      projectOptions.polygonOptions.activeShape = polygon;
      canvas.add(polygon);
    }
    projectOptions.polygonOptions.activeLine = line;
    projectOptions.polygonOptions.pointArray.push(circle);
    projectOptions.polygonOptions.lineArray.push(line);
    canvas.add(line);
    canvas.add(circle);
    canvas.getObjects().forEach((element) => {
      console.log(element);
      console.log(element.class);
    });
    canvas.selection = false;
  },
  addLine: (options) => {
    if (
      projectOptions.polygonOptions.activeLine &&
      projectOptions.polygonOptions.activeLine.class == "line"
    ) {
      let pointer = canvas.getPointer(options.e, false);
      projectOptions.polygonOptions.activeLine.set({
        x2: pointer.x,
        y2: pointer.y,
      });

      let points = projectOptions.polygonOptions.activeShape.get("points");
      points[projectOptions.polygonOptions.pointArray.length] = {
        x: pointer.x,
        y: pointer.y,
      };
      projectOptions.polygonOptions.activeShape.set({
        points: points,
      });
      canvas.renderAll();
    }
    canvas.renderAll();
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
