import {LabeledLine} from './labeledLine.js'
export class PolygonDrawer {
  static #canvas = null;
  static #pointsArray = [];
  static #linesArray = [];
  static #circleArray = [];
  static #activeLineFromEndPoint = null;
  static #activeLineFromStartPoint = null;
  static #activeShape = null;
  static #currentPoint = {
    isSpecialPoint: false,
    x: 0,
    y: 0
  }
  static #circleOptions = {
    radius: 5,
    fill: "#ffffff",
    stroke: "#999999",
    strokeWidth: 0.5,
    originX: "center",
    originY: "center",
    selectable: false,
    hasBorders: false,
    hasControls: false,
    class: "CirclePoint",
    evented: false,
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
    evented: true,
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

  static #pointCheck(pointer) {
    let lastPointLeftBorder = this.#circleArray[this.#circleArray.length -1].left - 5;
    let lastPointRightBorder = this.#circleArray[this.#circleArray.length -1].left + 5;
    let lastPointTopBorder = this.#circleArray[this.#circleArray.length -1].top + 5;
    let lastPointBottomBorder = this.#circleArray[this.#circleArray.length -1].top - 5;
    let startPointLeftBorder = this.#circleArray[0].left - 5;
    let startPointRightBorder = this.#circleArray[0].left + 5;
    let startPointTopBorder = this.#circleArray[0].top + 5;
    let startPointBottomBorder = this.#circleArray[0].top - 5;
    let x = pointer.x;
    let y = pointer.y;
    if((x >= lastPointLeftBorder && x < lastPointRightBorder) || (y >= lastPointBottomBorder && y < lastPointTopBorder) ||
        (x >= startPointLeftBorder && x < startPointRightBorder) || (y >= startPointBottomBorder && y < startPointTopBorder)) {
      this.#currentPoint.isSpecialPoint = true;
      if((x >= lastPointLeftBorder && x < lastPointRightBorder) || (y >= lastPointBottomBorder && y < lastPointTopBorder)) {
        this.#activeLineFromEndPoint.toGreenLine();
        if(x >= lastPointLeftBorder && x < lastPointRightBorder) {
          this.#currentPoint.x = lastPointLeftBorder + 5;
        } else {
          this.#currentPoint.x = x
        }
        if(y >= lastPointBottomBorder && y < lastPointTopBorder) {
          this.#currentPoint.y = lastPointBottomBorder + 5;
        } else {
          this.#currentPoint.y = y
        }
      } else {
        if(this.#activeLineFromStartPoint) {
          this.#activeLineFromStartPoint.toGreenLine();
        }
        if(x >= startPointLeftBorder && x < startPointRightBorder) {
          this.#currentPoint.x = startPointLeftBorder + 5;
        } else {
          this.#currentPoint.x = x
        }
        if(y >= startPointBottomBorder && y < startPointTopBorder) {
          this.#currentPoint.y = startPointBottomBorder + 5;
        } else {
          this.#currentPoint.y = y
        }
      }
    } else {
      this.#currentPoint.x = x
      this.#currentPoint.y = y
      this.#activeLineFromEndPoint.toGrayLine();
      if(this.#activeLineFromStartPoint) {
        this.#activeLineFromStartPoint.toGrayLine();
      }
    }
  }
  static addPoint(options) {
    let pointer = this.#canvas.getPointer(options.e, false);
    let circle = new fabric.Circle(this.#circleOptions);
    if (this.#circleArray.length === 0) {
      circle.set({
        fill: "red",
      });
      this.#currentPoint.x = pointer.x;
      this.#currentPoint.y = pointer.y;
    }
    circle.set({
      left: this.#currentPoint.x,
      top: this.#currentPoint.y,
    });
    if (this.#circleArray.length === 0)
    this.#pointsArray.push(new fabric.Point(this.#currentPoint.x, this.#currentPoint.y));
    if(this.#activeLineFromEndPoint) {
      this.#activeLineFromEndPoint.toGrayLine();
    }
    this.#activeLineFromEndPoint = new LabeledLine([this.#currentPoint.x, this.#currentPoint.y, this.#currentPoint.x, this.#currentPoint.y], '')
    this.#circleArray.push(circle);
    if (!this.#activeLineFromStartPoint && this.#circleArray.length > 1) {
      let x = this.#pointsArray[0].x;
      let y = this.#pointsArray[0].y;
      this.#activeLineFromStartPoint = new fabric.Line([x, y, x, y], this.#lineOptions);
      this.#activeLineFromStartPoint = new LabeledLine([x, y, x, y], '')
      this.#activeLineFromStartPoint.add(this.#canvas);
    }

    let polygon = new fabric.Polygon(this.#pointsArray, this.#polygonOptions);

    if (this.#activeShape) {
      this.#canvas.remove(this.#activeShape);
    }
    this.#activeShape = polygon;

    this.#linesArray.push(this.#activeLineFromEndPoint);
    this.#canvas.add(circle, this.#activeShape);
    this.#activeLineFromEndPoint.add(this.#canvas);
    this.#canvas.renderAll();
  }

  static addLine(options) {
    if(this.#circleArray.length !== 0){
      let pointer = this.#canvas.getPointer(options.e, false);
      this.#pointCheck(pointer)
      if (this.#activeShape) {
        let points = this.#activeShape.get("points");
        points[this.#circleArray.length] = new fabric.Point(this.#currentPoint.x, this.#currentPoint.y);
      }
      this.#activeLineFromEndPoint.lineTo(this.#currentPoint.x,this.#currentPoint.y, this.#canvas);
      if(this.#activeLineFromStartPoint) {
        this.#activeLineFromStartPoint.lineTo(this.#currentPoint.x,this.#currentPoint.y, this.#canvas);
      }
      this.#canvas.renderAll();
    }
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
  }

  static eventRemover() {
    this.#canvas.off("mouse:down");
    this.#canvas.off("mouse:move");
    this.#canvas.off("mouse:dblclick");
  }
}