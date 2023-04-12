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
        if (this.#leftMeasuredPoint.length <= 1 || this.#rightMeasuredPoint.length <= 1) {
            this.#textArea.set({
                text: ''
            });
            return;
        }
        this.#textArea.set({
            text: this.#angle(this.#leftMeasuredPoint[0])
        });
    }
    #angle (x00,y00,x01,y01,x10,y10,x11,y11) {
        let dx0 = x01 - x00;
        let dy0 = y01 - y00;
        let dx1 = x11 - x10;
        let dy1 = y11 - y10;
        return Math.atan2(dx0 * dy1 - dx1 * dy0, dx0 * dx1 + dy0 * dy1) *180 / Math.PI;
    }
}