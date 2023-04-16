import {LabeledLine} from './labeledLine.js'
export class PolygonDrawer {
  static #canvas = null;
  static #pointsArray = [];
  static #linesArray = [];
  static #circleArray = [];
  static #activeLineFromEndPoint = null;
  static #activeLineFromStartPoint = null;
  static #activeShape = null;
  static #intersectionLine = null;
  static #currentPoint = {
    x: 0,
    y: 0
  }
  static #circleOptions = {
    radius: 5,
    fill: "red",
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
    evented: false,
  };

  static #polygonOptions = {
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
  // static #intersectionCheck(pointer) {
  //   if(!this.#intersectionLine) {
  //     console.log(this.#linesArray.length)
  //     for(let i = 0; i < this.#linesArray.length; i++) {
  //       if(this.#pointOnLine(this.#linesArray[i], pointer.x, pointer.y)) {
  //         this.#intersectionLine = this.#linesArray[i];
  //         break;
  //       }
  //     }
  //     console.log('kek1')
  //     return;
  //   }
  //   console.log('kek')
  //   let isRedLineStartPoint = false;
  //   let isRedLineEndPoint = false;
  //   if (this.#lineIntersection(this.#intersectionLine, this.#activeLineFromEndPoint)) {
  //     this.#activeLineFromEndPoint.toRedLine();
  //     isRedLineEndPoint = true;
  //   }
  //   if(this.#activeLineFromStartPoint) {
  //     if (this.#lineIntersection(this.#intersectionLine, this.#activeLineFromStartPoint)) {
  //       this.#activeLineFromStartPoint.toRedLine();
  //       isRedLineStartPoint = true;
  //     }
  //   }
  //   if(!isRedLineStartPoint && !isRedLineEndPoint) {
  //     this.#intersectionLine = null;
  //   }
  // }
 //
  // static #pseudoScalar(vector1X, vector1Y, vector2X, vector2Y) {
  //   return vector1X * vector2Y - vector2X * vector1Y
  // }
  //
  // static #projectionIntersections(start1, start2, end1, end2) {
  //   return Math.max(start1, start2) <= Math.min(end1, end2);
  // }
  // static #pointOnLine(line, pointX, pointY) {
  //   if(!this.#projectionIntersections(line.getStartX(), pointX, line.getEndX(), pointX)) {
  //     return false;
  //   }
  //   if(!this.#projectionIntersections(line. getStartY(), pointY, line.getEndY(), pointY)) {
  //     return false;
  //   }
  //   let pointAsVector = [];
  //   pointAsVector.push(pointX - line.getCoords()[0])
  //   pointAsVector.push(pointY - line.getCoords()[1])
  //   return this.#pseudoScalar(line.getVector()[0], line.getVector()[1], pointAsVector[0], pointAsVector[1]) === 0;
  // }
  //
  // static #lineIntersection(line1, line2) {
  //   if(!this.#projectionIntersections(line1.getStartX(), line2.getStartX(), line1.getEndX(), line2.getEndX())) {
  //     return false;
  //   }
  //   if(!this.#projectionIntersections(line1.getStartY(), line2.getStartY(), line1.getEndY(), line2.getEndY())) {
  //     return false;
  //   }
  //   let ab = line1.getVector();
  //   let AcAd = line1.getVectors(line2);
  //   let cd = line2.getVector();
  //   let CaCb= line2.getVectors(line1);
  //
  //   let d1 = this.#pseudoScalar(ab[0], ab[1], AcAd[0], AcAd[1]);
  //   let d2 = this.#pseudoScalar(ab[0], ab[1], AcAd[2], AcAd[3]);
  //   let d3 = this.#pseudoScalar(cd[0], cd[1], CaCb[0], CaCb[1]);
  //   let d4 = this.#pseudoScalar(cd[0], cd[1], CaCb[2], CaCb[3]);
  //
  //  return (((d1 <= 0 && d2 >= 0) || (d1 >= 0 && d2 <= 0)) &&
  //       ((d3 <= 0 && d4 >= 0) || (d3 >= 0 && d4 <= 0)))
  // }
  static addPoint(options) {
    if(this.#circleArray.length !== 0 &&
        this.#circleArray[this.#circleArray.length-1]
            .containsPoint(new fabric.Point(this.#currentPoint.x,this.#currentPoint.y))) {
      this.generatePolygon(options);
      return;
    }
    let circle = new fabric.Circle(this.#circleOptions);
    if (this.#circleArray.length === 0) {
      let pointer = this.#canvas.getPointer(options.e, false);
      this.#currentPoint.x = pointer.x;
      this.#currentPoint.y = pointer.y;
    }
    circle.set({
      left: this.#currentPoint.x,
      top: this.#currentPoint.y,
    });
    this.#circleArray.push(circle);
    this.#pointsArray.push(new fabric.Point(this.#currentPoint.x, this.#currentPoint.y));
    if(this.#activeLineFromEndPoint) {
      this.#activeLineFromEndPoint.toGrayLine();
    }

    if(this.#activeLineFromEndPoint) {
      this.#linesArray.push(this.#activeLineFromEndPoint);
    }
    this.#activeLineFromEndPoint = new LabeledLine(
        [this.#currentPoint.x, this.#currentPoint.y, this.#currentPoint.x, this.#currentPoint.y], '')

    if (!this.#activeLineFromStartPoint && this.#circleArray.length > 1) {
      let x = this.#pointsArray[0].x;
      let y = this.#pointsArray[0].y;
      this.#activeLineFromStartPoint = new LabeledLine([x, y, x, y], '')
      this.#activeLineFromStartPoint.add(this.#canvas);
    }
    if(this.#activeLineFromStartPoint) {
      this.#activeLineFromStartPoint.toGrayLine();
    }

    let polygon = new fabric.Polygon(this.#pointsArray, this.#polygonOptions);
    if (this.#activeShape) {
      this.#canvas.remove(this.#activeShape);
    }
    this.#activeShape = polygon;

    this.#canvas.add(circle, this.#activeShape);
    this.#activeLineFromEndPoint.add(this.#canvas);
    this.#canvas.renderAll();
  }

  static addLine(options) {
    if(this.#circleArray.length !== 0){
      this.#circleArray[this.#circleArray.length-1].set({
        fill: '#ffffff'
      });
      let pointer = this.#canvas.getPointer(options.e, false);
      this.#pointCheck(pointer);
      //this.#intersectionCheck(pointer);
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

  static loadPattern(url, shape) {
    fabric.util.loadImage(url, function(img) {
      shape.set('fill',  new fabric.Pattern({
        source: img,
        //repeat: 'repeat'
      }));
    })
  }
  static generatePolygon(options) {
    let pointer = this.#canvas.getPointer(options.e, false);
    this.#pointsArray.push(new fabric.Point(pointer.x, pointer.y));
    this.#circleArray.forEach((element) => {
      this.#canvas.remove(element);
    });
    this.#canvas
      .remove(this.#activeLineFromEndPoint)
      .remove(this.#activeLineFromStartPoint)
      .remove(this.#activeShape);
    let polygon = new fabric.Polygon(this.#pointsArray, {
      //strokeDashArray: [5, 5],
      strokeWidth: 4,
      stroke: "red",
      opacity: 0.1,
      //fill: new fabric.Pattern({source: '../img/retina_wood.png'}),
      //fill: 'red',
      dirty: false,
      objectCaching: false,
      selectable: false,
      evented: false
    });
    this.#canvas.requestRenderAll();
    this.#canvas.add(polygon);
    //this.#canvas.renderAll.bind(this.#canvas)
    //PolygonDrawer.loadPattern('../img/retina_wood.png', polygon);
    //this.#canvas.renderAll();
    console.log(this.#canvas.getObjects());
    this.#clearDrawerOptions();
  }
  static eventSetter() {
    this.#canvas.on("mouse:down", this.addPoint.bind(this));
    this.#canvas.on("mouse:move", this.addLine.bind(this));
  }
  static eventRemover() {
    this.#canvas.off("mouse:down");
    this.#canvas.off("mouse:move");
  }
}