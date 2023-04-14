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
    #asVector = {
        x: 0,
        y: 0
    }
    #coords  = {
        x1: undefined,
        y1: undefined,
        x2: undefined,
        y2: undefined
    }
    #startPoint = {
        x: undefined,
        y: undefined
    }
    #endPoint = {
        x: undefined,
        y: undefined
    }
    constructor(coordsArray, label) {
        this.#coords.x1 = coordsArray[0];
        this.#coords.y1 = coordsArray[1];
        this.#coords.x2 = coordsArray[2];
        this.#coords.y2 = coordsArray[3];
        this.#coordinates = coordsArray;
        this.#innerOptionsSetter();
        this.#textArea = new fabric.Text(label, this.#textOptions);
        this.#singleLine.set({
            x1: this.#coords.x1,
            y1: this.#coords.y1,
            x2: this.#coords.x2,
            y2: this.#coords.y2
        });
        this.#lineBefore.set({
            x1: this.#coords.x1,
            y1: this.#coords.y1,
        });
        this.#lineAfter.set({
            x2: this.#coords.x2,
            y2: this.#coords.y2
        });
        if (this.#isShowLabel()) {
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
                y1: startAfter.pointY
            });
        }
    }
    lineTo(x2, y2, canvas) {
        this.#coords.x2 = x2;
        this.#coords.y2 = y2;
        this.#innerOptionsSetter();
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
                x2: this.#coords.x2,
                y2: this.#coords.y2
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
    isPointOnLine(x, y) {
        if(x >= Math.min(this.#coordinates[0], this.#coordinates[2]) &&
           x <= Math.max(this.#coordinates[0], this.#coordinates[2]) &&
            y >= Math.min(this.#coordinates[1], this.#coordinates[3]) &&
            y <= Math.max(this.#coordinates[1], this.#coordinates[3]))
        {
            let vectorToPoint = {
                x: x - this.#coordinates[0],
                y: y - this.#coordinates[1]
            };
            return this.#pseudoScalar(this.#asVector.x, this.#asVector.y, vectorToPoint.x, vectorToPoint.y) === 0;
        }
        return false;
    }
    intersect(line) {
    }

    getFI() {
        return this.#fi;
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
    // getCoords() {
    //     return this.#coordinates;
    // }
    // getCoordsX() {
    //     let res = []
    //     res.push(this.#coordinates[0], this.#coordinates[2]);
    //     return res;
    // }
    // getCoordsY() {
    //     let res = []
    //     res.push(this.#coordinates[1], this.#coordinates[3]);
    //     return res;
    // }
    getVector() {
        return this.#asVector;
    }
    addEventListener(event) {
        this.#lineBefore.on(event, () => {
            console.log('lineBefore')
        });
        this.#textArea.on(event, () => {
            console.log('textArea')
            console.log(this.#lineBefore)
            console.log(this.#lineAfter)
        })
        this.#lineAfter.on(event, () => {
            console.log('lineAfter')
        });
    }
    setStartPoint() {
        let minX = Math.min(this.#coords.x1, this.#coords.x2);
        if(minX === this.#coords.x1) {
            return {x: this.#coords.x1, y: this.#coords.y1}
        } else {
            return {x: this.#coords.x2, y: this.#coords.y2}
        }
    }
    setEndPoint() {
        let maxX = Math.max(this.#coords.x1, this.#coords.x2);
        if(maxX === this.#coords.x1) {
            return {x: this.#coords.x1, y: this.#coords.y1}
        } else {
            return {x: this.#coords.x2, y: this.#coords.y2}
        }
    }
    #pseudoScalar(vector1X, vector1Y, vector2X, vector2Y) {
        return vector1X * vector2Y - vector2X * vector1Y
    }
    #innerOptionsSetter() {
        this.#asVector.x = this.#coordinates[2] -  this.#coordinates[0];
        this.#asVector.y = this.#coordinates[3] -  this.#coordinates[1];
        this.#segmentLength = this.#getSegmentLength();
        this.#fi = this.#angle();
    }
    #getSegmentCentre() {
        let pointX = (this.#coords.x1 + this.#coords.x2) / 2,
            pointY = (this.#coords.y1 + this.#coords.y2) / 2
        return {pointX, pointY}
    }
    #getSegmentLength() {
        return Math.sqrt((this.#coords.x2 - this.#coords.x1)**2 + (this.#coords.y2 - this.#coords.y1)**2)
    }
    #getSmallRadiusPosition() {
        let radius = this.#segmentLength / 2 - this.#textArea.width / 2,
            pointX = this.#coords.x1 + radius * Math.cos(this.#fi),
            pointY = this.#coords.y1 + radius * Math.sin(this.#fi);
        return {pointX, pointY};
    }
    #getBigRadiusPosition() {
        let radius = this.#segmentLength / 2 + this.#textArea.width / 2,
            pointX = this.#coords.x1 + radius * Math.cos(this.#fi),
            pointY = this.#coords.y1 + radius * Math.sin(this.#fi);
        return {pointX, pointY};
    }
    #angle() {
        let dy = this.#coords.y2 - this.#coords.y1;
        let dx = this.#coords.x2 - this.#coords.x1;
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