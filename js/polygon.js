class PolygonDrawer {
  static #canvas = null;
  static #pointsArray = [];
  static #linesArray = [];
  static #activeLine = null;

  constructor(canvas) {
    PolygonDrawer.#canvas = canvas;
  }

  static addPoint(options) {
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
      id: id,
    });
    if (this.#pointsArray.length === 0) {
      circle.set({
        fill: "red",
      });
    }
    let line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      strokeDashArray: [5, 5],
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
  }
  static addLine() {}
  static generatePolygon() {}
  static eventSetter() {}
}
