export class PolygonDrawer {
  static #canvas = null;
  static #pointsArray = [];
  static #linesArray = [];
  static #circleArray = [];
  static #activeLineFromEndPoint = null;
  static #activeLineFromStartPoint = [];
  static #activeShape = null;
  static #circleOptions = {
    radius: 5,
    fill: "#ffffff",
    stroke: "#333333",
    strokeWidth: 0.5,
    selectable: false,
    hasBorders: false,
    hasControls: false,
    originX: "center",
    originY: "center",
  };
  static #lineOptions = {
    strokeDashArray: [5, 5],
    strokeWidth: 2,
    stroke: "#999999",
    originX: "center",
    originY: "center",
    selectable: false,
    hasBorders: false,
    hasControls: false,
    evented: false,
  };

  static #polygonOptions = {
    stroke: "#333333",
    strokeWidth: 1,
    fill: "#cccccc",
    opacity: 0.1,
    selectable: false,
    hasBorders: false,
    hasControls: false,
    evented: false,
  };

  // constructor(canvas) {
  //   PolygonDrawer.#canvas = canvas;
  // }

  static canvasSetter(canvas) {
    this.#canvas = canvas;
  }

  static canvasGetter() {
    console.log("kek");
    return this.#canvas;
  }

  clearDrawerOptions() {
    this.#activeLineFromEndPoint = null;
    this.#activeLineFromStartPoint = null;
    this.#activeShape = null;
    this.#circleArray = [];
    this.#linesArray = [];
    this.#pointsArray = [];
  }

  static addPoint(options) {
    // if (this.#activeLineFromStartPoint) {
    //   this.#canvas.remove(this.#activeLineFromStartPoint);
    // }
    let pointer = this.#canvas.getPointer(options.e, false);
    let circle = new fabric.Circle(this.#circleOptions);
    circle.set({
      left: pointer.x,
      top: pointer.y,
    });
    console.log(this.#pointsArray);
    if (this.#pointsArray.length === 0) {
      circle.set({
        fill: "red",
      });
    }
    let lineFromEndPoint = new fabric.Line(
      [pointer.x, pointer.y, pointer.x, pointer.y],
      this.#lineOptions
    );
    this.#pointsArray.push(new fabric.Point(pointer.x, pointer.y));
    this.#circleArray.push(circle);
    let lineFromStartPoint;
    if (this.#pointsArray.length > 1) {
      let x = this.#pointsArray[0].x;
      let y = this.#pointsArray[0].y;
      lineFromStartPoint = new fabric.Line([x, y, x, y], this.#lineOptions);
    }
    let polygon = new fabric.Polygon(this.#pointsArray, this.#polygonOptions);
    if (this.#activeShape) {
      this.#canvas.remove(this.#activeShape);
    }
    this.#activeShape = polygon;
    this.#activeLineFromEndPoint = lineFromEndPoint;
    this.#linesArray.push(lineFromEndPoint);
    this.#canvas.add(circle, lineFromEndPoint, polygon);
    console.log(this.#canvas.getObjects());
    if (this.#pointsArray.length > 1) {
      this.#activeLineFromStartPoint.push(lineFromStartPoint);
      console.log(this.#activeLineFromStartPoint);
      if (this.#activeLineFromStartPoint.length > 1) {
        this.#canvas.remove(this.#activeLineFromStartPoint.shift());
      }
      this.#canvas.add(this.#activeLineFromStartPoint[0]);
    }
    this.#canvas.renderAll();
  }

  static addLine(options) {
    let pointer = this.#canvas.getPointer(options.e, false);
    if (this.#activeLineFromEndPoint) {
      this.#activeLineFromEndPoint.set({
        x2: pointer.x,
        y2: pointer.y,
      });
    }
    if (this.#activeLineFromStartPoint.length != 0) {
      console.log(this.#activeLineFromStartPoint);
      this.#activeLineFromStartPoint[0].set({
        x2: pointer.x,
        y2: pointer.y,
      });
    }
    this.#canvas.renderAll();
  }
  static generatePolygon(options) {
    let pointer = this.#canvas.getPointer(options.e, false);
    this.#pointsArray.push(new fabric.Point(pointer.x, pointer.y));
    this.#circleArray.forEach((element) => {
      this.#canvas.remove(element);
    });
    this.#linesArray.forEach((element) => {
      this.#canvas.remove(element);
    });
    this.#canvas
      .remove(this.#activeLineFromEndPoint)
      .remove(this.#activeLineFromStartPoint)
      .remove(this.#activeShape);
    let polygon = new fabric.Polygon(this.#pointsArray, this.#polygonOptions);
    this.#canvas.add(polygon);
    clearDrawerOptions();
  }

  static eventSetter() {
    this.#canvas.on("mouse:down", this.addPoint.bind(this));
    this.#canvas.on("mouse:move", this.addLine.bind(this));
    this.#canvas.on("mouse:dblclick", this.generatePolygon);
    console.log(this.#canvas.__eventListeners);
  }

  static eventRemover() {
    this.#canvas.off("mouse:down", this.addPoint);
    this.#canvas.off("mouse:move", this.addLine);
    this.#canvas.off("mouse:dblclick", this.generatePolygon);
    console.log(this.#canvas.__eventListeners);
  }
}
