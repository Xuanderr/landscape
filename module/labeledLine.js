export class LabeledLine {
    #lineOptions = {
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

    #lineBefore = new fabric.Line([], this.#lineOptions);
    #textArea = null;
    #lineAfter = new fabric.Line([], this.#lineOptions);
    #singleLine = new fabric.Line([], this.#lineOptions);
    #coordinates = []
    #isSingleLineOnCanvas = false;
    #isLabelLineOnCanvas = false;
    #segmentLength = 0;
    #fi = 0;
    constructor(coordsArray, label) {
        this.#coordinates = coordsArray;
        this.#segmentLength = this.#getSegmentLength();
        this.#fi = this.#angle();
        this.#textArea = new fabric.Text(label, this.#textOptions);
        this.#singleLine.set({
            x1: this.#coordinates[0],
            y1: this.#coordinates[1],
            x2: this.#coordinates[2],
            y2: this.#coordinates[3]
        });
        this.#lineBefore.set({
            x1: this.#coordinates[0],
            y1: this.#coordinates[1],
        });
        this.#lineAfter.set({
            x2: this.#coordinates[2],
            y2: this.#coordinates[3]
        });
        if (this.#isShowLabel()) {
            let endBefore =  this.#getSmallRadiusPosition(this.#coordinates, text.width);
            this.#lineBefore.set({
                x2: endBefore.pointX,
                y2: endBefore.pointY
            });
            let textPosition = this.#getSegmentCentre(this.#coordinates);
            this.#textArea.set({
                left: textPosition.pointX,
                top: textPosition.pointY,
                text: (this.#segmentLength / 25).toFixed(2) + 'm'
            })
            let startAfter = this.#getBigRadiusPosition();
            this.#lineAfter.set({
                x1: startAfter.pointX,
                y1: startAfter.pointY
            });
        }
    }
    drawLine(x2, y2, canvas) {
        this.#coordinates[2] = x2;
        this.#coordinates[3] = y2;
        this.#segmentLength = this.#getSegmentLength();
        this.#fi = this.#angle();
        if(this.#isShowLabel()) {
            this.#removeSingleLine(canvas);
            let endBefore =  this.#getSmallRadiusPosition();
            this.#lineBefore.set({
                x2: endBefore.pointX,
                y2: endBefore.pointY
            });
            let textPosition = this.#getSegmentCentre();
            this.#textArea.set({
                left: textPosition.pointX,
                top: textPosition.pointY,
                text: (this.#segmentLength / 25).toFixed(2) + 'm'
            })
            let startAfter = this.#getBigRadiusPosition();
            this.#lineAfter.set({
                x1: startAfter.pointX,
                y1: startAfter.pointY,
                x2: this.#coordinates[2],
                y2: this.#coordinates[3]
            });
            if (!this.#isLabelLineOnCanvas) {
                this.#addToCanvas(canvas, true);
            }
            canvas.renderAll();
            return;
        }
        this.#removeLabelLine(canvas);
        this.#singleLine.set({
            x2: x2,
            y2: y2
        });
        if (!this.#isSingleLineOnCanvas) {
            this.#addToCanvas(canvas, false);
        }
        canvas.renderAll();
    }
    add(canvas) {
        if (this.#isShowLabel()) {
            canvas.add(this.#lineBefore, this.#textArea, this.#lineAfter);
            this.#isLabelLineOnCanvas = true;
            return;
        }
        canvas.add(this.#singleLine);
        this.#isSingleLineOnCanvas = true;
    }
    toGreenLine() {
        this.#lineBefore.set({
            stroke: 'green'
        });
        this.#lineAfter.set({
            stroke: 'green'
        });
    }
    toGrayLine() {
        this.#lineBefore.set({
            stroke: '#999999'
        });
        this.#lineAfter.set({
            stroke: '#999999'
        });
    }
    #getSegmentCentre() {
        let pointX = (this.#coordinates[0] + this.#coordinates[2]) / 2,
            pointY = (this.#coordinates[1] + this.#coordinates[3]) / 2
        return {pointX, pointY}
    }
    #getSegmentLength() {
        return Math.sqrt((this.#coordinates[2] - this.#coordinates[0])**2 + (this.#coordinates[3] - this.#coordinates[1])**2)
    }
    #getSmallRadiusPosition() {
        let radius = this.#segmentLength / 2 - this.#textArea.width / 2,
            pointX = this.#coordinates[0] + radius * Math.cos(this.#fi),
            pointY = this.#coordinates[1] + radius * Math.sin(this.#fi);
        return {pointX, pointY};
    }
    #getBigRadiusPosition() {
        let radius = this.#segmentLength / 2 + this.#textArea.width / 2,
            pointX = this.#coordinates[0] + radius * Math.cos(this.#fi),
            pointY = this.#coordinates[1] + radius * Math.sin(this.#fi);
        return {pointX, pointY};
    }
    #angle() {
        let dy = this.#coordinates[3] - this.#coordinates[1];
        let dx = this.#coordinates[2] - this.#coordinates[0];
        return Math.atan2(dy, dx);
    }
    #isShowLabel() {
        return this.#segmentLength > this.#textArea.width + 20;
    }
    #addToCanvas(canvas, flag) {
        if (flag) {
            canvas.add(this.#lineBefore, this.#textArea, this.#lineAfter);
            this.#isLabelLineOnCanvas = true;
            return;
        }
        canvas.add(this.#singleLine);
        this.#isSingleLineOnCanvas = true;
    }
    #removeLabelLine(canvas){
        if(this.#isLabelLineOnCanvas) {
            canvas.remove(this.#lineBefore, this.#lineAfter, this.#textArea);
            this.#isLabelLineOnCanvas = false;
        }
    }
    #removeSingleLine(canvas){
        if(this.#isSingleLineOnCanvas) {
            canvas.remove(this.#singleLine);
            this.#isSingleLineOnCanvas = false;
        }
    }
}