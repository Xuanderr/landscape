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

  static #specialPointCheck(pointer) {
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
        this.#activeLineFromEndPoint.set({
          stroke: 'green'
        })
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
        this.#activeLineFromStartPoint.set({
          stroke: 'green'
        })
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
      this.#activeLineFromEndPoint.set({
        stroke: '#999999'
      })
      this.#activeLineFromStartPoint.set({
        stroke: '#999999'
      })
    }
  }
  static addPoint(options) {
    console.log(options.e)
    let pointer = this.#canvas.getPointer(options.e, false);
    //if (this.#circleArray.length === 0
        // ||
        // (pointer.x !== this.#circleArray[this.#circleArray.length-1].left &&
        //     pointer.y !== this.#circleArray[this.#circleArray.length-1].top)
    //)
    //{
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
      if(this.#activeLineFromEndPoint) {
        this.#activeLineFromEndPoint.set({
          stroke: '#999999'
        })
      }
      this.#activeLineFromEndPoint = new fabric.Line(
          [pointer.x, pointer.y, pointer.x, pointer.y],
          this.#lineOptions
      );
      this.#circleArray.push(circle);
      if (!this.#activeLineFromStartPoint) {
        let x = this.#pointsArray[0].x;
        let y = this.#pointsArray[0].y;
        this.#activeLineFromStartPoint = new fabric.Line([x, y, x, y], this.#lineOptions);
        this.#activeLineFromStartPoint.on('object:modified', () => {
          console.log('kek')
        })
        console.log(this.#activeLineFromStartPoint)
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
      console.log(this.#circleArray)
    //}
  }

  static addLine(options) {
    if(this.#circleArray.length !== 0){
      let pointer = this.#canvas.getPointer(options.e, false);
      this.#specialPointCheck(pointer)
      if (this.#activeShape) {
        let points = this.#activeShape.get("points");
        points[this.#circleArray.length] = new fabric.Point(this.#currentPoint.x, this.#currentPoint.y);
      }
      this.#activeLineFromEndPoint.set({
        x2: this.#currentPoint.x,
        y2: this.#currentPoint.y,
      });
      this.#activeLineFromStartPoint.set({
        x2: this.#currentPoint.x,
        y2: this.#currentPoint.y
      });
      this.#activeLineFromStartPoint.fire('object:modified')
      // if (this.#activeShape) {
      //   let points = this.#activeShape.get("points");
      //   points[this.#circleArray.length] = new fabric.Point(pointer.x, pointer.y);
      // }
      // this.#activeLineFromEndPoint.set({
      //   x2: pointer.x,
      //   y2: pointer.y,
      // });
      // this.#activeLineFromStartPoint.set({
      //   x2: pointer.x,
      //   y2: pointer.y,
      // });
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