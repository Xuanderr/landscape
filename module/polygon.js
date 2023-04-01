export class PolygonDrawer {
  static #canvas = null;
  static #pointsArray = [];
  static #linesArray = [];
  static #circleArray = [];
  static #activeLineFromEndPoint = null;
  static #activeLineFromStartPoint = null;
  static #activeShape = null;
  static #circleOptions = {
    radius: 5,
    fill: "#ffffff",
    stroke: "#333333",
    strokeWidth: 0.5,
    originX: "center",
    originY: "center",
    selectable: false,
    hasBorders: false,
    hasControls: false,
    class: "CirclePoint",
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
    //strokeDashArray: [5, 5],
    // stroke: "#333333",
    // strokeWidth: 2,
    fill: "#cccccc",
    opacity: 0.1,
    dirty: false,
    objectCaching: false,
    selectable: false,
    hasBorders: false,
    hasControls: false,
    evented: false,
  };

  static canvasSetter(canvas) {
    this.#canvas = canvas;
  }

  static #clearDrawerOptions() {
    this.#activeLineFromEndPoint = null;
    this.#activeLineFromStartPoint = null;
    this.#activeShape = null;
    this.#circleArray = [];
    this.#linesArray = [];
    this.#pointsArray = [];
  }

  static addPoint(options) {
    let pointer = this.#canvas.getPointer(options.e, false);
    let circle = new fabric.Circle(this.#circleOptions);
    circle.set({
      left: pointer.x,
      top: pointer.y,
    });
    if (this.#pointsArray.length === 0) {
      circle.set({
        fill: "red",
      });
    }
    this.#pointsArray.push(new fabric.Point(pointer.x, pointer.y));
    let lineFromEndPoint = new fabric.Line(
      [pointer.x, pointer.y, pointer.x, pointer.y],
      this.#lineOptions
    );
    this.#activeLineFromEndPoint = lineFromEndPoint;

    this.#circleArray.push(circle);
    if (!this.#activeLineFromStartPoint) {
      let x = this.#pointsArray[0].x;
      let y = this.#pointsArray[0].y;
      let lineFromStartPoint = new fabric.Line([x, y, x, y], this.#lineOptions);
      this.#activeLineFromStartPoint = lineFromStartPoint;
      this.#canvas.add(this.#activeLineFromStartPoint);
    }

    let polygon = new fabric.Polygon(this.#pointsArray, this.#polygonOptions);

    if (this.#activeShape) {
      this.#canvas.remove(this.#activeShape);
    }
    this.#activeShape = polygon;

    this.#linesArray.push(this.#activeLineFromEndPoint);
    this.#canvas.add(circle, this.#activeLineFromEndPoint, this.#activeShape);
    this.#canvas.renderAll();
  }

  static addLine(options) {
    let pointer = this.#canvas.getPointer(options.e, false);
    if (this.#activeShape) {
      let points = this.#activeShape.get("points");
      points[this.#circleArray.length] = new fabric.Point(pointer.x, pointer.y);
    }
    if (this.#activeLineFromEndPoint) {
      this.#activeLineFromEndPoint.set({
        x2: pointer.x,
        y2: pointer.y,
      });
    }
    if (this.#activeLineFromStartPoint) {
      this.#activeLineFromStartPoint.set({
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
    let polygon = new fabric.Polygon(this.#pointsArray, {
      stroke: "#333333",
      strokeWidth: 0.5,
      fill: "red",
      opacity: 1,
      dirty: false,
      objectCaching: false,
      selectable: false,
    });
    this.#canvas.add(polygon);
    //this.#canvas.set
    console.log(this.#canvas.getObjects());
    this.#clearDrawerOptions();
  }

  static eventSetter() {
    this.#canvas.on("mouse:down", this.addPoint.bind(this));
    this.#canvas.on("mouse:move", this.addLine.bind(this));
    this.#canvas.on("mouse:dblclick", this.generatePolygon.bind(this));
    console.log(this.#canvas.__eventListeners);
  }

  static eventRemover() {
    this.#canvas.off("mouse:down");
    this.#canvas.off("mouse:move");
    this.#canvas.off("mouse:dblclick");
    console.log(this.#canvas.__eventListeners);
  }
}
