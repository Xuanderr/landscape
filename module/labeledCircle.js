export class LabeledCircle{
    #circleOptions = {
        radius: 10,
        fill: "#ffffff",
        stroke: "#999999",
        strokeWidth: 0.5,
        originX: "center",
        originY: "center",
        selectable: false,
        hasBorders: false,
        hasControls: false,
    };

    #textOptions = {
        fontSize: 14,
        fontFamily: 'Helvetica',
        fill: "#999999",
        originX: "center",
        originY: "center",
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
    };

    #textArea = new fabric.Text(this.#textOptions);
    #circle = new fabric.Circle(this.#circleOptions);
    #leftMeasuredPoint = []
    #rightMeasuredPoint = []
    #centreMeasuredPoint = []
    setCirclePosition(pointX, pointY) {
        this.#centreMeasuredPoint.push(pointX);
        this.#centreMeasuredPoint.push(pointY);
        this.#circle.set({
            left: pointX,
            top: pointY,
        });
        this.#textArea.set({
            left: pointX,
            top: pointY,
        });
    }
    setLeftMeasuredPoint(pointX, pointY) {
        this.#leftMeasuredPoint.push(pointX);
        this.#leftMeasuredPoint.push(pointY);
    }
    setRightMeasuredPoint(pointX, pointY) {
        this.#rightMeasuredPoint.push(pointX);
        this.#rightMeasuredPoint.push(pointY);
    }
    setText() {

    }
    #angle(x1, y1, x2, y2) {
        return (Math.abs(x1*x2 + y1*y2) / Math.sqrt(x1**2 + y1**2) * Math.sqrt(x2**2 + y2**2)) * 180 / Math.PI;
    }

}